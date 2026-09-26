import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 font-bold",
        destructive: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-600/20",
        outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs",
        secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
        ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
        glow: "bg-slate-900 text-white shadow-sm hover:bg-slate-800 font-bold",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
