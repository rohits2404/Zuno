"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useUpdateWorkspace } from "../../api/use-update-workspace";
import { useRemoveWorkspace } from "../../api/use-remove-workspace";

interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
}

export const PreferencesModal = ({
    open,
    setOpen,
    initialValue,
}: PreferencesModalProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const [ConfirmDialog, confirmDeleteWorkspace] = useConfirm(
        "Are You Sure?",
        "This Action Can't Be Undone.",
    );

    const [value, setValue] = useState(initialValue);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
        useUpdateWorkspace();

    const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
        useRemoveWorkspace();

    const closeAllDialogs = () => {
        setOpen(false);
        setEditOpen(false);
        setDeleteOpen(false);
    };

    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateWorkspace(
            {
                id: workspaceId,
                name: value.trim(),
            },
            {
                onSuccess: () => {
                    toast.success("Workspace Updated.");
                    setEditOpen(false);
                },
                onError: () => {
                    toast.error("Failed To Update Workspace.");
                },
            },
        );
    };

    const handleRemove = async () => {
        const ok = await confirmDeleteWorkspace();

        if (!ok) return;

        removeWorkspace(
            {
                id: workspaceId,
            },
            {
                onSuccess: () => {
                    toast.success("Workspace Removed.");
                    closeAllDialogs();
                    router.replace("/");
                },
                onError: () => {
                    toast.error("Failed To Remove Workspace.");
                },
            },
        );
    };

    const openRenameDialog = () => {
        setOpen(false);
        setEditOpen(true);
    };

    const openDeleteDialog = () => {
        setOpen(false);
        setDeleteOpen(true);
    };

    return (
        <>
            <ConfirmDialog />

            {/* Workspace Preferences */}
            <Dialog
                open={open && !editOpen && !deleteOpen}
                onOpenChange={setOpen}
            >
                <DialogContent className="overflow-hidden bg-gray-50 p-0">
                    <DialogHeader className="border-b bg-white p-4">
                        <DialogTitle>{value}</DialogTitle>
                    </DialogHeader>

                    <VisuallyHidden.Root>
                        <DialogDescription>
                            Your Workspace Preferences
                        </DialogDescription>
                    </VisuallyHidden.Root>

                    <div className="flex flex-col gap-y-2 px-4 pb-4">
                        <button
                            type="button"
                            disabled={
                                isUpdatingWorkspace || isRemovingWorkspace
                            }
                            onClick={openRenameDialog}
                            className="flex w-full cursor-pointer flex-col items-start rounded-lg border bg-white px-5 py-4 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
                        >
                            <div className="flex w-full items-center justify-between">
                                <p className="text-sm font-semibold">
                                    Workspace Name
                                </p>

                                <span className="text-sm font-semibold text-[#1264A3] hover:underline">
                                    Edit
                                </span>
                            </div>

                            <p className="w-full text-left text-sm">{value}</p>
                        </button>

                        <button
                            type="button"
                            disabled={
                                isRemovingWorkspace || isUpdatingWorkspace
                            }
                            onClick={openDeleteDialog}
                            className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
                        >
                            <Trash className="size-4" />
                            <span className="text-sm font-semibold">
                                Delete Workspace
                            </span>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Rename Workspace — separate dialog */}
            <Dialog
                open={editOpen}
                onOpenChange={(nextOpen) => {
                    setEditOpen(nextOpen);

                    if (!nextOpen && !deleteOpen) {
                        setOpen(true);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename This Workspace</DialogTitle>
                    </DialogHeader>

                    <VisuallyHidden.Root>
                        <DialogDescription>
                            Rename Your Workspace.
                        </DialogDescription>
                    </VisuallyHidden.Root>

                    <form className="space-y-4" onSubmit={handleEdit}>
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            disabled={isUpdatingWorkspace}
                            required
                            autoFocus
                            minLength={3}
                            maxLength={20}
                            placeholder="Workspace Name e.g. Work, Personal"
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isUpdatingWorkspace}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                disabled={
                                    isUpdatingWorkspace ||
                                    !value.trim() ||
                                    value.trim().length < 3
                                }
                            >
                                {isUpdatingWorkspace ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Workspace — separate dialog */}
            <Dialog
                open={deleteOpen}
                onOpenChange={(nextOpen) => {
                    setDeleteOpen(nextOpen);

                    if (!nextOpen && !editOpen) {
                        setOpen(true);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Workspace?</DialogTitle>
                        <DialogDescription>
                            This Action Cannot Be Undone. Are You Sure You Want
                            To Delete This Workspace?
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isRemovingWorkspace}
                            onClick={() => {
                                setDeleteOpen(false);
                                setOpen(true);
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="destructive"
                            disabled={isRemovingWorkspace}
                            onClick={handleRemove}
                        >
                            {isRemovingWorkspace
                                ? "Deleting..."
                                : "Delete Workspace"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
