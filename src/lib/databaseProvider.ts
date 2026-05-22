export type DatabaseProvider = 'sqlite' | 'prisma'

function normalizeProvider(value: string | undefined): DatabaseProvider | null {
  const normalized = value?.trim().toLowerCase()

  if (normalized === 'sqlite') {
    return 'sqlite'
  }

  if (normalized === 'prisma' || normalized === 'postgres' || normalized === 'postgresql') {
    return 'prisma'
  }

  return null
}

export function getDatabaseProvider(): DatabaseProvider {
  const configuredProvider = normalizeProvider(process.env.DATABASE_PROVIDER)

  if (configuredProvider) {
    return configuredProvider
  }

  const hasDatabaseUrl =
    typeof process.env.DATABASE_URL === 'string' &&
    process.env.DATABASE_URL.trim() !== ''

  // Regra padrão:
  // - sem DATABASE_URL => sqlite local
  // - com DATABASE_URL => prisma (PostgreSQL)
  return hasDatabaseUrl ? 'prisma' : 'sqlite'
}

export function isPrismaProvider(): boolean {
  return getDatabaseProvider() === 'prisma'
}
