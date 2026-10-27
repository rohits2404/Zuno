import { Doc, Id } from "@/convex/_generated/dataModel";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { useConfirm } from "@/hooks/use-confirm";
import { usePanel } from "@/hooks/use-panel";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { Loader } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Hint } from "./hint";
import { Thumbnail } from "./thumbnail";
import { Reactions } from "./reactions";
import { ThreadBar } from "./thread-bar";
import { Toolbar } from "./toolbar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Renderer = dynamic(() => import("./renderer"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
    ),
});

const Editor = dynamic(() => import("./editor"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
    ),
});

interface MessageProps {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorName?: string;
    authorImage?: string;
    isAuthor: boolean;
    reactions: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }
    >;
    body: Doc<"messages">["body"];
    image: string | null | undefined;
    createdAt: Doc<"messages">["_creationTime"];
    updatedAt: Doc<"messages">["updatedAt"];
    isEditing: boolean;
    isCompact?: boolean;
    setEditingId: (id: Id<"messages"> | null) => void;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string;
    threadName?: string;
    threadTimestamp?: number;
}

const formatFullTime = (date: Date) => {
    return `${
        isToday(date)
            ? "Today"
            : isYesterday(date)
              ? "Yesterday"
              : format(date, "MMM d, yyyy")
    } at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
    id,
    isAuthor,
    body,
    createdAt,
    image,
    isEditing,
    authorName = "Member",
    authorImage,
    memberId,
    reactions,
    setEditingId,
    updatedAt,
    hideThreadButton,
    isCompact,
    threadCount,
    threadImage,
    threadName,
    threadTimestamp,
}: MessageProps) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Message",
        "Are You Sure You Want To Delete This Message? This Cannot Be Undone.",
    );

    const { parentMessageId, onOpenMessage, onOpenProfile, onClose } =
        usePanel();

    const { mutate: updateMessage, isPending: isUpdatingMessage } =
        useUpdateMessage();

    const { mutate: removeMessage, isPending: isRemovingMessage } =
        useRemoveMessage();

    const { mutate: toggleReaction, isPending: isTogglingReaction } =
        useToggleReaction();

    const avatarFallback = authorName.charAt(0).toUpperCase();
    const isPending =
        isUpdatingMessage || isRemovingMessage || isTogglingReaction;

    const handleUpdate = ({ body }: { body: string }) => {
        updateMessage(
            { id, body },
            {
                onSuccess: () => {
                    toast.success("Message Updated.");
                    setEditingId(null);
                },
                onError: () => {
                    toast.error("Failed To Update Message.");
                },
            },
        );
    };

    const handleDelete = async () => {
        const ok = await confirm();

        if (!ok) return;

        removeMessage(
            { id },
            {
                onSuccess: () => {
                    toast.success("Message Deleted.");

                    if (parentMessageId === id) onClose();
                },
                onError: () => {
                    toast.error("Failed To Delete Message.");
                },
            },
        );
    };

    const handleReaction = (value: string) => {
        toggleReaction(
            { messageId: id, value },
            {
                onError: () => {
                    toast.error("Failed To Toggle Reaction.");
                },
            },
        );
    };

    // Compact messages keep their existing grouped appearance.
    if (isCompact) {
        return (
            <>
                <ConfirmDialog />

                <div
                    className={cn(
                        "group relative flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60",
                        isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                        isRemovingMessage &&
                            "origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-200",
                    )}
                >
                    <div className="flex items-start gap-2">
                        <Hint label={formatFullTime(new Date(createdAt))}>
                            <button className="w-10 text-center text-sm leading-5.5 text-muted-foreground opacity-0 hover:underline group-hover:opacity-100">
                                {format(new Date(createdAt), "hh:mm")}
                            </button>
                        </Hint>

                        {isEditing ? (
                            <div className="size-full">
                                <Editor
                                    onSubmit={handleUpdate}
                                    disabled={isPending}
                                    defaultValue={JSON.parse(body)}
                                    onCancel={() => setEditingId(null)}
                                    variant="update"
                                />
                            </div>
                        ) : (
                            <div className="flex w-full flex-col">
                                <Renderer value={body} />
                                <Thumbnail url={image} />

                                {updatedAt ? (
                                    <span className="text-xs text-muted-foreground">
                                        (edited)
                                    </span>
                                ) : null}

                                <Reactions
                                    data={reactions}
                                    onChange={handleReaction}
                                />

                                <ThreadBar
                                    count={threadCount}
                                    image={threadImage}
                                    name={threadName}
                                    timestamp={threadTimestamp}
                                    onClick={() => onOpenMessage(id)}
                                />
                            </div>
                        )}
                    </div>

                    {!isEditing && (
                        <Toolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => setEditingId(id)}
                            handleThread={() => onOpenMessage(id)}
                            handleDelete={handleDelete}
                            handleReaction={handleReaction}
                            hideThreadButton={hideThreadButton}
                        />
                    )}
                </div>
            </>
        );
    }

    return (
        <>
            <ConfirmDialog />

            <div
                className={cn(
                    "group relative flex w-full px-4 py-1.5 transition-colors hover:bg-gray-50/70",
                    isAuthor ? "justify-end" : "justify-start",
                    isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                    isRemovingMessage &&
                        "origin-bottom scale-y-0 transform bg-rose-500/50 transition-all duration-200",
                )}
            >
                <div
                    className={cn(
                        "relative flex min-w-0 max-w-[85%] flex-col gap-1 rounded-2xl px-3 py-2 sm:max-w-[75%]",
                        isAuthor
                            ? "rounded-br-sm bg-[#D9FDD3] text-gray-900"
                            : "rounded-bl-sm bg-gray-100 text-gray-900",
                    )}
                >
                    {isEditing ? (
                        <div className="w-full min-w-60">
                            <Editor
                                onSubmit={handleUpdate}
                                disabled={isPending}
                                defaultValue={JSON.parse(body)}
                                onCancel={() => setEditingId(null)}
                                variant="update"
                            />
                        </div>
                    ) : (
                        <>
                            <div
                                className={cn(
                                    "flex flex-wrap items-center gap-x-2 text-xs",
                                    isAuthor ? "justify-end" : "justify-start",
                                )}
                            >
                                {!isAuthor && (
                                    <button
                                        onClick={() => onOpenProfile(memberId)}
                                        className="font-semibold text-violet-700 hover:underline"
                                    >
                                        {authorName}
                                    </button>
                                )}

                                <Hint
                                    label={formatFullTime(new Date(createdAt))}
                                >
                                    <button className="text-gray-500 hover:underline">
                                        {format(new Date(createdAt), "h:mm a")}
                                    </button>
                                </Hint>

                                {isAuthor && (
                                    <span className="font-semibold text-emerald-800">
                                        You
                                    </span>
                                )}
                            </div>

                            <div className="min-w-0 wrap-break-word text-sm leading-relaxed">
                                <Renderer value={body} />
                            </div>

                            <Thumbnail url={image} />

                            {updatedAt ? (
                                <span className="text-xs text-gray-500">
                                    (edited)
                                </span>
                            ) : null}

                            <Reactions
                                data={reactions}
                                onChange={handleReaction}
                            />

                            <ThreadBar
                                count={threadCount}
                                image={threadImage}
                                name={threadName}
                                timestamp={threadTimestamp}
                                onClick={() => onOpenMessage(id)}
                            />
                        </>
                    )}

                    {!isEditing && (
                        <div
                            className={cn(
                                "absolute top-0 z-10 opacity-0 transition-opacity group-hover:opacity-100",
                                isAuthor
                                    ? "left-0 -translate-x-2/3"
                                    : "right-0 translate-x-2/3",
                            )}
                        >
                            <Toolbar
                                isAuthor={isAuthor}
                                isPending={isPending}
                                handleEdit={() => setEditingId(id)}
                                handleThread={() => onOpenMessage(id)}
                                handleDelete={handleDelete}
                                handleReaction={handleReaction}
                                hideThreadButton={hideThreadButton}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
