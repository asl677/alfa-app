import yahooFinance from 'yahoo-finance2'
import { NextRequest } from 'next/server'

export const revalidate = 60

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol')
  if (!symbol) return Response.json({ error: 'symbol required' }, { status: 400 })

  try {
    const quote = await yahooFinance.quote(symbol)
    return Response.json(quote)
  } catch {
    return Response.json({ error: 'Failed to fetch quote' }, { status: 500 })
  }
}
