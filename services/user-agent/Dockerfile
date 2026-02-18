FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o useragent main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/useragent .

EXPOSE 50052

CMD ["./useragent"]
