import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

// TODO: check metadata of all pages
export const metadata: Metadata = {
  // TODO: bring username in place of user
  title: "user Dashboard",
  description: "Verified User Dashboard to see and control feedback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
