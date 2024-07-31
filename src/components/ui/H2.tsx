import React from "react";
import { cn } from "@/lib/utils";

const H2 = ({
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
        "text-card-foreground text-center text-4xl transition-colors first:mt-0 mx-2 scroll-m-20 font-extrabold tracking-tight lg:text-5xl"
      )}>
      {children}
    </h2>
  );
};
export default H2;
