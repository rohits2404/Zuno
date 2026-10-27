"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useCreateWorkspaceModal } from "../../store/use-create-workspace-modal";
import { useGetWorkspaces } from "../../api/use-get-workspaces";
import { useGetWorkspace } from "../../api/use-get-workspace";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";

export const WorkspaceSwitcher = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [_open, setOpen] = useCreateWorkspaceModal();

    const { data: workspaces, isLoading: workspacesLoading } =
        useGetWorkspaces();
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
        id: workspaceId,
    });

    const filteredWorkspaces = workspaces?.filter(
        (workspace) => workspace?._id !== workspaceId,
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="relative size-9 overflow-hidden bg-[#ABABAB] text-lg font-semibold text-slate-800 hover:bg-[#ABABAB]/80">
                    {workspaceLoading ? (
                        <Loader className="size-5 shrink-0 animate-spin" />
                    ) : (
                        workspace?.name.charAt(0).toUpperCase()
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="bottom" align="start" className="w-64">
                <DropdownMenuItem
                    onClick={() => router.push(`/workspace/${workspaceId}`)}
                    className="cursor-pointer flex-col items-start justify-start capitalize"
                >
                    {workspace?.name}

                    <span className="text-xs text-muted-foreground">
                        Active workspace
                    </span>
                </DropdownMenuItem>

                {filteredWorkspaces?.map((workspace) => (
                    <DropdownMenuItem
                        key={workspace._id}
                        className="cursor-pointer overflow-hidden capitalize"
                        onClick={() =>
                            router.push(`/workspace/${workspace._id}`)
                        }
                    >
                        <div className="relative mr-2 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#616061] text-xl font-semibold text-white">
                            {workspace.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="truncate">{workspace.name}</p>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    <div className="relative mr-2 flex size-9 items-center justify-center overflow-hidden rounded-md bg-[#F2F2F2] text-xl font-semibold text-slate-800">
                        <Plus />
                    </div>
                    Create a New Workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
