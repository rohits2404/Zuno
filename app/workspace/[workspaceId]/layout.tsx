import { Toolbar } from "@/features/workspaces/components/id/toolbar";
import React, { PropsWithChildren } from "react";

const WorkspaceIdLayout = ({ children }: Readonly<PropsWithChildren>) => {
    return (
        <div className="h-full">
            <Toolbar />
            {children}
        </div>
    );
};

export default WorkspaceIdLayout;
