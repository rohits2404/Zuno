import { format } from "date-fns";

interface ChannelHeroProps {
    name: string;
    creationTime: number;
}

export const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
    return (
        <div className="mx-5 mb-4 mt-22">
            <p className="mb-2 flex items-center text-2xl font-bold">
                # {name}
            </p>

            <p className="mb-4 text-base font-normal text-slate-800">
                This Channel Was Created On{" "}
                {format(new Date(creationTime), "MMMM do, yyyy")}. This Is The
                Very Beginning Of The <strong>{name}</strong> Channel.
            </p>
        </div>
    );
};
