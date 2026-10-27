"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const CreateWorkspaceModal = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [open, setOpen] = useCreateWorkspaceModal();
    const { isPending, mutate } = useCreateWorkspace();

    const handleClose = () => {
        setOpen(false);
        setName("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate(
            { name },
            {
                onSuccess: (id) => {
                    toast.success("Workspace Created!");
                    router.push(`/workspace/${id}`);

                    handleClose();
                },
                onError: (error) => {
                    console.error("[CREATE_WORKSPACE]: ", error);
                    toast.error("Failed To Create Workspace.");
                },
            },
        );
    };

    return (
        <Dialog open={open || isPending} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Workspace</DialogTitle>
                    <DialogDescription>
                        Get Started By Creating a New Workspace.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        disabled={isPending}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
                        minLength={3}
                        maxLength={20}
                        placeholder="Workspace Name e.g 'Work', 'Personal', 'Home'"
                    />

                    <div className="flex justify-end">
                        <Button disabled={isPending}>Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
