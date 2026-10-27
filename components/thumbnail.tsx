import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ThumbnailProps {
    url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
    if (!url) return null;

    return (
        <Dialog>
            <DialogTrigger>
                <div className="relative my-2 max-w-90 cursor-zoom-in overflow-hidden rounded-lg border">
                    <img
                        src={url}
                        alt="Message image"
                        className="size-full rounded-md object-cover"
                    />
                </div>
            </DialogTrigger>

            <DialogContent
                isThumbnail
                className="max-w-200 border-none bg-transparent p-0 shadow-none"
            >
                <img
                    src={url}
                    alt="Message image"
                    className="size-full rounded-md object-cover"
                />
            </DialogContent>
        </Dialog>
    );
};
