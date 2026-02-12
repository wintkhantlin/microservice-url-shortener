CREATE TABLE "alias" (
	"code" varchar(12) PRIMARY KEY NOT NULL,
	"target" varchar(2048) NOT NULL,
	"user_id" varchar(100) NOT NULL,
	"metadata" jsonb,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "alias_user_id_idx" ON "alias" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "alias_expires_at_idx" ON "alias" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "alias_code_idx" ON "alias" USING btree ("code");