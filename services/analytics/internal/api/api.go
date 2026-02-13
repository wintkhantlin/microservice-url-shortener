package api

import (
	"fmt"
	"net/http"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/gin-gonic/gin"
	"github.com/wintkhantlin/url2short-analytics/internal/db"
)

func Start(conn clickhouse.Conn, port string) error {
	r := gin.Default()

	r.GET("/analytics", func(c *gin.Context) {
		code := c.Query("code")
		if code == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "code is required"})
			return
		}

		summary, err := db.GetAnalytics(c.Request.Context(), conn, code)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("failed to get analytics summary: %v", err)})
			return
		}

		c.JSON(http.StatusOK, summary)
	})

	fmt.Printf("Analytics API (Gin) listening on %s\n", port)
	return r.Run(port)
}
