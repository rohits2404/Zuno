"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
    ),
});

interface ChatInputProps {
    placeholder?: string;
}

type CreateMessageValues = {
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    body: string;
    image?: Id<"_storage">;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState(false);

    const innerRef = useRef<Quill | null>(null);

    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();

    const handleSubmit = async ({
        body,
        image,
    }: {
        body: string;
        image: File | null;
    }) => {
        try {
        } catch (error) {
            toast.error("Failed To Send Message.");
        } finally {
            setIsPending(false);
            innerRef?.current?.enable(true);
        }
    };

    return (
        <div className="w-full px-5">
            <Editor
                placeholder={placeholder}
                key={editorKey}
                onSubmit={handleSubmit}
                disabled={isPending}
                innerRef={innerRef}
            />
        </div>
    );
};
