"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { Header } from "@/features/channels/components/header";
import { useChannelId } from "@/hooks/use-channel-id";
import { Loader, TriangleAlert } from "lucide-react";
import React from "react";

const ChannelIdPage = () => {
    const channelId = useChannelId();
    const { data: channel, isLoading: channelLoading } = useGetChannel({
        id: channelId,
    });

    if (channelLoading || status == "LoadingFirstPage") {
        return (
            <div className="flex h-full flex-1 items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-2">
                <TriangleAlert className="size-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    Channel Not Found.
                </span>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <Header channelName={channel.name} />
        </div>
    );
};

export default ChannelIdPage;
