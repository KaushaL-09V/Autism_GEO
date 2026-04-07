/**
 * Button Component
 * Reusable button with multiple variants and sizes
 * Supports loading state and accessibility features
 */

import React from "react";
import { cn } from "../../lib/cn.ts";
import { ButtonProps } from "../../types";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      className,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    // Size variants
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-6 py-3 text-lg",
    };

    // Color variants
    const variantStyles = {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300 active:bg-primary-700",
      secondary:
        "bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-300 active:bg-secondary-700",
      outline:
        "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-300 active:bg-primary-100",
      ghost:
        "text-primary-600 hover:bg-primary-50 focus:ring-primary-300 active:bg-primary-100",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;