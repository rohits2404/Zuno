"use client";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetWorkspace } from "../../api/use-get-workspace";

export const Toolbar = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const { data } = useGetWorkspace({ id: workspaceId });

    const [open, setOpen] = useState(false);

    return (
        <nav className="flex h-10 items-center justify-between bg-[#481349] p-1.5">
            <div className="flex-1" aria-hidden />
            <div className="min-w-70 max-w-160.5 shrink grow-2">
                <Button
                    onClick={() => setOpen(true)}
                    size="sm"
                    className="h-7 w-full justify-start bg-accent/25 px-2 hover:bg-accent/25"
                >
                    <Search className="mr-2 size-4 text-white" />
                    <span className="text-xs text-white">
                        Search {data?.name ?? "Workspace"}...
                    </span>

                    <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-90">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </div>
        </nav>
    );
};
