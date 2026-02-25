"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useRoleProtection } from "@/lib/hooks/useRoleProtection";
import { AdminRole } from "@/lib/types/user";

interface RoleProtectedPageProps {
  children: ReactNode;
  allowedRoles: AdminRole[];
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

function DefaultLoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-orange-500" />
        <p className="text-sm font-medium text-gray-700">
          Verifying access permissions...
        </p>
      </div>
    </div>
  );
}

export function RoleProtectedPage({
  children,
  allowedRoles,
  redirectTo = "/admin/dashboard",
  loadingComponent,
}: RoleProtectedPageProps) {
  const { hasAccess, isLoading } = useRoleProtection({
    allowedRoles,
    redirectTo,
  });

  if (isLoading) {
    return <>{loadingComponent ?? <DefaultLoadingState />}</>;
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}

export default RoleProtectedPage;
