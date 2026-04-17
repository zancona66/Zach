import { env } from "../config/env.js";

export interface MemoryRecord {
  key: string;
  value: unknown;
  updatedAt: string;
  tags?: string[];
}

export interface MemoryStore {
  enabled: boolean;
  get(key: string): Promise<MemoryRecord | null>;
  set(key: string, value: unknown, tags?: string[]): Promise<MemoryRecord>;
  list(tag?: string): Promise<MemoryRecord[]>;
  clear(): Promise<void>;
}

export function createMemoryStore(): MemoryStore {
  const db = new Map<string, MemoryRecord>();
  return {
    enabled: env.ENABLE_MEMORY,
    async get(key) {
      if (!env.ENABLE_MEMORY) return null;
      return db.get(key) ?? null;
    },
    async set(key, value, tags) {
      const rec: MemoryRecord = {
        key,
        value,
        updatedAt: new Date().toISOString(),
        tags,
      };
      if (env.ENABLE_MEMORY) db.set(key, rec);
      return rec;
    },
    async list(tag) {
      if (!env.ENABLE_MEMORY) return [];
      const out = Array.from(db.values());
      return tag ? out.filter((r) => r.tags?.includes(tag)) : out;
    },
    async clear() {
      db.clear();
    },
  };
}
