import db from "./db";
import { alias } from "./db/schema";
import { generateRandomCode } from "./utils/generateRandomCode";
import { eq, and } from "drizzle-orm";

interface CreateAliasParams {
    user_id: string;
    target: string;
    metadata?: Record<string, any>;
    expires_at?: Date;
}

interface UpdateAliasParams {
    target?: string;
    metadata?: Record<string, any>;
    expires_at?: Date;
}

const MAX_RETRIES = 5;
const UNIQUE_VIOLATION_ERROR = "23505";

export async function createAlias(params: CreateAliasParams): Promise<typeof alias.$inferSelect> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const [newAlias] = await db
                .insert(alias)
                .values({
                    code: generateRandomCode(6),
                    ...params,
                })
                .returning();

            if(!newAlias) continue;

            return newAlias;
        } catch (error: any) {
            if (error.code !== UNIQUE_VIOLATION_ERROR) {
                throw error;
            }

            console.warn(`Alias collision detected (attempt ${attempt}/${MAX_RETRIES})`);

            if (attempt === MAX_RETRIES) {
                throw new Error(`Failed to generate unique alias after ${MAX_RETRIES} attempts.`);
            }
        }
    }

    throw new Error("Unexpected exhaustion of retry loop");
}

export async function updateAlias(code: string, user_id: string, params: UpdateAliasParams): Promise<typeof alias.$inferSelect | null> {
    const [updatedAlias] = await db
        .update(alias)
        .set(params)
        .where(and(eq(alias.code, code), eq(alias.user_id, user_id)))
        .returning();
    
    return updatedAlias || null;
}

export async function deleteAlias(code: string, user_id: string): Promise<boolean> {
    const result = await db
        .delete(alias)
        .where(and(eq(alias.code, code), eq(alias.user_id, user_id)))
        .returning();
    
    return result.length > 0;
}
