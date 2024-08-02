import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

import { cva, type VariantProps } from "class-variance-authority";

//making default css and some varients
const headingVariants = cva(
  "transition-colors first:mt-0 mx-2 scroll-m-20 font-extrabold tracking-tight",
  {
    variants: {
      variant: {
        default: "text-card-foreground",
        destructive: "text-destructive shadow-sm",
        primary: "text-primary shadow-sm",
        warning: "text-yellow-500 shadow-sm",
        success: "text-green-600",
        muted: "text-muted",
        darkMuted: "text-muted-foreground",
      },
      size: {
        h1: "text-3xl sm:text-4xl lg:text-5xl leading-9",
        h2: "text-2xl xsm:text-3xl lg:text-4xl",
        h3: "text-2xl sm:text-4xl md:text-3xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "h2",
    },
  }
);

//making some interface
export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean;
}

//making heading element
const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h2";
    return (
      <Comp
        className={cn(headingVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
