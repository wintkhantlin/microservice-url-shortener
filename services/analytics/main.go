package main

import (
	"log"

	"github.com/go-playground/validator/v10"
	"github.com/wintkhantlin/url2short-analytics/internal/api"
	"github.com/wintkhantlin/url2short-analytics/internal/db"
	"github.com/wintkhantlin/url2short-analytics/internal/kafka"
)

func main() {
	validate := validator.New()

	// 1. Connect to ClickHouse
	conn, err := db.Connect()
	if err != nil {
		log.Fatalf("failed to connect to clickhouse: %v", err)
	}

	// 2. Expose API (Gin)
	go func() {
		if err := api.Start(conn, ":8080"); err != nil {
			log.Fatalf("failed to start api: %v", err)
		}
	}()

	// 3. Kafka Consumer
	kafka.StartConsumer(conn, validate)
}
