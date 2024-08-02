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

import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

import { cva, type VariantProps } from "class-variance-authority";

//making default css and some varients
const paragraphVariants = cva("", {
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
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
      h3: "text-2xl sm:text-4xl md:text-3xl",
      bold: "text-bold",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

//making some interface
export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {
  asChild?: boolean;
}

//making heading element
const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "h2";
    return (
      <Comp
        className={cn(paragraphVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Paragraph.displayName = "Paragraph";

export { Paragraph, paragraphVariants };
