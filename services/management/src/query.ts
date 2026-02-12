import db from "./db";
import { alias } from "./db/schema";
import { eq, and } from "drizzle-orm";

async function getAllAliases(): Promise<typeof alias.$inferSelect[]> {
    return db.select().from(alias);
}

async function getAliasByCode(code: string): Promise<typeof alias.$inferSelect | null> {
    const [result] = await db.select().from(alias).where(eq(alias.code, code));
    return result || null;
}

async function getAliasesByUserId(user_id: string): Promise<typeof alias.$inferSelect[]> {
    return db.select().from(alias).where(eq(alias.user_id, user_id));
}

export { getAllAliases, getAliasByCode, getAliasesByUserId };
