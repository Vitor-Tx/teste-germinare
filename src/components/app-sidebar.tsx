'use client';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/components/ui/sidebar"
import FilterForm from "./dashboard/filter-form"
import { useRouter } from 'next/navigation';
import { useAuth } from "@/store/use-auth";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export function AppSidebar() {
    const router = useRouter();
    const logout = useAuth((state) => state.logout);
    const handleLogout = () => {
        console.log("logout");
        logout();
        router.push('/');
    };
    return (
        <Sidebar variant="sidebar">
            <SidebarHeader />
            <SidebarContent>
                <FilterForm />
                <SidebarGroup>
                    <SidebarGroupLabel>Settings</SidebarGroupLabel>
                    <SidebarGroupContent className="flex flex-col">
                        <ModeToggle />
                        <Button
                            variant="ghost"
                            className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                            Logout
                        </Button>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
