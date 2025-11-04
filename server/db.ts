import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

neonConfig.webSocketConstructor = ws;

export const db = process.env.DATABASE_URL 
  ? (() => {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      return drizzle(pool, { schema });
    })()
  : null as any;
