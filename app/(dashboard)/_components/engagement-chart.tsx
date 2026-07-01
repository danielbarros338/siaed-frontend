'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ChartDataPoint } from '@/lib/types/dashboard'

interface EngagementChartProps {
  data: ChartDataPoint[]
  title: string
  subtitle?: string
  isLoading?: boolean
}

export function EngagementChart({ data, title, subtitle, isLoading }: EngagementChartProps) {
  if (isLoading) {
    return <Skeleton className="h-72 w-full rounded-2xl" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '0.625rem',
                border: '1px solid #e2e8f0',
                fontSize: 12,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Line
              type="monotone"
              dataKey="engajamento"
              name="Engajamento Acadêmico"
              stroke="#0066cc"
              strokeWidth={2}
              dot={{ r: 3, fill: '#0066cc' }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="risco"
              name="Risco de Evasão"
              stroke="#dc2626"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={{ r: 3, fill: '#dc2626' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
