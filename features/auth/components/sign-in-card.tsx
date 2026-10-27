import { useState } from "react";
import { SignInFlow } from "../types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

interface SignInCardProps {
    setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    const handleOAuthSignIn = (value: "github" | "google") => {
        setPending(true);
    };

    const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        setError("");
    };

    return (
        <Card className="size-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>Login To Continue</CardTitle>
                <CardDescription>
                    Use Your Email Or Another Service To Continue.
                </CardDescription>
            </CardHeader>

            {!!error && (
                <div className="mb-6 flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    <TriangleAlert className="size-4" />
                    <p>{error}</p>
                </div>
            )}

            <CardContent className="space-y-5 px-0 pb-0">
                <form onSubmit={handleSignIn} className="space-y-2.5">
                    <Input
                        disabled={pending}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                    />

                    <Input
                        disabled={pending}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        required
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={pending}
                    >
                        Continue
                    </Button>
                </form>

                <Separator />

                <div className="flex flex-col gap-y-2.5">
                    <Button
                        disabled={pending}
                        onClick={() => handleOAuthSignIn("google")}
                        variant="outline"
                        size="lg"
                        className="relative w-full"
                    >
                        <FcGoogle className="absolute left-2.5 top-3 size-5" />
                        Continue With Google
                    </Button>

                    <Button
                        disabled={pending}
                        onClick={() => handleOAuthSignIn("github")}
                        variant="outline"
                        size="lg"
                        className="relative w-full"
                    >
                        <FaGithub className="absolute left-2.5 top-3 size-5" />
                        Continue With GitHub
                    </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    Don&apos;t Have An Account?{" "}
                    <button
                        disabled={pending}
                        onClick={() => setState("signUp")}
                        className="cursor-pointer font-medium text-sky-700 hover:underline disabled:pointer-events-none disabled:opacity-50"
                    >
                        Sign Up
                    </button>
                </p>
            </CardContent>
        </Card>
    );
};
