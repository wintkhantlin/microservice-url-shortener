import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    out: "./drizzle",
    schema: "./src/db/schema.ts",
    dbCredentials: {
        url: process.env.MANAGEMENT_DATABASE_URL!
    }
});
