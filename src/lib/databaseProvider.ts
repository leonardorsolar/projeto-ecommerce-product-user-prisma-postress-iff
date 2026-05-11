export type DatabaseProvider = 'sqlite' | 'prisma'

function normalizeProvider(value: string | undefined): DatabaseProvider | null {
  if (!value) return null

  const normalized = value.trim().toLowerCase()
  if (normalized === 'sqlite' || normalized === 'prisma') {
    return normalized
  }

  return null
}

export function getDatabaseProvider(): DatabaseProvider {
  const configuredProvider = normalizeProvider(process.env.DATABASE_PROVIDER)

  if (configuredProvider) {
    return configuredProvider
  }

  return process.env.NODE_ENV === 'production' ? 'prisma' : 'sqlite'
}

export function isPrismaProvider(): boolean {
  return getDatabaseProvider() === 'prisma'
}