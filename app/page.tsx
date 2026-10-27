import { UserButton } from "@/features/auth/components/user-button";
import { Loader } from "lucide-react";
import React from "react";

const Home = () => {
    return (
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-2 bg-[#5E2C5F]/95 text-white">
            <UserButton />
            <Loader className="size-5 animate-spin" />
        </div>
    );
};

export default Home;
