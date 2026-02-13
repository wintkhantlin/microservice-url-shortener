package kafka

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/go-playground/validator/v10"
	"github.com/segmentio/kafka-go"
	"github.com/ua-parser/uap-go/uaparser"
	"github.com/wintkhantlin/url2short-analytics/internal/config"
	"github.com/wintkhantlin/url2short-analytics/internal/db"
	"github.com/wintkhantlin/url2short-analytics/internal/models"
)

var uaParser *uaparser.Parser

func init() {
	uaParser = uaparser.NewFromSaved()
}

type IPLocation struct {
	Status  string `json:"status"`
	Country string `json:"country"`
	Region  string `json:"regionName"`
}

func getLocation(ctx context.Context, ip string) (string, string) {
	if ip == "127.0.0.1" || ip == "localhost" || ip == "" {
		return "internal", "internal"
	}

	client := &http.Client{Timeout: 2 * time.Second}
	req, err := http.NewRequestWithContext(ctx, "GET", fmt.Sprintf("http://ip-api.com/json/%s", ip), nil)
	if err != nil {
		return "unknown", "unknown"
	}

	resp, err := client.Do(req)
	if err != nil {
		return "unknown", "unknown"
	}
	defer resp.Body.Close()

	var loc IPLocation
	if err := json.NewDecoder(resp.Body).Decode(&loc); err != nil {
		return "unknown", "unknown"
	}

	if loc.Status != "success" {
		return "unknown", "unknown"
	}

	return loc.Country, loc.Region
}

func StartConsumer(ctx context.Context, conn clickhouse.Conn, validate *validator.Validate, cfg *config.Config) {
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: cfg.KafkaBrokers,
		Topic:   cfg.KafkaTopic,
		GroupID: cfg.KafkaGroupID,
	})

	defer reader.Close()

	slog.Info("Starting to read analytics events", "topic", cfg.KafkaTopic, "group", cfg.KafkaGroupID)
	for {
		select {
		case <-ctx.Done():
			slog.Info("Shutting down Kafka consumer...")
			return
		default:
			msg, err := reader.ReadMessage(ctx)
			if err != nil {
				slog.Error("Error reading message", "error", err)
				continue
			}

			var event models.AnalyticsEvent
			if err := json.Unmarshal(msg.Value, &event); err != nil {
				slog.Error("Error unmarshaling event", "error", err)
				continue
			}

			// 1. Parse User-Agent if present
			if event.UserAgent != "" {
				client := uaParser.Parse(event.UserAgent)
				event.Browser = client.UserAgent.Family
				event.OS = client.Os.Family
				event.Device = client.Device.Family
			}

			// 2. Parse IP if present
			if event.IP != "" {
				event.Country, event.State = getLocation(ctx, event.IP)
			}

			// Fill defaults for missing dimensions if parsing failed or was skipped
			if event.Browser == "" {
				event.Browser = "unknown"
			}
			if event.OS == "" {
				event.OS = "unknown"
			}
			if event.Device == "" {
				event.Device = "unknown"
			}
			if event.Country == "" {
				event.Country = "unknown"
			}
			if event.State == "" {
				event.State = "unknown"
			}

			if err := validate.Struct(event); err != nil {
				slog.Error("Validation failed for event", "error", err)
				continue
			}

			// Transform fields to lowercase except code
			event.Transform()

			if err := db.Insert(ctx, conn, event); err != nil {
				slog.Error("Error inserting into ClickHouse", "error", err)
				continue
			}

			slog.Info("Successfully inserted event", "code", event.Code)
		}
	}
}
