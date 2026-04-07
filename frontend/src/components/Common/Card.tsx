/**
 * Card Component
 * Flexible container for content with multiple styling variants
 * Supports elevated, outlined, and default styles
 */

import React from "react";
import { cn } from "../../lib/cn.ts";
import { CardProps } from "../../types";

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", children, className, ...props }, ref) => {
    const baseStyles = "rounded-lg p-6 transition-all duration-200";

    const variantStyles = {
      default: "bg-white border border-neutral-200 shadow-sm",
      elevated: "bg-white shadow-md hover:shadow-lg",
      outlined: "bg-neutral-50 border-2 border-primary-200",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;