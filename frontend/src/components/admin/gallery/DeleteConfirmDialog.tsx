"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button"; // Assuming your Button is here

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  imageAlt: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmDialog({
  isOpen,
  imageAlt,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isDeleting ? onCancel : undefined}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Dialog Container (Pointer events none allows clicks to pass through to backdrop) */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 pointer-events-auto"
              role="dialog"
              aria-modal="true"
            >
              {/* Warning Icon */}
              <div className="flex justify-center mb-5">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle
                    className="w-8 h-8 text-red-600"
                    strokeWidth={2}
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Gallery Image
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete this image? This action cannot
                  be undone and it will be removed from your website
                  immediately.
                </p>

                {/* Highlighted Alt Text Box */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mx-auto">
                  <p
                    className="text-sm font-medium text-gray-700 line-clamp-2 break-words"
                    title={imageAlt}
                  >
                    "{imageAlt || "Untitled Image"}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isDeleting}
                  className="w-full text-gray-700 bg-white border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white border-transparent disabled:opacity-70 flex justify-center items-center"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
