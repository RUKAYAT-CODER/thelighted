"use client";

import { ReactNode, useState } from "react";
import { ProtectedRoute } from "@/providers/ProtectedRoute";
import { cn } from "@/lib/utils";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  leftHeaderContent?: ReactNode;
  unreadNotifications?: number;
  onNotificationsClick?: () => void;
}

export function AdminLayout({
  children,
  title,
  leftHeaderContent,
  unreadNotifications = 0,
  onNotificationsClick,
}: AdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen overflow-x-hidden bg-gray-50">
        <div
          aria-hidden="true"
          className={cn(
            "fixed inset-0 z-30 bg-black/30 transition-opacity duration-200 lg:hidden",
            isMobileSidebarOpen
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          )}
          onClick={() => setIsMobileSidebarOpen(false)}
        />

        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        <div
          className={cn(
            "min-h-screen transition-all duration-300 ease-in-out",
            "lg:ml-64",
            isSidebarCollapsed && "lg:ml-20"
          )}
        >
          <AdminHeader
            title={title}
            leftContent={leftHeaderContent}
            unreadNotifications={unreadNotifications}
            onNotificationsClick={onNotificationsClick}
            onMenuClick={() => setIsMobileSidebarOpen(true)}
          />

          <main className="overflow-x-hidden p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AdminLayout;
