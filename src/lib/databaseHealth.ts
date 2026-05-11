import { getDb } from '@/lib/db'
import { isPrismaProvider } from '@/lib/databaseProvider'
import { getPrismaClient } from '@/lib/prisma'

export async function checkDatabaseConnection(): Promise<void> {
  if (isPrismaProvider()) {
    await getPrismaClient().$queryRaw`SELECT 1`
    return
  }

  const db = getDb()
  db.prepare('SELECT 1').get()
}