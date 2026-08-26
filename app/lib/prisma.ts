import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';

if (typeof window === 'undefined' && !neonConfig.webSocketConstructor) {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makeClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
}

// Lazy proxy — the underlying client is not built until first use, so
// build-time module evaluation doesn't require DATABASE_URL to be set.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = makeClient();
    }
    const value = Reflect.get(globalForPrisma.prisma, prop, globalForPrisma.prisma);
    return typeof value === 'function' ? value.bind(globalForPrisma.prisma) : value;
  },
});
