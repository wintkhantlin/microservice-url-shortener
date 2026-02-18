import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { AppSidebar } from '@/components/AppSidebar'
import { type Alias } from '@/hooks/useAliases'

interface DashboardLayoutProps {
    children: React.ReactNode
    aliases: Alias[]
    selectedAliasId?: string
    title?: string
}

export function DashboardLayout({ children, aliases, selectedAliasId, title }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar aliases={aliases} selectedAliasId={selectedAliasId} />
            
            <SidebarInset className="bg-slate-50/50">
                <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-6 sticky top-0 z-10">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mx-3 h-5" />
                    <h1 className="text-md font-semibold tracking-tight">{title || "Dashboard"}</h1>
                </header>

                <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
