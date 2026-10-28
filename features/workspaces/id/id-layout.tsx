"use client";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Id } from "@/convex/_generated/dataModel";
import { Profile } from "@/features/members/components/profile";
import { Thread } from "@/features/messages/components/thread";
import { Sidebar } from "@/features/workspaces/components/id/sidebar";
import { Toolbar } from "@/features/workspaces/components/id/toolbar";
import { WorkspaceSidebar } from "@/features/workspaces/components/id/workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import { PropsWithChildren, useEffect, useState } from "react";

const LAYOUT_ID = "slack-clone-workspace-layout";

export const WorkspaceIdClientLayout = ({
    children,
}: Readonly<PropsWithChildren>) => {
    const { parentMessageId, profileMemberId, onClose } = usePanel();

    const showPanel = !!parentMessageId || !!profileMemberId;

    const panelIds = showPanel
        ? ["sidebar", "main", "panel"]
        : ["sidebar", "main"];

    const [defaultLayout, setDefaultLayout] = useState<
        Record<string, number> | undefined
    >(undefined);

    useEffect(() => {
        try {
            const savedLayout = localStorage.getItem(LAYOUT_ID);

            if (savedLayout) {
                const parsed = JSON.parse(savedLayout) as Record<
                    string,
                    number
                >;

                if (panelIds.every((id) => typeof parsed[id] === "number")) {
                    setDefaultLayout(parsed);
                }
            }
        } catch (error) {
            console.error("Failed To Restore Workspace Layout:", error);
        }
    }, [showPanel]);

    const handleLayoutChanged = (layout: Record<string, number>) => {
        try {
            localStorage.setItem(LAYOUT_ID, JSON.stringify(layout));
        } catch (error) {
            console.error("Failed To Save Workspace Layout:", error);
        }
    };

    return (
        <div className="h-full">
            <Toolbar />

            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar />

                <ResizablePanelGroup
                    key={showPanel ? "with-panel" : "without-panel"}
                    orientation="horizontal"
                    defaultLayout={defaultLayout}
                    onLayoutChanged={handleLayoutChanged}
                >
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

                    {showPanel && (
                        <>
                            <ResizableHandle withHandle />

                            <ResizablePanel
                                id="panel"
                                minSize="20%"
                                defaultSize="29%"
                            >
                                {parentMessageId ? (
                                    <Thread
                                        messageId={
                                            parentMessageId as Id<"messages">
                                        }
                                        onClose={onClose}
                                    />
                                ) : profileMemberId ? (
                                    <Profile
                                        memberId={
                                            profileMemberId as Id<"members">
                                        }
                                        onClose={onClose}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <Loader className="size-5 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
            </div>
        </div>
    );
};
