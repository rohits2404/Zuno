import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Zuno",
    description:
        "Zuno Is a Real-Time Team Communication Platform That Enables Seamless Messaging, Organized Channels, And Effortless Collaboration In One Workspace.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <Toaster theme="light" richColors closeButton />
                {children}
            </body>
        </html>
    );
}
