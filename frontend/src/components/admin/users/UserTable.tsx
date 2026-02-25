"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { AdminRole, AdminUser } from "@/lib/types/user";
import { cn } from "@/lib/utils";

type SortableKey = "username" | "role" | "lastLoginAt" | "createdAt";
type SortDirection = "asc" | "desc";

interface UserTableProps {
  users: AdminUser[];
  currentUserId: string;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onRoleChange: (id: string, role: AdminRole) => void;
}

const PAGE_SIZE = 10;

const ROLE_OPTIONS: AdminRole[] = [
  AdminRole.SUPER_ADMIN,
  AdminRole.ADMIN,
  AdminRole.MANAGER,
  AdminRole.STAFF,
];

function formatRole(role: AdminRole): string {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getRoleBadgeClasses(role: AdminRole): string {
  switch (role) {
    case AdminRole.SUPER_ADMIN:
      return "bg-red-50 text-red-700 border-red-200";
    case AdminRole.ADMIN:
      return "bg-blue-50 text-blue-700 border-blue-200";
    case AdminRole.MANAGER:
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function getStatusBadgeClasses(isActive: boolean): string {
  return isActive
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-gray-100 text-gray-600 border-gray-200";
}

function getSortValue(user: AdminUser, key: SortableKey): number | string {
  if (key === "lastLoginAt") {
    return user.lastLoginAt ? new Date(user.lastLoginAt).getTime() : 0;
  }

  if (key === "createdAt") {
    return new Date(user.createdAt).getTime();
  }

  if (key === "username") {
    return user.username.toLowerCase();
  }

  return user.role;
}

function SortHeader({
  label,
  sortKey,
  activeSortKey,
  direction,
  onClick,
}: {
  label: string;
  sortKey: SortableKey;
  activeSortKey: SortableKey;
  direction: SortDirection;
  onClick: (key: SortableKey) => void;
}) {
  const isActive = activeSortKey === sortKey;
  const indicator = isActive ? (direction === "asc" ? "▲" : "▼") : "↕";

  return (
    <button
      type="button"
      onClick={() => onClick(sortKey)}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide",
        "text-gray-500 hover:text-gray-800 transition-colors"
      )}
    >
      {label}
      <span className={cn("text-[10px]", isActive && "text-gray-800")}>
        {indicator}
      </span>
    </button>
  );
}

export function UserTable({
  users,
  currentUserId,
  onToggleStatus,
  onRoleChange,
}: UserTableProps) {
  const [tableUsers, setTableUsers] = useState<AdminUser[]>(users);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | AdminRole>("ALL");
  const [sortKey, setSortKey] = useState<SortableKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [editingRoleUserId, setEditingRoleUserId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setTableUsers(users);
  }, [users]);

  const currentUser = useMemo(
    () => tableUsers.find((user) => user.id === currentUserId) ?? null,
    [tableUsers, currentUserId]
  );

  const currentUserRole = currentUser?.role;
  const canManageStatuses =
    currentUserRole === AdminRole.SUPER_ADMIN ||
    currentUserRole === AdminRole.ADMIN;

  const filteredUsers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return tableUsers.filter((user) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);

      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [tableUsers, search, roleFilter]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const left = getSortValue(a, sortKey);
      const right = getSortValue(b, sortKey);

      if (left < right) return sortDirection === "asc" ? -1 : 1;
      if (left > right) return sortDirection === "asc" ? 1 : -1;
      return a.username.localeCompare(b.username);
    });
  }, [filteredUsers, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sortedUsers.slice(start, start + PAGE_SIZE);
  }, [safePage, sortedUsers]);

  const toggleSort = (nextKey: SortableKey) => {
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection("asc");
  };

  const canEditRole = (targetUser: AdminUser): boolean => {
    if (currentUserRole !== AdminRole.SUPER_ADMIN) return false;
    if (targetUser.id === currentUserId) return false;
    if (targetUser.role === AdminRole.SUPER_ADMIN) return false;
    return true;
  };

  const canToggleStatus = (targetUser: AdminUser): boolean => {
    if (!canManageStatuses) return false;
    if (targetUser.id === currentUserId) return false;
    if (targetUser.role === AdminRole.SUPER_ADMIN) return false;
    return true;
  };

  const handleRoleChange = (userId: string, role: AdminRole) => {
    setTableUsers((current) =>
      current.map((user) => (user.id === userId ? { ...user, role } : user))
    );
    onRoleChange(userId, role);
    setEditingRoleUserId(null);
  };

  const handleToggleStatus = (userId: string, isActive: boolean) => {
    const nextIsActive = !isActive;
    setTableUsers((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, isActive: nextIsActive } : user
      )
    );
    onToggleStatus(userId, nextIsActive);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Admin Users</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search username or email"
              className={cn(
                "h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              )}
            />

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as "ALL" | AdminRole)
              }
              className={cn(
                "h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              )}
            >
              <option value="ALL">All roles</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {formatRole(role)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <SortHeader
                  label="Username & Email"
                  sortKey="username"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onClick={toggleSort}
                />
              </th>
              <th className="px-4 py-3 text-left">
                <SortHeader
                  label="Role"
                  sortKey="role"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onClick={toggleSort}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left">
                <SortHeader
                  label="Last Login"
                  sortKey="lastLoginAt"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onClick={toggleSort}
                />
              </th>
              <th className="px-4 py-3 text-left">
                <SortHeader
                  label="Created"
                  sortKey="createdAt"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onClick={toggleSort}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                  No users found for the selected filters.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, index) => {
                const isCurrentUser = user.id === currentUserId;
                const userCanEditRole = canEditRole(user);
                const userCanToggleStatus = canToggleStatus(user);
                const isEditingRole = editingRoleUserId === user.id;

                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.04 }}
                    className={cn(
                      "transition-colors hover:bg-gray-50",
                      isCurrentUser && "bg-blue-50/50 hover:bg-blue-50/60"
                    )}
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {user.username}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                        {isCurrentUser && (
                          <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      {isEditingRole ? (
                        <select
                          autoFocus
                          value={user.role}
                          onBlur={() => setEditingRoleUserId(null)}
                          onChange={(event) =>
                            handleRoleChange(user.id, event.target.value as AdminRole)
                          }
                          className={cn(
                            "h-8 rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-900",
                            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          )}
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                              {formatRole(role)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                              getRoleBadgeClasses(user.role)
                            )}
                          >
                            {formatRole(user.role)}
                          </span>
                          {userCanEditRole && (
                            <button
                              type="button"
                              onClick={() => setEditingRoleUserId(user.id)}
                              className="text-xs font-medium text-blue-600 hover:text-blue-700"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 align-top">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          getStatusBadgeClasses(user.isActive)
                        )}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3 align-top text-sm text-gray-600">
                      {user.lastLoginAt
                        ? formatDistanceToNow(new Date(user.lastLoginAt), {
                            addSuffix: true,
                          })
                        : "Never"}
                    </td>

                    <td className="px-4 py-3 align-top text-sm text-gray-600">
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                      })}
                    </td>

                    <td className="px-4 py-3 align-top">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        disabled={!userCanToggleStatus}
                        className={cn(
                          "inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium transition-colors",
                          userCanToggleStatus
                            ? user.isActive
                              ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                              : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                        )}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 sm:px-6">
        <p className="text-xs text-gray-500">
          Showing{" "}
          {sortedUsers.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}
          -
          {Math.min(safePage * PAGE_SIZE, sortedUsers.length)} of{" "}
          {sortedUsers.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage <= 1}
            className={cn(
              "h-8 rounded-md border px-3 text-xs font-medium",
              safePage <= 1
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {safePage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
            disabled={safePage >= totalPages}
            className={cn(
              "h-8 rounded-md border px-3 text-xs font-medium",
              safePage >= totalPages
                ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserTable;
