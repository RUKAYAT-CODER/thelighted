"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  timestamp: string;
  admin?: {
    username: string;
  };
}

interface RecentActivityProps {
  logs: AuditLog[];
}

interface ActionConfig {
  icon: string;
  colorClasses: string;
}

function getActionConfig(action: string): ActionConfig {
  const firstWord = action.toLowerCase().split(" ")[0];

  switch (firstWord) {
    case "created":
      return {
        icon: "✨",
        colorClasses: "text-green-600 bg-green-50",
      };
    case "updated":
      return {
        icon: "📝",
        colorClasses: "text-blue-600 bg-blue-50",
      };
    case "deleted":
      return {
        icon: "🗑️",
        colorClasses: "text-red-600 bg-red-50",
      };
    case "toggled":
      return {
        icon: "🔄",
        colorClasses: "text-gray-600 bg-gray-50",
      };
    default:
      return {
        icon: "📌",
        colorClasses: "text-gray-600 bg-gray-50",
      };
  }
}

function capitalizeEntityType(entityType: string): string {
  return entityType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
};

export function RecentActivity({ logs }: RecentActivityProps) {
  const displayLogs = logs.slice(0, 5);
  const hasLogs = displayLogs.length > 0;

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
        </div>
        <Link
          href="/admin/audit-logs"
          className={cn(
            "inline-flex items-center gap-1 text-sm font-medium",
            "text-gray-600 hover:text-gray-900",
            "transition-colors duration-200"
          )}
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Content */}
      <div className="p-6">
        {!hasLogs ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No recent activity</p>
          </div>
        ) : (
          <motion.ul
            className="space-y-4"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {displayLogs.map((log) => {
              const config = getActionConfig(log.action);
              const username = log.admin?.username ?? "System";
              const relativeTime = formatDistanceToNow(new Date(log.timestamp), {
                addSuffix: true,
              });

              return (
                <motion.li
                  key={log.id}
                  className="flex items-center gap-4"
                  variants={itemVariants}
                >
                  {/* Icon Container */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
                      config.colorClasses
                    )}
                  >
                    {config.icon}
                  </div>

                  {/* Action Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {log.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {username} • {relativeTime}
                    </p>
                  </div>

                  {/* Entity Type Badge */}
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      "bg-gray-100 text-gray-700 capitalize"
                    )}
                  >
                    {capitalizeEntityType(log.entityType)}
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </div>
    </motion.div>
  );
}
