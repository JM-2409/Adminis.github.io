import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kqpegzphhogumomueujm.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcGVnenBoaG9ndW1vbXVldWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NjQxNjEsImV4cCI6MjEwNjE0MDE2MX0.P1xuhEBe10WhTaVEaDRo51gUb0hU7NrWVqjSRHGa3xA";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcGVnenBoaG9ndW1vbXVldWptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDU2NDE2MSwiZXhwIjoyMTA2MTQwMTYxfQ.ZxgpRLsEbSjF-8nDymh4JZ0bkwLbgkiLfUzte82XMa4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const rawSupabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Local JSON file persistence for fallback
const DB_FILE = path.join(process.cwd(), "local_db.json");

interface LocalDbSchema {
  [table: string]: Record<string, unknown>[];
}

function readLocalDb(): LocalDbSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch {
    // Ignore read errors
  }
  return {
    complexes: [],
    users: [],
    units: [],
    visitors: [],
    parcels: [],
    reservations: [],
    moving_requests: [],
    infractions: [],
    announcements: [],
  };
}

function writeLocalDb(data: LocalDbSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Ignore write errors
  }
}

export const supabaseAdmin = {
  from: (table: string) => {
    const realQuery = rawSupabaseAdmin.from(table);

    return {
      select: (columns: string = "*", options?: { count?: "exact" | "planned" | "estimated"; head?: boolean }) => {
        const filters: Array<(item: Record<string, unknown>) => boolean> = [];
        let limitCount: number | null = null;

        async function executeSelect(): Promise<{ data: unknown; count: number | null; error: unknown }> {
          const res = await realQuery.select(columns, options);
          if (res.error && res.error.code === "PGRST205") {
            const db = readLocalDb();
            let items = db[table] || [];

            for (const filter of filters) {
              items = items.filter(filter);
            }

            if (limitCount !== null) {
              items = items.slice(0, limitCount);
            }

            if (options?.head && options?.count === "exact") {
              return { data: null, count: items.length, error: null };
            }

            return { data: items, count: items.length, error: null };
          }
          return { data: res.data, count: res.count, error: res.error };
        }

        const chain = {
          eq: (col: string, val: unknown) => {
            filters.push((item: Record<string, unknown>) => item[col] === val);
            return chain;
          },
          order: (_col: string, _opts?: Record<string, unknown>) => chain,
          limit: (n: number) => {
            limitCount = n;
            return chain;
          },
          single: async (): Promise<{ data: Record<string, unknown> | null; error: unknown }> => {
            const res = await executeSelect();
            if (res.error) {
              const db = readLocalDb();
              let items = db[table] || [];

              for (const filter of filters) {
                items = items.filter(filter);
              }
              const found = items[0] || null;
              return { data: found, error: found ? null : { message: "Not found" } };
            }
            return {
              data: (Array.isArray(res.data) ? res.data[0] : res.data) as Record<string, unknown> | null,
              error: res.error,
            };
          },
          then: <TResult1 = unknown, TResult2 = never>(
            onfulfilled?: ((value: { data: unknown; count: number | null; error: unknown }) => TResult1 | PromiseLike<TResult1>) | null,
            onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
          ) => executeSelect().then(onfulfilled, onrejected),
        };

        return chain;
      },

      insert: (payload: Record<string, unknown> | Record<string, unknown>[]) => {
        const chain = {
          select: () => ({
            single: async (): Promise<{ data: Record<string, unknown> | null; error: unknown }> => {
              const res = await realQuery.insert(payload as never).select().single();
              if (res.error && res.error.code === "PGRST205") {
                const db = readLocalDb();
                if (!db[table]) db[table] = [];

                const payloadObj = Array.isArray(payload) ? payload[0] : payload;
                const newItem = {
                  id: payloadObj.id || `id-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                  created_at: new Date().toISOString(),
                  ...payloadObj,
                };

                db[table].unshift(newItem);
                writeLocalDb(db);
                return { data: newItem, error: null };
              }
              return { data: res.data as Record<string, unknown> | null, error: res.error };
            },
          }),
          then: <TResult1 = unknown, TResult2 = never>(
            onfulfilled?: ((value: { data: unknown; error: unknown }) => TResult1 | PromiseLike<TResult1>) | null,
            onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
          ) => {
            async function executeInsert() {
              const res = await realQuery.insert(payload as never);
              if (res.error && res.error.code === "PGRST205") {
                const db = readLocalDb();
                if (!db[table]) db[table] = [];

                const itemsToInsert = Array.isArray(payload) ? payload : [payload];
                for (const p of itemsToInsert) {
                  db[table].unshift({
                    id: p.id || `id-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    created_at: new Date().toISOString(),
                    ...p,
                  });
                }
                writeLocalDb(db);
                return { data: payload, error: null };
              }
              return { data: res.data, error: res.error };
            }
            return executeInsert().then(onfulfilled, onrejected);
          },
        };

        return chain;
      },

      update: (payload: Record<string, unknown>) => {
        let colFilter: string | null = null;
        let valFilter: unknown = null;

        const uChain = {
          eq: (col: string, val: unknown) => {
            colFilter = col;
            valFilter = val;
            return uChain;
          },
          select: () => ({
            single: async (): Promise<{ data: Record<string, unknown> | null; error: unknown }> => {
              const res = await realQuery.update(payload as never).eq(colFilter!, valFilter as never).select().single();
              if (res.error && res.error.code === "PGRST205") {
                const db = readLocalDb();
                const items = db[table] || [];
                const index = items.findIndex((i) => i[colFilter!] === valFilter);
                if (index !== -1) {
                  db[table][index] = { ...db[table][index], ...payload };
                  writeLocalDb(db);
                  return { data: db[table][index], error: null };
                }
              }
              return { data: res.data as Record<string, unknown> | null, error: res.error };
            },
          }),
        };

        return uChain;
      },
    };
  },
};
