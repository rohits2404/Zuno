import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { JotaiProvider } from "@/components/jotai-provider";
import { ModalProvider } from "@/components/modal-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Zuno",
    description:
        "Zuno Is a Real-Time Team Communication Platform That Enables Seamless Messaging, Organized Channels, And Effortless Collaboration In One Workspace.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexAuthNextjsServerProvider>
            <html lang="en">
                <body className={`${inter.className} antialiased`}>
                    <NuqsAdapter>
                        <ConvexClientProvider>
                            <JotaiProvider>
                                <Toaster theme="light" richColors closeButton />
                                <ModalProvider />
                                {children}
                            </JotaiProvider>
                        </ConvexClientProvider>
                    </NuqsAdapter>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
