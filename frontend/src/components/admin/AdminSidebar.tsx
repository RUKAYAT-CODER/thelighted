"use client";

import { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  Contact,
  House,
  Image as ImageIcon,
  MenuSquare,
  ShieldUser,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: House },
  { label: "Users", href: "/admin/users", icon: ShieldUser },
  { label: "Menu", href: "/admin/menu", icon: MenuSquare },
  { label: "Contacts", href: "/admin/contacts", icon: Contact },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Profile", href: "/admin/profile", icon: UserCircle },
];

export function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "lg:w-20" : "lg:w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      <div className="flex h-16 items-center border-b border-gray-100 px-3">
        <Link
          href="/admin/dashboard"
          className={cn(
            "inline-flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-gray-900",
            "hover:bg-gray-50"
          )}
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">
            A
          </span>
          {!isCollapsed && (
            <span className="truncate text-sm font-semibold">Admin Panel</span>
          )}
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onMobileClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 lg:inline-flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <nav className="space-y-1 p-3">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && (
                <span className="ml-3 truncate font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
