import React from "react";
import { cn } from "@/lib/utils";

const P = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <p className={cn("leading-7 mx-2 my-6", className)}>{children}</p>;
};
export default P;
