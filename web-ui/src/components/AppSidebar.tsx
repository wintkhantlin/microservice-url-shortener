import ChartColumn from 'lucide-react/dist/esm/icons/chart-column'
import List from 'lucide-react/dist/esm/icons/list'
import LogOut from 'lucide-react/dist/esm/icons/log-out'
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up'
import { Link, useLocation } from '@tanstack/react-router'
import { 
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, 
    SidebarHeader, SidebarMenuButton, SidebarMenuItem, SidebarMenu 
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useSession } from '@/hooks/useSession'
import { kratos } from '@/lib/kratos'
import AliasPicker from '@/components/AliasPicker'
import { type Alias } from '@/hooks/useAliases'

export function AppSidebar({ aliases, selectedAliasId }: { aliases: Alias[], selectedAliasId?: string }) {
    const { data: session } = useSession();
    const location = useLocation();
    
    const userEmail = (session?.identity?.traits as { email?: string })?.email;
    const userName = (session?.identity?.traits as { name?: string })?.name || "User";
    const userInitials = userName.substring(0, 2).toUpperCase();

    const handleLogout = async () => {
        try {
            const flow = await kratos.createBrowserLogoutFlow();
            window.location.href = flow.data.logout_url;
        } catch (e) {
            console.error("Logout failed", e);
        }
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <AliasPicker aliases={aliases || []} selectedAliasId={selectedAliasId} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className='space-y-1 p-3'>
                    <SidebarGroupLabel className='text-[10px] text-muted-foreground mb-1 uppercase tracking-widest font-bold'>Management</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                asChild 
                                isActive={!!selectedAliasId && location.pathname === `/${selectedAliasId}`}
                                className="h-9 px-3"
                            >
                                <Link to={selectedAliasId ? `/$aliasId` : '/'} params={selectedAliasId ? { aliasId: selectedAliasId } : {}}>
                                    <ChartColumn className="h-4 w-4" />
                                    <span className="font-semibold text-sm">Analytics</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                asChild 
                                isActive={location.pathname === '/aliases'}
                                className="h-9 px-3"
                            >
                                <Link to="/aliases">
                                    <List className="h-4 w-4" />
                                    <span className="text-sm">My Aliases</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-3 border-t">
                {session && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mb-2">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {userInitials}
                                    </div>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{userName}</span>
                                    <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
                                </div>
                                <ChevronUp className="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}
