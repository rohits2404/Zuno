"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Conversation } from "../components/id/conversation";

export const MemberId = () => {
    const workspaceId = useWorkspaceId();
    const memberId = useMemberId();

    const [conversationId, setConversationId] =
        useState<Id<"conversations"> | null>(null);

    const { mutate, isPending } = useCreateOrGetConversation();

    useEffect(() => {
        mutate(
            {
                workspaceId,
                memberId,
            },
            {
                onSuccess: (data) => setConversationId(data),
                onError: () => {
                    toast.error("Failed To Create Or Get Conversation.");
                },
            },
        );
    }, [workspaceId, memberId, mutate]);

    if (isPending) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!conversationId) {
        return (
            <div className="h-full flex-col items-center justify-center gap-y-2">
                <AlertTriangle className="size-6 text-muted-foreground" />

                <span className="text-sm text-muted-foreground">
                    Conversation Not Found.
                </span>
            </div>
        );
    }

    return <Conversation id={conversationId} />;
};
