import { createLazyFileRoute } from '@tanstack/react-router'
import { useMemo, lazy, Suspense, useState, type ReactNode } from 'react'
import MousePointer2 from 'lucide-react/dist/esm/icons/mouse-pointer-2'
import Users from 'lucide-react/dist/esm/icons/users'
import Globe2 from 'lucide-react/dist/esm/icons/globe-2'
import Monitor from 'lucide-react/dist/esm/icons/monitor'
import Loader2 from 'lucide-react/dist/esm/icons/loader-2'
import Copy from 'lucide-react/dist/esm/icons/copy'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import CalendarIcon from 'lucide-react/dist/esm/icons/calendar'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label as UILabel } from '@/components/ui/label'
import { useAliases } from '@/hooks/useAliases'

const TrafficChart = lazy(() => import('@/components/charts/TrafficChart'))
const DeviceChart = lazy(() => import('@/components/charts/DeviceChart'))

export const Route = createLazyFileRoute('/$aliasId')({
  component: DashboardRoute,
})

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

const INTERVAL_OPTIONS = [
  { value: 'minute', label: 'Minute' },
  { value: 'hour', label: 'Hour' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
] as const

type IntervalValue = (typeof INTERVAL_OPTIONS)[number]['value']

interface DataItem {
  label: string
  value: number
  fill: string
}

function isIntervalValue(value: string): value is IntervalValue {
  return INTERVAL_OPTIONS.some((option) => option.value === value)
}

function transformData(data: { name: string; count: number }[] | undefined): DataItem[] {
  if (!data) return []

  return data.map((item, index) => ({
    label: item.name,
    value: item.count,
    fill: COLORS[index % COLORS.length],
  }))
}

function transformDeviceData(data: { name: string; count: number }[] | undefined) {
  if (!data) return []

  return data.map((item, index) => ({
    device: item.name,
    visitors: item.count,
    fill: COLORS[index % COLORS.length],
  }))
}

function AnalyticsControls() {
  const navigate = Route.useNavigate()
  const { interval, start, end } = Route.useSearch()

  const handleIntervalChange = (value: string) => {
    if (!isIntervalValue(value)) return

    navigate({
      search: (prev) => ({ ...prev, interval: value }),
    })
  }

  const handleDateChange = (key: 'start' | 'end', value: string) => {
    const isoDate = value ? new Date(value).toISOString() : undefined

    navigate({
      search: (prev) => ({ ...prev, [key]: isoDate }),
    })
  }

  const toInputFormat = (iso?: string) => {
    if (!iso) return ''

    const date = new Date(iso)
    const offset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - offset).toISOString().slice(0, 16)
  }

  const resetFilters = () => {
    navigate({
      search: (prev) => ({ ...prev, interval: 'hour', start: undefined, end: undefined }),
    })
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col gap-1.5">
        <UILabel htmlFor="interval" className="text-[11px] font-medium text-muted-foreground">
          Interval
        </UILabel>
        <Select value={interval || 'hour'} onValueChange={handleIntervalChange}>
          <SelectTrigger className="h-9 w-[130px]">
            <SelectValue placeholder="Interval" />
          </SelectTrigger>
          <SelectContent>
            {INTERVAL_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <UILabel htmlFor="start-date" className="text-[11px] font-medium text-muted-foreground">
          Start
        </UILabel>
        <div className="relative">
          <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="start-date"
            type="datetime-local"
            className="h-9 w-[210px] pl-9"
            value={toInputFormat(start)}
            onChange={(event) => handleDateChange('start', event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <UILabel htmlFor="end-date" className="text-[11px] font-medium text-muted-foreground">
          End
        </UILabel>
        <div className="relative">
          <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="end-date"
            type="datetime-local"
            className="h-9 w-[210px] pl-9"
            value={toInputFormat(end)}
            onChange={(event) => handleDateChange('end', event.target.value)}
          />
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 px-3 text-muted-foreground">
        Reset
      </Button>
    </div>
  )
}

function MetricCard({ title, value, icon }: { title: string; value: string | number; icon: ReactNode }) {
  return (
    <Card className="border-border/70 bg-card/95 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
          </div>
          <div className="rounded-md border border-border/80 bg-muted/40 p-2 text-muted-foreground">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function CopyShortUrl({ code }: { code: string }) {
  const base = import.meta.env.APP_REDIRECT_BASE_URL
  if (!base) throw new Error('APP_REDIRECT_BASE_URL is not defined')

  const url = `${base.replace(/\/$/, '')}/${code}`
  const visibleUrl = url.replace(/^https?:\/\//, '')
  const [copied, setCopied] = useState(false)
  const canCopy = typeof navigator !== 'undefined' && !!navigator.clipboard

  const onCopy = async () => {
    if (!canCopy) return

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="hidden max-w-[22rem] truncate rounded-md border border-border/70 px-3 py-2 text-sm text-muted-foreground md:block"
        title={url}
      >
        {visibleUrl}
      </a>
      <Button variant="outline" size="icon" onClick={onCopy} disabled={!canCopy} title={copied ? 'Copied!' : 'Copy short URL'}>
        <Copy className="h-4 w-4" />
        <span className="sr-only">Copy</span>
      </Button>
      <Button variant="outline" size="icon" asChild title="Open short URL">
        <a href={url} target="_blank" rel="noreferrer">
          <ExternalLink className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </a>
      </Button>
    </div>
  )
}

function DistributionCard({ title, subtitle, data }: { title: string; subtitle: string; data: DataItem[] }) {
  const sortedData = useMemo(() => [...data].sort((a, b) => b.value - a.value), [data])
  const visibleData = sortedData.slice(0, 5)
  const hiddenItems = sortedData.length - visibleData.length
  const total = useMemo(() => sortedData.reduce((acc, curr) => acc + curr.value, 0), [sortedData])

  if (total === 0) {
    return (
      <Card className="flex min-h-[220px] items-center justify-center border-border/70 bg-card/95 shadow-sm">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">No data available</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {visibleData.map((item) => {
          const share = (item.value / total) * 100

          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate font-medium capitalize" title={item.label}>
                  {item.label}
                </span>
                <span className="text-muted-foreground">{item.value.toLocaleString()}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/70">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${share}%`, backgroundColor: item.fill }}
                />
              </div>
            </div>
          )
        })}
        {hiddenItems > 0 ? <p className="pt-1 text-xs text-muted-foreground">+{hiddenItems} more sources</p> : null}
      </CardContent>
    </Card>
  )
}

function DashboardRoute() {
  const { aliasId } = Route.useParams()
  const { interval } = Route.useSearch()
  const { data: aliases } = useAliases()
  const { alias, analytics, error: loaderError } = Route.useLoaderData()

  const timelineData = useMemo(() => {
    if (!analytics?.timeline) return []

    return analytics.timeline.map((point) => ({
      date: point.time,
      clicks: point.count,
    }))
  }, [analytics])

  const browserData = useMemo(() => transformData(analytics?.browsers), [analytics])
  const countryData = useMemo(() => transformData(analytics?.countries), [analytics])
  const deviceData = useMemo(() => transformDeviceData(analytics?.devices), [analytics])
  const referrerData = useMemo(() => transformData(analytics?.referrers), [analytics])

  const trackedVisitors = analytics?.devices?.reduce((acc, curr) => acc + curr.count, 0) ?? 0
  const topReferrer = analytics?.referrers?.[0]?.name || '-'
  const topDevice = analytics?.devices?.[0]?.name || '-'
  const createdDate = alias ? new Date(alias.created_at).toLocaleDateString() : '-'

  if (loaderError) {
    return (
      <DashboardLayout aliases={aliases || []} selectedAliasId={aliasId} title="Error">
        <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
          <p className="mb-4 text-destructive">{loaderError}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </DashboardLayout>
    )
  }

  if (!alias) {
    return (
      <DashboardLayout aliases={aliases || []} selectedAliasId={aliasId} title="Loading...">
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout aliases={aliases || []} selectedAliasId={aliasId} title={`/${alias.code}`}>
      <div className="space-y-4">
        <section className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-3">
          <div className="min-w-0 space-y-1">
            <h2 className="font-mono text-3xl font-semibold tracking-tight">/{alias.code}</h2>
            <p className="max-w-[48rem] truncate text-sm text-muted-foreground" title={alias.target}>
              {alias.target}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className={alias.is_active ? 'font-medium text-emerald-600 dark:text-emerald-400' : 'font-medium text-rose-600 dark:text-rose-400'}
              >
                {alias.is_active ? 'Active' : 'Inactive'}
              </span>
              <span>•</span>
              <span>Created {createdDate}</span>
            </div>
          </div>
          <CopyShortUrl code={alias.code} />
        </section>

        <AnalyticsControls />

        <Suspense
          fallback={
            <Card className="flex h-[320px] items-center justify-center border-border/70 bg-card/95 shadow-sm">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </Card>
          }
        >
          <TrafficChart data={timelineData} interval={interval} />
        </Suspense>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total Clicks" value={analytics?.total_clicks?.toLocaleString() || 0} icon={<MousePointer2 size={18} />} />
          <MetricCard title="Visitors" value={trackedVisitors.toLocaleString()} icon={<Users size={18} />} />
          <MetricCard title="Top Referrer" value={topReferrer} icon={<Globe2 size={18} />} />
          <MetricCard title="Top Device" value={topDevice} icon={<Monitor size={18} />} />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Suspense
            fallback={
              <Card className="flex h-[320px] items-center justify-center border-border/70 bg-card/95 shadow-sm">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </Card>
            }
          >
            <DeviceChart data={deviceData} />
          </Suspense>

          <DistributionCard title="Top Referrers" subtitle="Where traffic comes from" data={referrerData} />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <DistributionCard title="Browser Usage" subtitle="Most popular browsers" data={browserData} />
          <DistributionCard title="Countries" subtitle="Geographic distribution" data={countryData} />
        </div>
      </div>
    </DashboardLayout>
  )
}
