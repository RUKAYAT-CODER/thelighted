"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Contact,
  House,
  Image as ImageIcon,
  MenuSquare,
  ShieldUser,
  UserCircle,
  X,
} from "lucide-react";
import { AdminRole } from "@/lib/types/user";
import { useAuthStore } from "@/lib/store/authStore";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  allowedRoles?: AdminRole[];
}

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV_ITEMS: NavigationItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: House },
  {
    name: "Users",
    href: "/admin/users",
    icon: ShieldUser,
    allowedRoles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN],
  },
  { name: "Menu", href: "/admin/menu", icon: MenuSquare },
  {
    name: "Contacts",
    href: "/admin/contacts",
    icon: Contact,
    allowedRoles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.MANAGER],
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    allowedRoles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.MANAGER],
  },
  {
    name: "Gallery",
    href: "/admin/gallery",
    icon: ImageIcon,
    allowedRoles: [AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.MANAGER],
  },
  { name: "Profile", href: "/admin/profile", icon: UserCircle },
];

function canViewItem(role: AdminRole | null, item: NavigationItem): boolean {
  if (!item.allowedRoles) return true;
  if (!role) return false;
  return item.allowedRoles.includes(role);
}

function isRouteActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.user?.role ?? null);

  const visibleNavItems = NAV_ITEMS.filter((item) => canViewItem(role, item));

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white lg:hidden",
          "transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
              A
            </span>
            <span className="text-sm font-semibold text-gray-900">
              Admin Panel
            </span>
          </Link>

          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close sidebar"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1.5 p-3">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isRouteActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.24, ease: "easeInOut" }}
        className="fixed inset-y-0 left-0 z-40 hidden border-r border-gray-200 bg-white lg:flex lg:flex-col"
      >
        <div className="flex h-16 items-center border-b border-gray-100 px-3">
          <Link
            href="/admin/dashboard"
            className={cn(
              "inline-flex min-w-0 items-center rounded-md py-1.5 hover:bg-gray-50",
              isCollapsed ? "px-0" : "gap-2 px-2"
            )}
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
              A
            </span>

            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  key="brand-label"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="truncate text-sm font-semibold text-gray-900"
                >
                  Admin Panel
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5 p-3">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isRouteActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center px-2" : "gap-3 px-3",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />

                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      key={`${item.href}-label`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.14 }}
                      className="truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "flex w-full items-center rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors",
              "hover:bg-gray-50 hover:text-gray-900",
              isCollapsed ? "justify-center px-2" : "gap-2 px-3"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export default AdminSidebar;
