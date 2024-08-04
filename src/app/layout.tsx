import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProviderContext from "./context/SessionProvider";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anonymous Feedback",
  description: "Get Anonymous Feedback now",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <link
        rel='icon'
        href='/anonymuos-feedback.svg'
        type='image/x-icon'></link>
      <SessionProviderContext>
        <body className={(cn(inter.className), "")}>
          {children}
          <Toaster />
        </body>
      </SessionProviderContext>
    </html>
  );
}
