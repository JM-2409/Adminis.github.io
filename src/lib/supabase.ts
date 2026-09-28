import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kqpegzphhogumomueujm.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcGVnenBoaG9ndW1vbXVldWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NjQxNjEsImV4cCI6MjEwNjE0MDE2MX0.P1xuhEBe10WhTaVEaDRo51gUb0hU7NrWVqjSRHGa3xA";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcGVnenBoaG9ndW1vbXVldWptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDU2NDE2MSwiZXhwIjoyMTA2MTQwMTYxfQ.ZxgpRLsEbSjF-8nDymh4JZ0bkwLbgkiLfUzte82XMa4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const rawSupabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Fallback JSON persistence for offline/unmigrated Supabase environments
const DB_FILE = path.join(process.cwd(), "local_db.json");

function readLocalDb(): Record<string, any[]> {
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

function writeLocalDb(data: Record<string, any[]>) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Ignore write errors
  }
}

// Wrapper to seamlessly fallback if remote database tables don't exist yet
export const supabaseAdmin = {
  from: (table: string) => {
    const realQuery = rawSupabaseAdmin.from(table);

    return {
      select: (columns: string = "*", options?: { count?: "exact" | "planned" | "estimated"; head?: boolean }) => {
        let chain = {
          eq: (col: string, val: any) => chainFilter((item: any) => item[col] === val),
          order: (_col: string, _opts?: any) => chain,
          limit: (n: number) => chainLimit(n),
          single: async () => {
            const res = await runQuery();
            if (res.error) {
              const localData = readLocalDb()[table] || [];
              const found = localData[0] || null;
              return { data: found, error: found ? null : { message: "Not found" } };
            }
            return { data: Array.isArray(res.data) ? res.data[0] || null : res.data, error: res.error };
          },
          then: (resolve: any, reject: any) => runQuery().then(resolve, reject),
        };

        const filters: Array<(item: any) => boolean> = [];
        let limitCount: number | null = null;

        function chainFilter(fn: (item: any) => boolean) {
          filters.push(fn);
          return chain;
        }

        function chainLimit(n: number) {
          limitCount = n;
          return chain;
        }

        async function runQuery() {
          const res = await realQuery.select(columns, options);
          if (res.error && res.error.code === "PGRST205") {
            // Table doesn't exist on remote Supabase -> fallback to local DB store
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
          return res;
        }

        return chain;
      },

      insert: (payload: any) => {
        return {
          select: () => ({
            single: async () => {
              const res = await realQuery.insert(payload).select().single();
              if (res.error && res.error.code === "PGRST205") {
                const db = readLocalDb();
                if (!db[table]) db[table] = [];

                const newItem = {
                  id: payload.id || `id-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                  created_at: new Date().toISOString(),
                  ...payload,
                };

                db[table].unshift(newItem);
                writeLocalDb(db);
                return { data: newItem, error: null };
              }
              return res;
            },
          }),
          then: async (resolve: any, reject: any) => {
            const res = await realQuery.insert(payload);
            if (res.error && res.error.code === "PGRST205") {
              const db = readLocalDb();
              if (!db[table]) db[table] = [];

              const itemsToInsert = Array.isArray(payload) ? payload : [payload];
              for (const p of itemsToInsert) {
                db[table].unshift({
                  id: p.id || `id-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                  created_at: new Date().toISOString(),
                  ...p,
                });
              }
              writeLocalDb(db);
              return resolve({ data: payload, error: null });
            }
            return resolve(res);
          },
        };
      },

      update: (payload: any) => {
        let colFilter: string | null = null;
        let valFilter: any = null;

        const uChain = {
          eq: (col: string, val: any) => {
            colFilter = col;
            valFilter = val;
            return uChain;
          },
          select: () => ({
            single: async () => {
              const res = await realQuery.update(payload).eq(colFilter!, valFilter!).select().single();
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
              return res;
            },
          }),
        };

        return uChain;
      },
    };
  },
};
