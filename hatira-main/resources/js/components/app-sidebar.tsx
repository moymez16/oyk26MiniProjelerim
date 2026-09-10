import { Link } from '@inertiajs/react';
import {
    Bell,
    BookHeart,
    BookOpen,
    FolderHeart,
    Sparkles,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { index as eventsIndex } from '@/actions/App/Http/Controllers/EventController';
import { index as notificationsIndex } from '@/actions/App/Http/Controllers/NotificationController';
import { show as yearbookShow } from '@/actions/App/Http/Controllers/YearbookController';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Panel',
        href: dashboard(),
        icon: Sparkles,
    },
    {
        title: 'Anı Albümleri',
        href: eventsIndex(),
        icon: FolderHeart,
    },
    {
        title: 'Kişisel Yıllığım',
        href: yearbookShow(),
        icon: BookHeart,
    },
    {
        title: 'Bildirimler',
        href: notificationsIndex(),
        icon: Bell,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
