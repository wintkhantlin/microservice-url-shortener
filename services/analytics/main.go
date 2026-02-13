package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-playground/validator/v10"
	"github.com/wintkhantlin/url2short-analytics/internal/api"
	"github.com/wintkhantlin/url2short-analytics/internal/config"
	"github.com/wintkhantlin/url2short-analytics/internal/db"
	"github.com/wintkhantlin/url2short-analytics/internal/kafka"
)

func main() {
	cfg := config.Load()
	validate := validator.New()

	// 1. Connect to ClickHouse
	conn, err := db.Connect(cfg)
	if err != nil {
		slog.Error("Failed to connect to ClickHouse", "error", err)
		os.Exit(1)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// 2. Expose API (Gin)
	go api.Start(conn, cfg)

	// 3. Kafka Consumer
	kafka.StartConsumer(ctx, conn, validate, cfg)
}
