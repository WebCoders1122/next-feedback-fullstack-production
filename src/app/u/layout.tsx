import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='min-h-screen'>
      <Navbar />
      {children}
    </div>
  );
}
