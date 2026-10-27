"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

type WorkspaceIdParams = {
    workspaceId: Id<"workspaces">;
};

export const useWorkspaceId = () => {
    const params = useParams<WorkspaceIdParams>();
    return params.workspaceId;
};
