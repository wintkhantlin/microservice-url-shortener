import { useMemo } from 'react'
import { Pie, PieChart, Cell, Label } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'

export default function DeviceChart({ data }: { data: { device: string, visitors: number, fill: string }[] }) {
    const totalVisitors = useMemo(() => data.reduce((acc, curr) => acc + curr.visitors, 0), [data]);
    const config = { visitors: { label: "Visitors" } } satisfies ChartConfig

    if (totalVisitors === 0) {
        return (
             <Card className="flex items-center justify-center p-6 h-full min-h-[300px]">
                <p className="text-muted-foreground text-sm">No device data available</p>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="pb-3 pt-5 px-6">
                <CardTitle className="text-md font-semibold">Device Distribution</CardTitle>
                <CardDescription className="text-xs">Breakdown by device type</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
                <ChartContainer config={config} className="mx-auto aspect-square h-45">
                    <PieChart>
                        <Pie data={data} dataKey="visitors" nameKey="device" innerRadius={55} strokeWidth={4} stroke="white">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                            <Label content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-bold">
                                                {((data[0]?.visitors / totalVisitors) * 100 || 0).toFixed(0)}%
                                            </tspan>
                                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 15} className="fill-muted-foreground text-[10px] font-medium">
                                                {data[0]?.device || 'Unknown'}
                                            </tspan>
                                        </text>
                                    )
                                }
                            }} />
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="w-full mt-6 grid grid-cols-3 gap-3 border-t pt-6">
                    {data.map(d => (
                        <div key={d.device} className="text-center">
                            <p className="text-[9px] text-muted-foreground capitalize font-medium mb-0.5">{d.device}</p>
                            <p className="text-xs font-bold tracking-tight">{d.visitors.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
