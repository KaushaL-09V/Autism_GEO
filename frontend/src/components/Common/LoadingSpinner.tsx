/**
 * LoadingSpinner Component
 * Accessible loading indicator with size and color customization
 */

import React from "react";
import { cn } from "../../lib/cn.ts";
import { LoadingSpinnerProps } from "../../types";

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "text-primary-500",
  label = "Loading...",
}) => {
  const sizeStyles = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={cn(
          "animate-spin rounded-full border-3 border-neutral-200 border-t-primary-500",
          sizeStyles[size],
          color
        )}
        role="status"
        aria-busy="true"
        aria-label={label}
      />
      {label && (
        <p className="text-sm font-medium text-neutral-600">{label}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;