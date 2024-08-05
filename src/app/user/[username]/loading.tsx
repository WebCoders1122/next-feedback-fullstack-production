import { Heading } from "@/components/ui/Heading";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className='min-h-[80vh] flex justify-center items-center gap-5'>
      <Loader2 className='animate-spin font-bold' />
      <Heading>Loading Page. Please Wait...!</Heading>
    </div>
  );
}
