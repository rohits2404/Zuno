import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sidebar } from "@/features/workspaces/components/id/sidebar";
import { Toolbar } from "@/features/workspaces/components/id/toolbar";
import { WorkspaceSidebar } from "@/features/workspaces/components/id/workspace-sidebar";
import React, { PropsWithChildren } from "react";

const WorkspaceIdLayout = ({ children }: Readonly<PropsWithChildren>) => {
    return (
        <div className="h-full">
            <Toolbar />
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar />
                <ResizablePanelGroup orientation="horizontal">
                    <ResizablePanel
                        id="sidebar"
                        defaultSize="20%"
                        minSize="11%"
                        className="bg-[#5E2C5F]"
                    >
                        <WorkspaceSidebar />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel id="main" defaultSize="80%" minSize="20%">
                        {children}
                    </ResizablePanel>
                </ResizablePanelGroup>
                {children}
            </div>
        </div>
    );
};

export default WorkspaceIdLayout;
