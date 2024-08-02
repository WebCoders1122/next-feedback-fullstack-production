import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: string | string[];
  className?: string;
  onClick?: () => void;
};

const H2 = ({ children, className, onClick }: Props) => {
  return (
    <h2
      onClick={onClick}
      className={cn(
        className,
        "text-card-foreground text-center text-4xl transition-colors first:mt-0 mx-2 scroll-m-20 font-extrabold tracking-tight lg:text-5xl"
      )}>
      {children}
    </h2>
  );
};
export default H2;
