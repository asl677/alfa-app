export type ChartType = 'portfolio' | 'comparison' | 'heatmap' | 'earnings' | 'dividends' | 'stocks'

export interface ChartData {
  id: string
  type: ChartType
  title: string
  data: any
  created_at: string
}

export function detectChartPrompt(prompt: string): { isChart: boolean; type: ChartType; title: string } | null {
  const lowerPrompt = prompt.toLowerCase()

  // Chart prompts
  if (lowerPrompt.includes('chart') && lowerPrompt.includes('portfolio')) {
    return { isChart: true, type: 'portfolio', title: 'Portfolio Allocation' }
  }
  if (lowerPrompt.includes('compare') && (lowerPrompt.includes('vs') || lowerPrompt.includes('versus'))) {
    const match = prompt.match(/compare\s+(\w+)\s+vs\s+(\w+)/i)
    if (match) {
      return { isChart: true, type: 'comparison', title: `${match[1]} vs ${match[2]} (90-Day)` }
    }
  }
  if ((lowerPrompt.includes('heatmap') || lowerPrompt.includes('heat map')) && lowerPrompt.includes('sector')) {
    return { isChart: true, type: 'heatmap', title: 'Sector Exposure Heatmap' }
  }
  if (lowerPrompt.includes('sector') && lowerPrompt.includes('exposure')) {
    return { isChart: true, type: 'heatmap', title: 'Sector Exposure Heatmap' }
  }

  // Table/List prompts
  if (lowerPrompt.includes('earnings') && lowerPrompt.includes('dropping')) {
    return { isChart: true, type: 'earnings', title: 'Upcoming Earnings Releases' }
  }
  if (lowerPrompt.includes('earnings')) {
    return { isChart: true, type: 'earnings', title: 'Upcoming Earnings Releases' }
  }
  if (lowerPrompt.includes('dividend')) {
    return { isChart: true, type: 'dividends', title: 'Top Dividend Stocks' }
  }

  return null
}

export function generateChartData(type: ChartType): any {
  switch (type) {
    case 'portfolio':
      return {
        allocation: [
          { name: 'Tech', value: 35, color: '#2196f3' },
          { name: 'Finance', value: 22, color: '#ff7043' },
          { name: 'Healthcare', value: 18, color: '#4caf50' },
          { name: 'Energy', value: 15, color: '#ff9800' },
          { name: 'Other', value: 10, color: '#9c27b0' },
        ],
      }

    case 'comparison': {
      const days = Array.from({ length: 90 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - 90 + i)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })

      return {
        datasets: [
          {
            label: 'Stock A',
            data: Array.from({ length: 90 }, (_, i) => 100 + Math.sin(i / 10) * 15 + Math.random() * 5),
            color: '#4caf50',
          },
          {
            label: 'Stock B',
            data: Array.from({ length: 90 }, (_, i) => 100 + Math.cos(i / 10) * 12 + Math.random() * 5),
            color: '#ff7043',
          },
        ],
        labels: days,
      }
    }

    case 'heatmap':
      return {
        sectors: [
          { name: 'Technology', values: [85, 78, 92, 88, 95] },
          { name: 'Healthcare', values: [72, 68, 75, 70, 78] },
          { name: 'Financials', values: [65, 72, 68, 75, 70] },
          { name: 'Energy', values: [88, 82, 90, 85, 92] },
          { name: 'Consumer', values: [60, 55, 62, 58, 65] },
        ],
        metrics: ['1M', '3M', '6M', 'YTD', '1Y'],
      }

    case 'earnings':
      return {
        rows: [
          { ticker: 'NVDA', company: 'NVIDIA', date: 'Mar 20, 2024', time: '4:30 PM ET', eps_expected: '$0.68', eps_actual: null, beat: null },
          { ticker: 'AAPL', company: 'Apple Inc.', date: 'Mar 25, 2024', time: '4:30 PM ET', eps_expected: '$1.44', eps_actual: null, beat: null },
          { ticker: 'MSFT', company: 'Microsoft', date: 'Mar 28, 2024', time: '4:30 PM ET', eps_expected: '$2.93', eps_actual: null, beat: null },
          { ticker: 'GOOGL', company: 'Alphabet', date: 'Apr 1, 2024', time: '4:30 PM ET', eps_expected: '$1.89', eps_actual: null, beat: null },
          { ticker: 'META', company: 'Meta Platforms', date: 'Apr 5, 2024', time: '4:30 PM ET', eps_expected: '$5.35', eps_actual: null, beat: null },
          { ticker: 'TSLA', company: 'Tesla', date: 'Apr 10, 2024', time: '4:30 PM ET', eps_expected: '$0.52', eps_actual: null, beat: null },
        ],
      }

    case 'dividends':
      return {
        rows: [
          { ticker: 'JNJ', company: 'Johnson & Johnson', yield: '2.74%', quarterly: '$1.13', ex_date: 'Mar 15, 2024', pay_date: 'Apr 2, 2024' },
          { ticker: 'KO', company: 'Coca-Cola', yield: '3.06%', quarterly: '$0.46', ex_date: 'Mar 22, 2024', pay_date: 'Apr 12, 2024' },
          { ticker: 'PG', company: 'Procter & Gamble', yield: '2.35%', quarterly: '$0.94', ex_date: 'Mar 20, 2024', pay_date: 'Apr 10, 2024' },
          { ticker: 'CVX', company: 'Chevron', yield: '3.52%', quarterly: '$1.42', ex_date: 'Mar 28, 2024', pay_date: 'Apr 11, 2024' },
          { ticker: 'PEP', company: 'PepsiCo', yield: '2.74%', quarterly: '$1.15', ex_date: 'Mar 8, 2024', pay_date: 'Mar 29, 2024' },
        ],
      }

    default:
      return {}
  }
}
