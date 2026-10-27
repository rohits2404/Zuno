"use client";

import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUpdateChannel } from "../api/use-update-channel";
import { useRemoveChannel } from "../api/use-remove-channel";
import { toast } from "sonner";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import { VisuallyHidden } from "radix-ui";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";

interface HeaderProps {
    channelName: string;
}

export const Header = ({ channelName }: HeaderProps) => {
    const router = useRouter();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();

    const [ConfirmDialog, confirm] = useConfirm(
        "Delete This Channel?",
        "You Are About To Delete This Channel And Any Of Its Associated Messages. This Action Is Irreversible.",
    );

    const [preferencesOpen, setPreferencesOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [value, setValue] = useState(channelName);

    const { data: member, isLoading: memberLoading } = useCurrentMember({
        workspaceId,
    });

    const { mutate: updateChannel, isPending: isUpdatingChannel } =
        useUpdateChannel();

    const { mutate: removeChannel, isPending: isRemovingChannel } =
        useRemoveChannel();

    const isAdmin = member?.role === "admin";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value.replace(/\s+/g, "-").toLowerCase());
    };

    const openRenameDialog = () => {
        if (!isAdmin || isUpdatingChannel || isRemovingChannel) return;

        setPreferencesOpen(false);
        setEditOpen(true);
    };

    const openDeleteDialog = () => {
        if (!isAdmin || isUpdatingChannel || isRemovingChannel) return;

        setPreferencesOpen(false);
        setDeleteOpen(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const name = value.trim();

        if (!name || name.length < 3) {
            toast.error("Channel Name Must Be At Least 3 Characters.");
            return;
        }

        updateChannel(
            { id: channelId, name },
            {
                onSuccess: () => {
                    toast.success("Channel Updated.");
                    setEditOpen(false);
                    setValue(name);
                },
                onError: () => {
                    toast.error("Failed To Update Channel.");
                },
            },
        );
    };

    const handleDelete = async () => {
        if (!isAdmin || isRemovingChannel) return;

        const ok = await confirm();

        if (!ok) return;

        removeChannel(
            { id: channelId },
            {
                onSuccess: () => {
                    toast.success("Channel Deleted.");
                    setDeleteOpen(false);
                    setPreferencesOpen(false);
                    router.push(`/workspace/${workspaceId}`);
                },
                onError: () => {
                    toast.error("Failed To Delete Channel.");
                },
            },
        );
    };

    return (
        <div className="flex h-12.25 items-center overflow-hidden border-b bg-white px-4">
            <ConfirmDialog />

            {/* Channel Preferences */}
            <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
                <DialogTrigger asChild>
                    <Button
                        disabled={memberLoading}
                        variant="ghost"
                        className="w-auto overflow-hidden px-2 text-lg font-semibold"
                        size="sm"
                    >
                        <span className="truncate"># {channelName}</span>
                        <FaChevronDown className="ml-2 size-2.5" />
                    </Button>
                </DialogTrigger>

                <DialogContent className="overflow-hidden bg-gray-50 p-0">
                    <DialogHeader className="border-b bg-white p-4">
                        <DialogTitle># {channelName}</DialogTitle>

                        <VisuallyHidden.Root>
                            <DialogDescription>
                                Your Channel Preferences
                            </DialogDescription>
                        </VisuallyHidden.Root>
                    </DialogHeader>

                    <div className="flex flex-col gap-y-2 px-4 pb-4">
                        <button
                            type="button"
                            disabled={isUpdatingChannel || isRemovingChannel}
                            onClick={openRenameDialog}
                            className="flex w-full cursor-pointer flex-col items-start rounded-lg border bg-white px-5 py-4 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
                        >
                            <div className="flex w-full items-center justify-between">
                                <p className="text-sm font-semibold">
                                    Channel Name
                                </p>

                                {isAdmin && (
                                    <span className="text-sm font-semibold text-[#1264A3] hover:underline">
                                        Edit
                                    </span>
                                )}
                            </div>

                            <p className="w-full text-left text-sm">
                                # {channelName}
                            </p>
                        </button>

                        {isAdmin && (
                            <button
                                type="button"
                                onClick={openDeleteDialog}
                                disabled={
                                    isRemovingChannel || isUpdatingChannel
                                }
                                className="flex cursor-pointer items-center gap-x-2 rounded-lg border bg-white px-5 py-4 text-rose-600 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
                            >
                                <Trash className="size-4" />
                                <span className="text-sm font-semibold">
                                    Delete Channel
                                </span>
                            </button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Rename Channel */}
            <Dialog
                open={editOpen}
                onOpenChange={(nextOpen) => {
                    setEditOpen(nextOpen);

                    if (!nextOpen && !deleteOpen) {
                        setPreferencesOpen(true);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename This Channel</DialogTitle>

                        <VisuallyHidden.Root>
                            <DialogDescription>
                                Rename This Channel.
                            </DialogDescription>
                        </VisuallyHidden.Root>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            value={value}
                            disabled={isUpdatingChannel}
                            onChange={handleChange}
                            required
                            autoFocus
                            minLength={3}
                            maxLength={20}
                            placeholder="e.g. plan-budget"
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isUpdatingChannel}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                disabled={
                                    isUpdatingChannel ||
                                    !value.trim() ||
                                    value.trim().length < 3
                                }
                            >
                                {isUpdatingChannel ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Channel */}
            <Dialog
                open={deleteOpen}
                onOpenChange={(nextOpen) => {
                    setDeleteOpen(nextOpen);

                    if (!nextOpen && !editOpen) {
                        setPreferencesOpen(true);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete This Channel?</DialogTitle>
                        <DialogDescription>
                            You Are About To Delete This Channel And Its
                            Associated Messages. This Action Is Irreversible.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isRemovingChannel}
                            onClick={() => {
                                setDeleteOpen(false);
                                setPreferencesOpen(true);
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="destructive"
                            disabled={isRemovingChannel}
                            onClick={handleDelete}
                        >
                            {isRemovingChannel
                                ? "Deleting..."
                                : "Delete Channel"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
