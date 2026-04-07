/**
 * Navigation Component
 * Flexible navigation with horizontal and vertical layouts
 */

import React from "react";
import { MAIN_NAV_ITEMS } from "../../services/constants";
import { cn } from "../../lib/cn.ts";

interface NavigationProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  variant?: "horizontal" | "vertical";
}

const Navigation: React.FC<NavigationProps> = ({
  currentPage = "home",
  onNavigate,
  variant = "horizontal",
}) => {
  const isHorizontal = variant === "horizontal";

  return (
    <nav
      className={cn(
        "flex",
        isHorizontal
          ? "flex-row gap-1"
          : "flex-col"
      )}
    >
      {MAIN_NAV_ITEMS.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.(item.id);
            }}
            className={cn(
              "px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-primary-100 text-primary-700 font-semibold"
                : "text-neutral-600 hover:text-primary-600 hover:bg-primary-50",
              !isHorizontal && "block w-full text-left"
            )}
            title={item.description}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
};

export default Navigation;