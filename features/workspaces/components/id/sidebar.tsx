"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { usePathname } from "next/navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-react";

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="flex h-full w-17.5 flex-col items-center gap-y-4 bg-[#381349] pb-1 pt-2.25">
            <WorkspaceSwitcher />

            <SidebarButton
                icon={Home}
                label="Home"
                isActive={pathname.includes("/workspace")}
            />
            <SidebarButton icon={MessagesSquare} label="DMs" />
            <SidebarButton icon={Bell} label="Activity" />
            <SidebarButton icon={MoreHorizontal} label="More" />

            <div className="mt-auto flex flex-col items-center justify-center gap-y-1">
                <UserButton />
            </div>
        </aside>
    );
};
