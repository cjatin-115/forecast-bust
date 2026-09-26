import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-100 text-blue-800 font-bold",
        secondary: "border-transparent bg-slate-100 text-slate-700",
        destructive: "border-transparent bg-red-100 text-red-800 font-bold",
        outline: "text-slate-700 border-slate-300",
        very_low: "border-emerald-200 bg-emerald-100 text-emerald-800 font-bold",
        low: "border-lime-200 bg-lime-100 text-lime-800 font-bold",
        moderate: "border-amber-200 bg-amber-100 text-amber-800 font-bold",
        high: "border-orange-200 bg-orange-100 text-orange-800 font-bold",
        very_high: "border-red-200 bg-red-100 text-red-800 font-bold",
        danger: "border-red-200 bg-red-100 text-red-800 font-bold",
        highRisk: "border-orange-200 bg-orange-100 text-orange-800 font-bold",
        warning: "border-amber-200 bg-amber-100 text-amber-800 font-bold",
        success: "border-emerald-200 bg-emerald-100 text-emerald-800 font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
