import yahooFinance from 'yahoo-finance2'

export const revalidate = 60

const DEFAULT_WATCHLIST = ['NVDA', 'AAPL', 'TSLA', 'MSFT', 'GOOGL']

export async function GET() {
  try {
    const quotes = await Promise.all(
      DEFAULT_WATCHLIST.map(symbol => yahooFinance.quote(symbol))
    )
    return Response.json(quotes)
  } catch {
    return Response.json({ error: 'Failed to fetch watchlist' }, { status: 500 })
  }
}
