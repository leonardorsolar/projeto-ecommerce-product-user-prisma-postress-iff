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
  const hasDatabaseUrl =
    typeof process.env.DATABASE_URL === 'string' &&
    process.env.DATABASE_URL.trim() !== ''

  // Regra principal:
  // - com DATABASE_URL => prisma (PostgreSQL)
  // - sem DATABASE_URL => usa DATABASE_PROVIDER (quando válido)
  // - fallback final => sqlite local
  if (hasDatabaseUrl) {
    return 'prisma'
  }

  const configuredProvider = normalizeProvider(process.env.DATABASE_PROVIDER)

  if (configuredProvider) {
    return configuredProvider
  }

  // Regra padrão:
  // - sem DATABASE_URL => sqlite local
  return 'sqlite'
}

export function isPrismaProvider(): boolean {
  return getDatabaseProvider() === 'prisma'
}
