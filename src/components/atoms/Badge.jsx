import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2";
  
  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    todo: "bg-gray-100 text-gray-800 border border-gray-200",
    progress: "bg-blue-100 text-blue-800 border border-blue-200",
    done: "bg-green-100 text-green-800 border border-green-200",
    react: "bg-red-100 text-red-800 border border-red-200",
    maintain: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    improve: "bg-green-100 text-green-800 border border-green-200"
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      ref={ref}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;