'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp,
  Plus,
  Settings,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'

interface ChartData {
  label: string
  value: number
  color?: string
}

interface ChartConfig {
  type: 'bar' | 'pie' | 'line' | 'area'
  title: string
  data: ChartData[]
  xAxisLabel?: string
  yAxisLabel?: string
  colors: string[]
}

interface ChartGeneratorProps {
  onChartGenerate: (chartConfig: ChartConfig) => void
  onClose?: () => void
}

const defaultColors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#f97316', '#ec4899', '#6366f1', '#84cc16'
]

export function ChartGenerator({ onChartGenerate, onClose }: ChartGeneratorProps) {
  const [chartType, setChartType] = useState<ChartConfig['type']>('bar')
  const [title, setTitle] = useState('Sales Performance 2024')
  const [dataInput, setDataInput] = useState(
    `January,45000
February,52000
March,48000
April,61000
May,58000
June,67000`
  )
  const [xAxisLabel, setXAxisLabel] = useState('Month')
  const [yAxisLabel, setYAxisLabel] = useState('Revenue ($)')
  const [previewData, setPreviewData] = useState<ChartData[]>([])

  const parseDataInput = useCallback((input: string): ChartData[] => {
    try {
      const lines = input.trim().split('\n')
      return lines.map((line, index) => {
        const [label, value] = line.split(',').map(s => s.trim())
        return {
          label: label || `Item ${index + 1}`,
          value: parseFloat(value) || 0,
          color: defaultColors[index % defaultColors.length]
        }
      }).filter(item => !isNaN(item.value))
    } catch (error) {
      return []
    }
  }, [])

  const generateChartSVG = useCallback((config: ChartConfig): string => {
    const { type, data, title } = config
    const width = 600
    const height = 400
    const margin = { top: 60, right: 30, bottom: 60, left: 60 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    if (type === 'bar') {
      const barWidth = chartWidth / data.length * 0.6
      const barSpacing = chartWidth / data.length * 0.4
      const maxValue = Math.max(...data.map(d => d.value))
      const scale = chartHeight / maxValue

      const bars = data.map((item, index) => {
        const x = margin.left + index * (barWidth + barSpacing) + barSpacing / 2
        const barHeight = item.value * scale
        const y = margin.top + chartHeight - barHeight

        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
                fill="${item.color}" rx="4" class="chart-bar">
            <animate attributeName="height" from="0" to="${barHeight}" dur="0.5s" fill="freeze" />
            <animate attributeName="y" from="${margin.top + chartHeight}" to="${y}" dur="0.5s" fill="freeze" />
          </rect>
          <text x="${x + barWidth / 2}" y="${margin.top + chartHeight + 20}" 
                text-anchor="middle" fill="#666" font-size="12" font-family="Arial">
            ${item.label}
          </text>
          <text x="${x + barWidth / 2}" y="${y - 5}" 
                text-anchor="middle" fill="#333" font-size="11" font-weight="bold" font-family="Arial">
            ${item.value.toLocaleString()}
          </text>
        `
      }).join('')

      return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <style>
            .chart-bar { cursor: pointer; transition: opacity 0.2s; }
            .chart-bar:hover { opacity: 0.8; }
          </style>
          
          <!-- Background -->
          <rect width="${width}" height="${height}" fill="#ffffff"/>
          
          <!-- Title -->
          <text x="${width / 2}" y="30" text-anchor="middle" 
                font-size="20" font-weight="bold" font-family="Arial" fill="#333">
            ${title}
          </text>
          
          <!-- Grid lines -->
          ${Array.from({ length: 5 }, (_, i) => {
            const y = margin.top + (chartHeight / 4) * i
            const value = Math.round((maxValue / 4) * (4 - i))
            return `
              <line x1="${margin.left}" y1="${y}" x2="${margin.left + chartWidth}" y2="${y}" 
                    stroke="#e5e7eb" stroke-width="1"/>
              <text x="${margin.left - 10}" y="${y + 4}" text-anchor="end" 
                    fill="#666" font-size="11" font-family="Arial">${value.toLocaleString()}</text>
            `
          }).join('')}
          
          <!-- Bars -->
          ${bars}
          
          <!-- Axes -->
          <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + chartHeight}" 
                stroke="#333" stroke-width="2"/>
          <line x1="${margin.left}" y1="${margin.top + chartHeight}" x2="${margin.left + chartWidth}" y2="${margin.top + chartHeight}" 
                stroke="#333" stroke-width="2"/>
        </svg>
      `
    }

    if (type === 'pie') {
      const total = data.reduce((sum, item) => sum + item.value, 0)
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(chartWidth, chartHeight) / 2 - 20

      let currentAngle = -90 // Start from top

      const slices = data.map((item, index) => {
        const percentage = (item.value / total) * 100
        const angle = (percentage / 100) * 360
        const startAngle = currentAngle
        const endAngle = currentAngle + angle

        const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
        const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
        const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
        const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

        const largeArc = angle > 180 ? 1 : 0

        const path = `
          M ${centerX} ${centerY}
          L ${startX} ${startY}
          A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}
          Z
        `

        currentAngle = endAngle

        return `
          <g class="chart-slice">
            <path d="${path}" fill="${item.color}" stroke="white" stroke-width="2" 
                  cursor="pointer" opacity="0.9">
              <animate attributeName="opacity" from="0" to="0.9" dur="0.5s" fill="freeze" />
            </path>
            <text x="${centerX + (radius + 30) * Math.cos(((startAngle + angle / 2) * Math.PI) / 180)}" 
                  y="${centerY + (radius + 30) * Math.sin(((startAngle + angle / 2) * Math.PI) / 180)}"
                  text-anchor="middle" fill="#333" font-size="12" font-family="Arial">
              ${item.label}: ${percentage.toFixed(1)}%
            </text>
          </g>
        `
      }).join('')

      return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <style>
            .chart-slice { transition: transform 0.2s; }
            .chart-slice:hover { transform: scale(1.05); }
          </style>
          
          <!-- Background -->
          <rect width="${width}" height="${height}" fill="#ffffff"/>
          
          <!-- Title -->
          <text x="${width / 2}" y="30" text-anchor="middle" 
                font-size="20" font-weight="bold" font-family="Arial" fill="#333">
            ${title}
          </text>
          
          <!-- Pie slices -->
          ${slices}
        </svg>
      `
    }

    return ''
  }, [])

  // Update preview when data changes
  useState(() => {
    const parsed = parseDataInput(dataInput)
    setPreviewData(parsed)
  }, [dataInput, parseDataInput])

  const handleGenerateChart = useCallback(() => {
    const parsedData = parseDataInput(dataInput)
    
    if (parsedData.length === 0) {
      toast.error('Please enter valid chart data')
      return
    }

    const chartConfig: ChartConfig = {
      type: chartType,
      title,
      data: parsedData,
      xAxisLabel,
      yAxisLabel,
      colors: defaultColors
    }

    const chartSVG = generateChartSVG(chartConfig)
    
    if (chartSVG) {
      onChartGenerate({
        ...chartConfig,
        data: parsedData
      })
      toast.success('Chart generated successfully!')
    } else {
      toast.error('Failed to generate chart')
    }
  }, [chartType, title, dataInput, xAxisLabel, yAxisLabel, parseDataInput, generateChartSVG, onChartGenerate])

  const getChartIcon = (type: ChartConfig['type']) => {
    switch (type) {
      case 'bar': return <BarChart3 className="h-5 w-5" />
      case 'pie': return <PieChart className="h-5 w-5" />
      case 'line': return <LineChart className="h-5 w-5" />
      case 'area': return <TrendingUp className="h-5 w-5" />
      default: return <BarChart3 className="h-5 w-5" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Chart Generator</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ×
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration */}
            <div className="space-y-6">
              {/* Chart Type */}
              <div>
                <Label className="text-sm font-medium">Chart Type</Label>
                <Select value={chartType} onValueChange={(value: ChartConfig['type']) => setChartType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Bar Chart
                      </div>
                    </SelectItem>
                    <SelectItem value="pie">
                      <div className="flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        Pie Chart
                      </div>
                    </SelectItem>
                    <SelectItem value="line">
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        Line Chart
                      </div>
                    </SelectItem>
                    <SelectItem value="area">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Area Chart
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <Label className="text-sm font-medium">Chart Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter chart title"
                />
              </div>

              {/* Data Input */}
              <div>
                <Label className="text-sm font-medium">Data (Label, Value)</Label>
                <Textarea
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  placeholder="January,45000&#10;February,52000&#10;March,48000"
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter each data point on a new line with format: label,value
                </p>
              </div>

              {/* Axis Labels */}
              {chartType !== 'pie' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">X-Axis Label</Label>
                    <Input
                      value={xAxisLabel}
                      onChange={(e) => setXAxisLabel(e.target.value)}
                      placeholder="X-Axis"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Y-Axis Label</Label>
                    <Input
                      value={yAxisLabel}
                      onChange={(e) => setYAxisLabel(e.target.value)}
                      placeholder="Y-Axis"
                    />
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <Button onClick={handleGenerateChart} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Generate Chart
              </Button>
            </div>

            {/* Preview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getChartIcon(chartType)}
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {previewData.length > 0 ? (
                    <div 
                      className="w-full overflow-auto border rounded-lg p-4 bg-white"
                      dangerouslySetInnerHTML={{ 
                        __html: generateChartSVG({
                          type: chartType,
                          title,
                          data: previewData,
                          xAxisLabel,
                          yAxisLabel,
                          colors: defaultColors
                        })
                      }}
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                        <p>Enter data to see preview</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Data Summary */}
              {previewData.length > 0 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Data Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {previewData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                          <Badge variant="secondary">
                            {item.value.toLocaleString()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}