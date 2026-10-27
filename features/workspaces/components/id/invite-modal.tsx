"use client";

import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useNewJoinCode } from "../../api/use-new-join-code";
import { toast } from "sonner";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CopyIcon, RefreshCcw } from "lucide-react";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
}

export const InviteModal = ({
    open,
    setOpen,
    name,
    joinCode,
}: InviteModalProps) => {
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are You Sure?",
        "This Will Deactivate The Current Invite Code And Generate a New One.",
    );

    const { mutate, isPending } = useNewJoinCode();

    const handleNewCode = async () => {
        const ok = await confirm();

        if (!ok) return;

        mutate(
            {
                workspaceId,
            },
            {
                onSuccess: () => {
                    toast.success("Invite Code Regenerated.");
                },
                onError: () => {
                    toast.error("Failed To Regenerate Invite Code.");
                },
            },
        );
    };

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;

        navigator.clipboard
            .writeText(inviteLink)
            .then(() => toast.success("Invite Link Copied To Clipboard."))
            .catch(() => toast.error("Failed To Copy Link To Clipboard"));
    };

    return (
        <>
            <ConfirmDialog />

            <Dialog open={open || isPending} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite People To {name}</DialogTitle>
                        <DialogDescription>
                            Use The Code Below To Invite People To Your
                            Workspace.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center gap-y-4 py-10">
                        <p className="text-4xl font-bold uppercase tracking-widest">
                            {joinCode}
                        </p>

                        <Button
                            disabled={isPending}
                            onClick={handleCopy}
                            variant="ghost"
                            size="sm"
                        >
                            Copy Link <CopyIcon className="ml-2 size-4" />
                        </Button>
                    </div>

                    <div className="flex w-full items-center justify-between">
                        <Button
                            disabled={isPending}
                            onClick={handleNewCode}
                            variant="outline"
                        >
                            New Code
                            <RefreshCcw className="ml-2 size-4" />
                        </Button>

                        <DialogClose asChild>
                            <Button disabled={isPending}>Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
