"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  Hash,
  Eye,
} from "lucide-react";

// Assuming these are your existing UI components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { cn } from "@/lib/utils";

// 1. Define the Zod Validation Schema
const formSchema = z.object({
  imageUrl: z.string().min(1, "Post image is required"),
  caption: z.string().min(10, "Caption must be at least 10 characters"),
  permalink: z.string().url("Must be a valid Instagram URL"),
  displayOrder: z.coerce.number().min(0, "Display order cannot be negative"),
  isVisible: z.boolean().default(true),
});

export type InstagramFormValues = z.infer<typeof formSchema>;

interface InstagramFormProps {
  initialData?: Partial<InstagramFormValues>;
  onSubmit: (data: InstagramFormValues) => Promise<void>;
  isSubmitting: boolean;
  submitLabel?: string;
}

export default function InstagramForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Post",
}: InstagramFormProps) {
  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InstagramFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
      caption: initialData?.caption || "",
      permalink: initialData?.permalink || "",
      displayOrder: initialData?.displayOrder ?? 0,
      isVisible: initialData?.isVisible ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {/* Section 1: Post Image */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Post Image</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Upload Image <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Recommended dimensions: 1080x1080px (1:1 square ratio) for best
                display on the grid.
              </p>

              <Controller
                control={control}
                name="imageUrl"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    className={cn(errors.imageUrl && "border-red-500")}
                  />
                )}
              />
              {errors.imageUrl && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Post Details */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <AlignLeft className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Post Details</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Caption */}
          <div>
            <label
              htmlFor="caption"
              className="block text-sm font-medium text-gray-900 mb-1"
            >
              Caption <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              This text will display when users hover over the image on the
              website.
            </p>
            <Textarea
              id="caption"
              {...register("caption")}
              disabled={isSubmitting}
              rows={4}
              placeholder="Write an engaging caption..."
              className={cn(
                "w-full",
                errors.caption && "border-red-500 focus-visible:ring-red-500",
              )}
            />
            {errors.caption && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.caption.message}
              </p>
            )}
          </div>

          {/* Permalink */}
          <div>
            <label
              htmlFor="permalink"
              className="block text-sm font-medium text-gray-900 mb-1 flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4 text-gray-400" />
              Instagram Post URL <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Users will be redirected to this URL when they click the post.
            </p>
            <Input
              id="permalink"
              type="url"
              {...register("permalink")}
              disabled={isSubmitting}
              placeholder="https://www.instagram.com/p/..."
              className={cn(
                "w-full",
                errors.permalink && "border-red-500 focus-visible:ring-red-500",
              )}
            />
            {errors.permalink && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.permalink.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Order */}
            <div>
              <label
                htmlFor="displayOrder"
                className="block text-sm font-medium text-gray-900 mb-1 flex items-center gap-2"
              >
                <Hash className="w-4 h-4 text-gray-400" />
                Display Order
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Lower numbers appear first. Example: 0 is the first post.
              </p>
              <Input
                id="displayOrder"
                type="number"
                min="0"
                {...register("displayOrder")}
                disabled={isSubmitting}
                className={cn(
                  "w-full",
                  errors.displayOrder &&
                    "border-red-500 focus-visible:ring-red-500",
                )}
              />
              {errors.displayOrder && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.displayOrder.message}
                </p>
              )}
            </div>

            {/* Visibility Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-400" />
                Visibility
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Controls whether this post is visible on the public website.
              </p>
              <div className="flex items-center h-[42px]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isVisible")}
                    disabled={isSubmitting}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900 disabled:opacity-50"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Show on website
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full sm:w-auto min-w-[160px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
