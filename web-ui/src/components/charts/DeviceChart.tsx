import { useMemo } from 'react'
import { Pie, PieChart, Cell, Label } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'

type DeviceData = {
  device: string
  visitors: number
  fill: string
}

export default function DeviceChart({ data }: { data: DeviceData[] }) {
  const totalVisitors = useMemo(() => data.reduce((acc, curr) => acc + curr.visitors, 0), [data])

  const config = {
    visitors: { label: 'Visitors' },
  } satisfies ChartConfig

  if (totalVisitors === 0) {
    return (
      <Card className="flex min-h-[320px] items-center justify-center border-border/70 bg-card/90 shadow-sm">
        <p className="text-sm text-muted-foreground">No device data available</p>
      </Card>
    )
  }

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Device Distribution</CardTitle>
        <CardDescription className="text-xs">Breakdown by device type</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-5">
        <ChartContainer config={config} className="mx-auto h-[220px] w-full max-w-[260px]">
          <PieChart>
            <Pie
              data={data}
              dataKey="visitors"
              nameKey="device"
              innerRadius={56}
              outerRadius={88}
              strokeWidth={4}
              stroke="white"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox)) return null

                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-semibold">
                        {totalVisitors.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 16}
                        className="fill-muted-foreground text-[10px] font-medium uppercase tracking-wide"
                      >
                        visitors
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="grid w-full grid-cols-2 gap-3 border-t border-border/70 pt-5 sm:grid-cols-3">
          {data.map((item) => {
            const share = ((item.visitors / totalVisitors) * 100).toFixed(1)

            return (
              <div key={item.device} className="rounded-md border border-border/60 bg-background/70 p-2 text-center">
                <p className="mb-0.5 text-[10px] font-medium capitalize text-muted-foreground">{item.device}</p>
                <p className="text-sm font-semibold tracking-tight">{item.visitors.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">{share}%</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
