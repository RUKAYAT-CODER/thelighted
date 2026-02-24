"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  RefreshCw,
  Tag,
} from "lucide-react";

export interface ActionBadgeProps {
  action: string;
  className?: string;
}

type ActionConfig = {
  theme: string;
  icon: React.ReactNode;
};

// Helper function to determine styles and icons based on keywords
const getActionConfig = (action: string): ActionConfig => {
  const normalizedAction = action.toLowerCase();

  if (normalizedAction.includes("create")) {
    return {
      theme: "bg-green-50 text-green-700 border-green-200",
      icon: <Sparkles className="w-3.5 h-3.5" />, // Maps to ✨
    };
  }
  if (
    normalizedAction.includes("update") ||
    normalizedAction.includes("edit")
  ) {
    return {
      theme: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <Edit className="w-3.5 h-3.5" />, // Maps to 📝
    };
  }
  if (normalizedAction.includes("delete")) {
    return {
      theme: "bg-red-50 text-red-700 border-red-200",
      icon: <Trash2 className="w-3.5 h-3.5" />, // Maps to 🗑️
    };
  }
  if (normalizedAction.includes("login")) {
    return {
      theme: "bg-purple-50 text-purple-700 border-purple-200",
      icon: <LogIn className="w-3.5 h-3.5" />, // Maps to 🔐
    };
  }
  if (normalizedAction.includes("logout")) {
    return {
      theme: "bg-gray-50 text-gray-700 border-gray-200",
      icon: <LogOut className="w-3.5 h-3.5" />, // Maps to 🚪
    };
  }
  if (
    normalizedAction.includes("toggle") ||
    normalizedAction.includes("status")
  ) {
    return {
      theme: "bg-orange-50 text-orange-700 border-orange-200",
      icon: <RefreshCw className="w-3.5 h-3.5" />, // Maps to 🔄
    };
  }

  // Default fallback
  return {
    theme: "bg-gray-50 text-gray-700 border-gray-200",
    icon: <Tag className="w-3.5 h-3.5" />, // Maps to 📌
  };
};

export function ActionBadge({ action, className }: ActionBadgeProps) {
  const { theme, icon } = getActionConfig(action);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        theme,
        className,
      )}
    >
      {icon}
      <span>{action}</span>
    </span>
  );
}
