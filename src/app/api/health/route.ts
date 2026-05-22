import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/databaseHealth'
import { getDatabaseProvider } from '@/lib/databaseProvider'

export async function GET() {
  try {
    await checkDatabaseConnection()
    

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      provider: getDatabaseProvider(),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Health Check] Falha na conexão com o banco:', error)

    return NextResponse.json(
      { status: 'error', database: 'disconnected' },
      { status: 500 },
    )
  }
}
