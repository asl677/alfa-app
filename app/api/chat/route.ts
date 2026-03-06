export const runtime = 'nodejs'

const AGENT_RESPONSES = {
  'Monitor Mike': [
    'Markets are mostly down today. Your portfolio is off -1.96% (-$1,247). NVDA leading losses at -5.51%, MSFT the only green at +0.27%.',
    'I\'m monitoring sector flows. Tech outflows accelerating into Utilities. Consider rebalancing toward defensive positions.',
    'Volume spikes on NVDA puts suggest institutional hedging. This could be a temporary dip before a reversal.',
    'The VIX is elevated but manageable. Your portfolio hedge is working as intended.',
  ],
  'Analyst Ashley': [
    'NVDA dropped below the MA200 but technical setup looks bullish for a reversal. Watch the $4,950 support level.',
    'Earnings season peak is here - 20% of tech stocks reporting this week. Implied volatility elevated but manageable.',
    'Sector rotation from Tech to Utilities is a classic defensive move. Your AAPL position is solid for a hedge.',
    'The technical divergence between mega-caps suggests a rotation brewing. Recommend rotating 10% into defensive sectors.',
  ],
  'Tom Tracker': [
    'Tracking Fed rate decision probability - the 25bp cut odds increased this month. Could be the catalyst for reversal.',
    'Oil rallying on supply concerns - Energy sector outperformance is actually a bright spot in your portfolio.',
    'Mega-cap divergence is real. Rotation is brewing between Growth and Value. Time to hedge or rebalance.',
    'Market breadth is improving. More stocks hitting 52-week highs. Positive sign for continued recovery.',
  ],
}

function getRandomResponse(agent: string): string {
  const responses = AGENT_RESPONSES[agent as keyof typeof AGENT_RESPONSES] || ['Market conditions remain uncertain. Monitor your positions closely.']
  return responses[Math.floor(Math.random() * responses.length)]
}

async function simulateStream(text: string): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder()
  const words = text.split(' ')

  return new ReadableStream({
    async start(controller) {
      for (const word of words) {
        const chunk = word + ' '
        controller.enqueue(encoder.encode(chunk))
        await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 40))
      }
      controller.close()
    },
  })
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const agents = ['Monitor Mike', 'Analyst Ashley', 'Tom Tracker']
  const randomAgent = agents[Math.floor(Math.random() * agents.length)]
  const agentResponse = getRandomResponse(randomAgent)

  try {
    const stream = await simulateStream(agentResponse)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    return new Response('Error generating response', { status: 500 })
  }
}
