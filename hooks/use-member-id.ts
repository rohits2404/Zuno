"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

type MemberIdParams = {
    memberId: Id<"members">;
};

export const useMemberId = () => {
    const params = useParams<MemberIdParams>();

    return params.memberId;
};
