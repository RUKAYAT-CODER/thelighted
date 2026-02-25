"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { adminApi, AdminUserWithAvatar } from "@/lib/api/admin";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  title?: string;
  leftContent?: ReactNode;
  unreadNotifications?: number;
  onNotificationsClick?: () => void;
  className?: string;
}

function Avatar({
  avatarUrl,
  username,
  sizeClassName,
  textClassName,
}: {
  avatarUrl: string | null;
  username: string;
  sizeClassName: string;
  textClassName: string;
}) {
  if (avatarUrl) {
    return (
      <span
        aria-hidden="true"
        className={cn("inline-flex rounded-full bg-gray-100", sizeClassName)}
        style={{
          backgroundImage: `url(${avatarUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700",
        sizeClassName,
        textClassName
      )}
    >
      {getInitial(username)}
    </span>
  );
}

function formatRole(role?: string): string {
  if (!role) return "Admin";

  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getInitial(name?: string): string {
  if (!name || name.trim().length === 0) return "A";
  return name.trim().charAt(0).toUpperCase();
}

function getTitleFromPath(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean).pop();
  if (!segment) return "Dashboard";

  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function AdminHeader({
  title,
  leftContent,
  unreadNotifications = 0,
  onNotificationsClick,
  className,
}: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const user = useAuthStore((state) => state.user) as AdminUserWithAvatar | null;
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const resolvedTitle = useMemo(
    () => title ?? getTitleFromPath(pathname),
    [title, pathname]
  );

  useEffect(() => {
    if (!isMenuOpen) return;

    const onOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onOutsideClick);
    document.addEventListener("touchstart", onOutsideClick);
    return () => {
      document.removeEventListener("mousedown", onOutsideClick);
      document.removeEventListener("touchstart", onOutsideClick);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setIsMenuOpen(false);

    let logoutSucceeded = false;

    try {
      await adminApi.logout();
      logoutSucceeded = true;
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAuth();

      if (logoutSucceeded) {
        toast.success("Logged out successfully");
      }

      router.replace("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  const avatarUrl = user?.avatarUrl ?? user?.avatar ?? user?.image ?? null;
  const username = user?.username ?? "Admin";
  const email = user?.email ?? "admin@example.com";
  const roleLabel = formatRole(user?.role);

  return (
    <header
      className={cn(
        "h-16 border-b border-gray-200 bg-white px-4 sm:px-6",
        className
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <div className="min-w-0">
          {leftContent ? (
            leftContent
          ) : (
            <h1 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
              {resolvedTitle}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
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

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 pr-2 pl-1.5",
                "transition-colors hover:bg-gray-50"
              )}
            >
              <Avatar
                avatarUrl={avatarUrl}
                username={username}
                sizeClassName="h-7 w-7"
                textClassName="text-xs"
              />

              <span className="hidden min-w-0 text-left sm:block">
                <span className="block truncate text-sm font-medium text-gray-900">
                  {username}
                </span>
                <span className="block truncate text-xs text-gray-500">
                  {roleLabel}
                </span>
              </span>

              <ChevronDown
                className={cn(
                  "h-4 w-4 text-gray-500 transition-transform duration-200",
                  isMenuOpen && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className={cn(
                    "absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                  )}
                >
                  <div className="border-b border-gray-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        avatarUrl={avatarUrl}
                        username={username}
                        sizeClassName="h-10 w-10"
                        textClassName="text-sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {username}
                        </p>
                        <p className="truncate text-xs text-gray-500">{email}</p>
                        <p className="mt-1 text-xs font-medium text-gray-600">
                          {roleLabel}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-1.5">
                    <Link
                      href="/admin/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700",
                        "transition-colors hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>

                    <Link
                      href="/admin/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700",
                        "transition-colors hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm",
                        "transition-colors",
                        isLoggingOut
                          ? "cursor-not-allowed text-gray-400"
                          : "text-red-600 hover:bg-red-50 hover:text-red-700"
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
