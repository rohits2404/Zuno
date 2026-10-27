import { Sidebar } from "@/features/workspaces/components/id/sidebar";
import { Toolbar } from "@/features/workspaces/components/id/toolbar";
import React, { PropsWithChildren } from "react";

const WorkspaceIdLayout = ({ children }: Readonly<PropsWithChildren>) => {
    return (
        <div className="h-full">
            <Toolbar />
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar />
                {children}
            </div>
        </div>
    );
};

export default WorkspaceIdLayout;
