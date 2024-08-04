import { Heading } from "@/components/ui/Heading";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className='min-h-[80vh] flex flex-col justify-center items-center gap-5'>
      <Heading>
        <>
          <Loader2 className='animate-spin' />
          Something went wrong!
        </>
      </Heading>
    </div>
  );
}
