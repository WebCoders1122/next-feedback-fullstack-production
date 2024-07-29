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
        "text-3xl font-semibold tracking-tight transition-colors first:mt-0 mx-2",
        className
      )}>
      {children}
    </h2>
  );
};
export default H2;
