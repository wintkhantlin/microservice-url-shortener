import { useState } from 'react'
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3'
import LineChartIcon from 'lucide-react/dist/esm/icons/line-chart'
import { 
    Bar, BarChart, Line, LineChart, 
    CartesianGrid, XAxis, YAxis 
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { cn } from "@/lib/utils"

export default function TrafficChart({ data, interval }: { data: { date: string, clicks: number }[], interval?: string }) {
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
    const config = {
        clicks: { label: "Total Clicks", color: "var(--chart-1)" }
    } satisfies ChartConfig

    const formatXAxis = (value: string) => {
        const date = new Date(value);
        if (interval === 'minute') return date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
        if (interval === 'hour') return date.toLocaleTimeString("en-US", { hour: 'numeric' });
        if (interval === 'day') return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
        if (interval === 'week') return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
        if (interval === 'month') return date.toLocaleDateString("en-US", { month: 'short', year: '2-digit' });
        if (interval === 'year') return date.getFullYear().toString();
        return date.toLocaleDateString();
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className='pb-3 pt-5 px-6 flex flex-row items-center justify-between'>
                <div>
                    <CardTitle className="text-md font-semibold">Traffic Overview</CardTitle>
                    <CardDescription className="text-xs">Click volume over time ({interval || 'hour'})</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn("h-6 w-6 rounded-md", chartType === 'bar' ? "bg-secondary text-foreground" : "text-muted-foreground")}
                        onClick={() => setChartType('bar')}
                        title="Bar Chart"
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span className="sr-only">Bar Chart</span>
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn("h-6 w-6 rounded-md", chartType === 'line' ? "bg-secondary text-foreground" : "text-muted-foreground")}
                        onClick={() => setChartType('line')}
                        title="Line Chart"
                    >
                        <LineChartIcon className="h-4 w-4" />
                        <span className="sr-only">Line Chart</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="px-3 pb-5">
                <ChartContainer config={config} className="aspect-auto h-50 w-full">
                    {chartType === 'bar' ? (
                        <BarChart data={data} margin={{ left: 10, right: 10 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis 
                                dataKey="date" 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={10} 
                                fontSize={11} 
                                tickFormatter={formatXAxis}
                            />
                            <YAxis tickLine={false} axisLine={false} tickMargin={10} fontSize={11} />
                            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                            <Bar dataKey="clicks" fill="var(--chart-1)" radius={[3, 3, 0, 0]} barSize={6} />
                        </BarChart>
                    ) : (
                        <LineChart data={data} margin={{ left: 10, right: 10 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis 
                                dataKey="date" 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={10} 
                                fontSize={11} 
                                tickFormatter={formatXAxis}
                            />
                            <YAxis tickLine={false} axisLine={false} tickMargin={10} fontSize={11} />
                            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                            <Line 
                                type="monotone" 
                                dataKey="clicks" 
                                stroke="var(--chart-1)" 
                                strokeWidth={2} 
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            />
                        </LineChart>
                    )}
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
