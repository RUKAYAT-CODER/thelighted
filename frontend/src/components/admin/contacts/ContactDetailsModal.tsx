"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  X,
  Mail,
  Phone,
  User,
  Clock,
  Trash2,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

// Assuming these are your existing UI components
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge"; // Adjust path if needed
import { cn } from "@/lib/utils";

export type ContactStatus = "UNREAD" | "READ" | "REPLIED";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string | Date;
}

interface ContactDetailsModalProps {
  isOpen: boolean;
  contact: ContactSubmission | null;
  onClose: () => void;
  onUpdateStatus: (status: ContactStatus) => void;
  onDelete: () => void;
  isUpdating?: boolean;
}

export default function ContactDetailsModal({
  isOpen,
  contact,
  onClose,
  onUpdateStatus,
  onDelete,
  isUpdating = false,
}: ContactDetailsModalProps) {
  // Requirement: If contact is null, return null.
  if (!contact) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isUpdating ? onClose : undefined}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* 2. Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              {/* 3. Header Section */}
              <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-gray-50/50 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-3 rounded-xl shadow-sm border border-gray-200/50">
                    <Mail className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      Contact Details
                    </h2>
                    {/* Assuming StatusBadge accepts a status prop */}
                    <StatusBadge status={contact.status} />
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isUpdating}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 4. Content Section */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Contact Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="font-medium text-gray-900">
                      {contact.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-gray-900 hover:text-gray-600 underline-offset-4 hover:underline truncate"
                    >
                      {contact.email}
                    </a>
                  </div>

                  {contact.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-gray-900 hover:text-gray-600 underline-offset-4 hover:underline"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-600">
                      {formatDistanceToNow(new Date(contact.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Subject & Message */}
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Subject
                    </h3>
                    <p className="font-medium text-gray-900">
                      {contact.subject}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {contact.message}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Footer Actions */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 shrink-0">
                <div className="flex gap-2">
                  {/* Status Updates */}
                  {contact.status !== "READ" &&
                    contact.status !== "REPLIED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateStatus("READ")}
                        disabled={isUpdating}
                        className="bg-white"
                      >
                        Mark as Read
                      </Button>
                    )}
                  {contact.status !== "REPLIED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus("REPLIED")}
                      disabled={isUpdating}
                      className="bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Replied
                    </Button>
                  )}
                </div>

                {/* Delete Action */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onDelete}
                  disabled={isUpdating}
                  className="text-red-600 bg-white border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
