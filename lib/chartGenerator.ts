export type ChartType = 'portfolio' | 'comparison' | 'heatmap'

export interface ChartData {
  id: string
  type: ChartType
  title: string
  data: any
  created_at: string
}

export function detectChartPrompt(prompt: string): { isChart: boolean; type: ChartType; title: string } | null {
  const lowerPrompt = prompt.toLowerCase()

  if (lowerPrompt.includes('chart') && lowerPrompt.includes('portfolio')) {
    return { isChart: true, type: 'portfolio', title: 'Portfolio Allocation' }
  }
  if (lowerPrompt.includes('compare') && (lowerPrompt.includes('vs') || lowerPrompt.includes('versus'))) {
    const match = prompt.match(/compare\s+(\w+)\s+vs\s+(\w+)/i)
    if (match) {
      return { isChart: true, type: 'comparison', title: `${match[1]} vs ${match[2]} Comparison` }
    }
  }
  if ((lowerPrompt.includes('heatmap') || lowerPrompt.includes('heat map')) && lowerPrompt.includes('sector')) {
    return { isChart: true, type: 'heatmap', title: 'Sector Exposure Heatmap' }
  }
  if (lowerPrompt.includes('sector') && lowerPrompt.includes('exposure')) {
    return { isChart: true, type: 'heatmap', title: 'Sector Exposure Heatmap' }
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

    default:
      return {}
  }
}
