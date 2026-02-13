import { SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger   } from '@/components/ui/sidebar'
import { createFileRoute } from '@tanstack/react-router'
import { Sidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import AliasPicker from '@/components/AliasPicker'

export const Route = createFileRoute('/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <AliasPicker />
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <nav className="flex flex-col gap-2">
                            <Button variant="ghost" className="justify-start">Dashboard</Button>
                            <Button variant="ghost" className="justify-start">Analytics</Button>
                            <Button variant="ghost" className="justify-start">Settings</Button>
                        </nav>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <p className="text-xs text-muted-foreground">v0.1.0</p>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                </header>
                <main className="p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold">Total Clicks</h3>
                            <p className="text-3xl font-bold">1,234</p>
                        </div>
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold">Active Links</h3>
                            <p className="text-3xl font-bold">56</p>
                        </div>
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <h3 className="font-semibold">New Links (24h)</h3>
                            <p className="text-3xl font-bold">+12</p>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
