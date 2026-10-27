"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

type ChannelIdParams = {
    channelId: Id<"channels">;
};

export const useChannelId = () => {
    const params = useParams<ChannelIdParams>();

    return params.channelId;
};
