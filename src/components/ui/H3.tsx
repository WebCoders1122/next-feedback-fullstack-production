import React from "react";
import { cn } from "@/lib/utils";

const H3 = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        className,
        "text-primary text-center text-2xl transition-colors first:mt-0 mx-2 scroll-m-20 font-extrabold tracking-tight lg:text-3xl"
      )}>
      {children}
    </h2>
  );
};
export default H3;
