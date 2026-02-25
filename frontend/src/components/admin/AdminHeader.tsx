"use client";

import { ReactNode } from "react";
import { Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/authStore";

interface AdminHeaderProps {
  title?: string;
  leftContent?: ReactNode;
  unreadNotifications?: number;
  onNotificationsClick?: () => void;
  onMenuClick?: () => void;
}

function getInitial(username?: string): string {
  if (!username) return "A";
  return username.charAt(0).toUpperCase();
}

function formatRole(role?: string): string {
  if (!role) return "Admin";
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function AdminHeader({
  title,
  leftContent,
  unreadNotifications = 0,
  onNotificationsClick,
  onMenuClick,
}: AdminHeaderProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex h-full items-center justify-between">
        <div className="min-w-0">
          {leftContent ?? (
            <h1 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
              {title ?? "Admin Dashboard"}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open sidebar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            onClick={onNotificationsClick}
            className={cn(
              "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200",
              "text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {unreadNotifications > 99 ? "99+" : unreadNotifications}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1.5 pr-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
              {getInitial(user?.username)}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block max-w-32 truncate text-sm font-medium text-gray-900">
                {user?.username ?? "Admin"}
              </span>
              <span className="block text-xs text-gray-500">
                {formatRole(user?.role)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
