import { UserProvider } from "@auth0/nextjs-auth0/client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Note Mosaic",
  description:
    "Note Mosaic is a note-taking app that allows you to take notes and save them to your account.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <TooltipProvider>
          <body className={inter.className}>{children}</body>
        </TooltipProvider>
      </UserProvider>
    </html>
  );
}
