import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

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
                    <ConvexClientProvider>
                        <Toaster theme="light" richColors closeButton />
                        {children}
                    </ConvexClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
