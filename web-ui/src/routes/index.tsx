import { ChartColumn, Settings, MousePointer2, Activity, Clock, Share2 } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, Label, Pie, PieChart, XAxis, YAxis, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

import { createFileRoute } from '@tanstack/react-router'
import AliasPicker from '@/components/AliasPicker'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

const visitorData = [
    { date: "2024-03-12", clicks: 280 },
    { date: "2024-03-13", clicks: 320 },
    { date: "2024-03-14", clicks: 240 },
    { date: "2024-03-15", clicks: 290 },
    { date: "2024-03-16", clicks: 380 },
    { date: "2024-03-17", clicks: 340 },
    { date: "2024-03-18", clicks: 270 },
    { date: "2024-03-19", clicks: 410 },
    { date: "2024-03-20", clicks: 480 },
    { date: "2024-03-21", clicks: 420 },
    { date: "2024-03-22", clicks: 350 },
    { date: "2024-03-23", clicks: 310 },
    { date: "2024-03-24", clicks: 260 },
    { date: "2024-03-25", clicks: 340 },
    { date: "2024-03-26", clicks: 450 },
    { date: "2024-03-27", clicks: 520 },
    { date: "2024-03-28", clicks: 460 },
    { date: "2024-03-29", clicks: 380 },
    { date: "2024-03-30", clicks: 320 },
    { date: "2024-03-31", clicks: 290 },
    { date: "2024-04-01", clicks: 370 },
    { date: "2024-04-02", clicks: 480 },
    { date: "2024-04-03", clicks: 580 },
    { date: "2024-04-04", clicks: 640 },
    { date: "2024-04-05", clicks: 590 },
    { date: "2024-04-06", clicks: 530 },
    { date: "2024-04-07", clicks: 480 },
    { date: "2024-04-08", clicks: 680 },
    { date: "2024-04-09", clicks: 790 },
    { date: "2024-04-10", clicks: 730 },
]

const browserData = [
    { browser: "chrome", visitors: 4275, fill: "var(--chart-1)" },
    { browser: "safari", visitors: 2800, fill: "var(--chart-2)" },
    { browser: "firefox", visitors: 1287, fill: "var(--chart-3)" },
    { browser: "edge", visitors: 973, fill: "var(--chart-4)" },
    { browser: "other", visitors: 490, fill: "var(--chart-5)" },
]

const deviceData = [
    { device: "mobile", visitors: 6260, fill: "var(--chart-2)" },
    { device: "desktop", visitors: 3945, fill: "var(--chart-1)" },
    { device: "tablet", visitors: 840, fill: "var(--chart-3)" },
]

const osData = [
    { os: "iOS", visitors: 4200, fill: "var(--chart-1)" },
    { os: "Android", visitors: 3800, fill: "var(--chart-2)" },
    { os: "Windows", visitors: 2500, fill: "var(--chart-3)" },
    { os: "macOS", visitors: 1900, fill: "var(--chart-4)" },
    { os: "Linux", visitors: 600, fill: "var(--chart-5)" },
]

const referrerData = [
    { source: "Google", visitors: 5200, fill: "var(--chart-1)" },
    { source: "Direct", visitors: 4800, fill: "var(--chart-2)" },
    { source: "Twitter", visitors: 2100, fill: "var(--chart-3)" },
    { source: "Facebook", visitors: 1500, fill: "var(--chart-4)" },
    { source: "LinkedIn", visitors: 900, fill: "var(--chart-5)" },
]

const mainChartConfig = {
    clicks: {
        label: "Total Clicks",
        color: "var(--chart-1)",
    }
} satisfies ChartConfig

const chartConfig = {
    visitors: { label: "Visitors" },
} satisfies ChartConfig

function RouteComponent() {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <AliasPicker />
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup className='space-y-1 p-3'>
                        <SidebarGroupLabel className='text-[10px] text-muted-foreground mb-1 uppercase tracking-widest font-bold'>Management</SidebarGroupLabel>
                        <SidebarMenuButton className="bg-accent/50 h-9 px-3">
                            <ChartColumn className="h-4 w-4" />
                            <span className="font-semibold text-sm">Analytics</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="h-9 px-3">
                            <Settings className="h-4 w-4" />
                            <span className="text-sm">My Aliases</span>
                        </SidebarMenuButton>
                        <SidebarMenuButton className="h-9 px-3">
                            <Activity className="h-4 w-4" />
                            <span className="text-sm">Real-time</span>
                        </SidebarMenuButton>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="p-3 border-t">
                    <p className="text-[10px] text-muted-foreground font-medium">Link Analytics v1.0</p>
                    <p className="text-[9px] text-muted-foreground/60">Powered by ClickHouse</p>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset className="bg-slate-50/50">
                <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-6 sticky top-0 z-10">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mx-3 h-5" />
                    <h1 className="text-md font-semibold tracking-tight">Analytics Dashboard</h1>
                </header>
                <main className="p-6 space-y-6 max-w-275 w-full mx-auto">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <MetricCard title="Total Clicks" value="15,248" icon={<MousePointer2 size={18} />} />
                        <MetricCard title="Avg. Visit Per Day" value="120.2" icon={<Clock size={18} />} />
                        <MetricCard title="Top Referrer" value="google.com" icon={<Share2 size={18} />} />
                    </div>

                    <Card className="overflow-hidden">
                        <CardHeader className='pb-3 pt-5 px-6'>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-md font-semibold">Traffic Overview</CardTitle>
                                    <CardDescription className="text-xs">Click volume over the last 30 days</CardDescription>
                                </div>
                                <div className="flex gap-4 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full bg-chart-1" />
                                        <span className="font-medium">Clicks</span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-3 pb-5">
                            <ChartContainer
                                config={mainChartConfig}
                                className="aspect-auto h-50 w-full"
                            >
                                <AreaChart data={visitorData} margin={{ left: 10, right: 10 }}>
                                    <defs>
                                        <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        fontSize={11}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    />
                                    <YAxis 
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        fontSize={11}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                    <Area
                                        dataKey="clicks"
                                        type="monotone"
                                        fill="url(#fillClicks)"
                                        stroke="var(--chart-1)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Secondary Metrics Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Top Referrers */}
                        <Card className="lg:col-span-1">
                            <CardHeader className="pb-3 pt-5 px-6">
                                <CardTitle className="text-md font-semibold">Top Referrers</CardTitle>
                                <CardDescription className="text-xs">Top traffic sources</CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                <div className="space-y-4">
                                    {referrerData.map((r) => (
                                        <div key={r.source} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium">{r.source}</span>
                                                <span className="font-bold">{((r.visitors / referrerData.reduce((acc, cur) => acc + cur.visitors, 0)) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full transition-all duration-500" 
                                                    style={{ 
                                                        width: `${(r.visitors / referrerData.reduce((acc, cur) => acc + cur.visitors, 0)) * 100}%`,
                                                        backgroundColor: r.fill 
                                                    }} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Device Split */}
                        <Card>
                            <CardHeader className="pb-3 pt-5 px-6">
                                <CardTitle className="text-md font-semibold">Device Distribution</CardTitle>
                                <CardDescription className="text-xs">Breakdown by device type</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center h-70 p-6">
                                <ChartContainer config={chartConfig} className="mx-auto aspect-square h-45">
                                    <PieChart>
                                        <Pie data={deviceData} dataKey="visitors" nameKey="device" innerRadius={55} strokeWidth={4} stroke="white">
                                            {deviceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                            <Label content={({ viewBox }) => {
                                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                    return (
                                                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-bold">
                                                                {(deviceData[0].visitors / deviceData.reduce((acc, d) => acc + d.visitors, 0) * 100).toFixed(0)}%
                                                            </tspan>
                                                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 15} className="fill-muted-foreground text-[10px] font-medium">Mobile</tspan>
                                                        </text>
                                                    )
                                                }
                                            }} />
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                                <div className="w-full mt-6 grid grid-cols-3 gap-3 border-t pt-6">
                                    {deviceData.map(d => (
                                        <div key={d.device} className="text-center">
                                            <p className="text-[9px] text-muted-foreground capitalize font-medium mb-0.5">{d.device}</p>
                                            <p className="text-xs font-bold tracking-tight">{d.visitors.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Browser Stats */}
                        <Card>
                            <CardHeader className="pb-3 pt-5 px-6">
                                <CardTitle className="text-md font-semibold">Browser Usage</CardTitle>
                                <CardDescription className="text-xs">Most popular browsers</CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                <div className="space-y-4">
                                    {browserData.map((b) => (
                                        <div key={b.browser} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="capitalize font-medium">{b.browser}</span>
                                                <span className="font-bold">{((b.visitors / browserData.reduce((acc, cur) => acc + cur.visitors, 0)) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full transition-all duration-500" 
                                                    style={{ 
                                                        width: `${(b.visitors / browserData.reduce((acc, cur) => acc + cur.visitors, 0)) * 100}%`,
                                                        backgroundColor: b.fill 
                                                    }} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-3 pt-5 px-6">
                                <CardTitle className="text-md font-semibold">Operating Systems</CardTitle>
                                <CardDescription className="text-xs">Visitor distribution by platform</CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                <div className="space-y-4">
                                    {osData.map((os) => (
                                        <div key={os.os} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium">{os.os}</span>
                                                <span className="font-bold">{((os.visitors / osData.reduce((acc, cur) => acc + cur.visitors, 0)) * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full transition-all duration-500" 
                                                    style={{ 
                                                        width: `${(os.visitors / osData.reduce((acc, cur) => acc + cur.visitors, 0)) * 100}%`,
                                                        backgroundColor: os.fill 
                                                    }} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{title}</span>
                    <div className="p-1.5 text-muted-foreground">{icon}</div>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight">{value}</span>
                </div>
            </CardContent>
        </Card>
    )
}