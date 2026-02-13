package config

import (
	"os"
	"strings"
)

type Config struct {
	ClickHouseAddr     string
	ClickHouseUser     string
	ClickHousePassword string
	ClickHouseDB       string
	KafkaBrokers       []string
	KafkaTopic         string
	KafkaGroupID       string
	APIPort            string
}

func Load() *Config {
	return &Config{
		ClickHouseAddr:     getEnv("CLICKHOUSE_ADDR", "127.0.0.1:9000"),
		ClickHouseUser:     getEnv("CLICKHOUSE_USER", "default"),
		ClickHousePassword: getEnv("CLICKHOUSE_PASSWORD", "default"),
		ClickHouseDB:       getEnv("CLICKHOUSE_DB", "default"),
		KafkaBrokers:       strings.Split(getEnv("KAFKA_BROKERS", "localhost:9094"), ","),
		KafkaTopic:         getEnv("KAFKA_TOPIC", "analytics-event"),
		KafkaGroupID:       getEnv("KAFKA_GROUP_ID", "analytics-group"),
		APIPort:            getEnv("API_PORT", "8080"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
