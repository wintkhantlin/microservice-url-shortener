package main

import (
	"context"
	"fmt"
	"net"
	"os"

	"github.com/wintkhantlin/url2short-useragent/gen"
	"github.com/wintkhantlin/url2short-useragent/pkg/parser"
	"google.golang.org/grpc"
)

type server struct {
	gen.UnimplementedUserAgentServiceServer
}

func (s *server) Parse(ctx context.Context, req *gen.UserAgentRequest) (*gen.UserAgentResponse, error) {
	info := parser.ParseUserAgent(req.UserAgent)
	return &gen.UserAgentResponse{
		Browser: info.Browser,
		Os:      info.OS,
		Device:  info.Device,
	}, nil
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "50052"
	}

	listener, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		panic(err)
	}

	grpcServer := grpc.NewServer()
	gen.RegisterUserAgentServiceServer(grpcServer, &server{})

	fmt.Printf("UserAgent Service running on port :%s\n", port)
	if err := grpcServer.Serve(listener); err != nil {
		panic(err)
	}
}
