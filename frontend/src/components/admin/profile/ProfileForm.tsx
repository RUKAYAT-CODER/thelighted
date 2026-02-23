"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Validation schema
const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData: {
    username: string;
    email: string;
  };
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isSubmitting: boolean;
}

export function ProfileForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  // Reset form when initialData changes
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const onFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

  const isSubmitDisabled = isSubmitting || !isDirty;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Profile Information
      </h2>

      <form onSubmit={onFormSubmit} className="space-y-6">
        {/* Username Field - Read Only */}
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register("username")}
            disabled
            readOnly
            className={cn(
              "w-full px-3 py-2 border rounded-md text-sm",
              "bg-gray-50 text-gray-500 border-gray-200",
              "cursor-not-allowed",
              "focus:outline-none focus:ring-0"
            )}
          />
          {errors.username && (
            <p className="text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        {/* Email Field - Editable */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            disabled={isSubmitting}
            className={cn(
              "w-full px-3 py-2 border rounded-md text-sm",
              "bg-white text-gray-900 border-gray-300",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "transition-colors duration-200",
              isSubmitting && "opacity-60 cursor-not-allowed"
            )}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={cn(
              "inline-flex items-center justify-center px-4 py-2",
              "text-sm font-medium text-white rounded-md",
              "transition-colors duration-200",
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
