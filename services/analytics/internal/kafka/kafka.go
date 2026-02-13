package kafka

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/go-playground/validator/v10"
	"github.com/segmentio/kafka-go"
	"github.com/wintkhantlin/url2short-analytics/internal/db"
	"github.com/wintkhantlin/url2short-analytics/internal/models"
)

func StartConsumer(conn clickhouse.Conn, validate *validator.Validate) {
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"localhost:9094"},
		Topic:   "analytics-event",
		GroupID: "analytics-group",
	})

	defer reader.Close()

	fmt.Println("Starting to read analytics events and insert into ClickHouse...")
	for {
		msg, err := reader.ReadMessage(context.Background())
		if err != nil {
			fmt.Printf("Error reading message: %v\n", err)
			continue
		}

		var event models.AnalyticsEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			fmt.Printf("Error unmarshaling event: %v\n", err)
			continue
		}

		if err := validate.Struct(event); err != nil {
			fmt.Printf("Validation failed for event: %v\n", err)
			continue
		}

		// Transform fields to lowercase except code
		event.Transform()

		if err := db.Insert(context.Background(), conn, event); err != nil {
			fmt.Printf("Error inserting into ClickHouse: %v\n", err)
			continue
		}

		fmt.Printf("Successfully inserted event for code: %s (transformed)\n", event.Code)
	}
}
