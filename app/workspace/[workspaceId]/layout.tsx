import { WorkspaceIdClientLayout } from "@/features/workspaces/id/id-layout";
import React, { PropsWithChildren } from "react";

const WorkspaceIdLayout = ({ children }: Readonly<PropsWithChildren>) => {
    return <WorkspaceIdClientLayout>{children}</WorkspaceIdClientLayout>;
};

export default WorkspaceIdLayout;
