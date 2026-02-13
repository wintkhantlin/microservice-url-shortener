FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

FROM oven/bun:latest

WORKDIR /app

# Copy the build output from the builder stage
COPY --from=builder /app/dist ./dist

# Install serve using bun
RUN bun install -g serve

EXPOSE 3000

# Use bun to run the serve command in SPA mode
CMD ["bun", "x", "serve", "-s", "dist", "-l", "3000"]
