FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

RUN mkdir -p .db

EXPOSE 8000

CMD ["bun", "run", "src/index.ts"]
