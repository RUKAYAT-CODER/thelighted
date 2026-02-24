"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Image as ImageIcon,
  Info,
  Clock,
  Tags,
  SunMoon,
  Utensils,
} from "lucide-react";

// Assuming these are your existing UI components
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { cn } from "@/lib/utils";

// --- Mock Enums (Replace with your actual imports from @/lib/types/menu) ---
enum MenuCategory {
  APPETIZER = "APPETIZER",
  MAIN_COURSE = "MAIN_COURSE",
  DESSERT = "DESSERT",
  BEVERAGE = "BEVERAGE",
}

enum MoodTag {
  COMFORT_FOOD = "COMFORT_FOOD",
  HEALTHY = "HEALTHY",
  INDULGENT = "INDULGENT",
  QUICK_BITE = "QUICK_BITE",
}

enum TimeOfDay {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  ALL_DAY = "ALL_DAY",
}

// Utility to format enum strings (e.g., "MAIN_COURSE" -> "Main Course")
const formatEnumLabel = (value: string) => {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Generate options for dropdowns and multi-selects
const categoryOptions = Object.values(MenuCategory).map((val) => ({
  label: formatEnumLabel(val),
  value: val,
}));

const moodOptions = Object.values(MoodTag).map((val) => ({
  label: formatEnumLabel(val),
  value: val,
}));

const timeOptions = Object.values(TimeOfDay).map((val) => ({
  label: formatEnumLabel(val),
  value: val,
}));
// --------------------------------------------------------------------------

// 1. Define the Zod Validation Schema
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  category: z.nativeEnum(MenuCategory, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  image: z.string().min(1, "Image is required"),
  prepTime: z.coerce
    .number()
    .min(0, "Preparation time cannot be negative")
    .optional()
    .default(0),
  moodTags: z.array(z.string()).optional().default([]),
  timeOfDay: z.array(z.string()).optional().default([]),
  isAvailable: z.boolean().default(true),
});

export type MenuFormValues = z.infer<typeof formSchema>;

interface MenuFormProps {
  initialData?: Partial<MenuFormValues>;
  onSubmit: (data: MenuFormValues) => Promise<void>;
  isSubmitting: boolean;
  submitLabel?: string;
}

export default function MenuForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Menu Item",
}: MenuFormProps) {
  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      category: initialData?.category,
      image: initialData?.image || "",
      prepTime: initialData?.prepTime || 0,
      moodTags: initialData?.moodTags || [],
      timeOfDay: initialData?.timeOfDay || [],
      isAvailable: initialData?.isAvailable ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      {/* Section 1: Basic Information */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Text Inputs */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Item Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                {...register("name")}
                disabled={isSubmitting}
                placeholder="e.g., Truffle Fries"
                className={cn("w-full", errors.name && "border-red-500")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-900 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                {...register("description")}
                disabled={isSubmitting}
                rows={4}
                placeholder="Describe the dish ingredients and flavor..."
                className={cn("w-full", errors.description && "border-red-500")}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-900 mb-1"
                >
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price")}
                  disabled={isSubmitting}
                  className={cn("w-full", errors.price && "border-red-500")}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-900 mb-1"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  {...register("category")}
                  disabled={isSubmitting}
                  className={cn(
                    "w-full h-10 px-3 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors disabled:opacity-50",
                    errors.category ? "border-red-500" : "border-gray-300",
                  )}
                >
                  <option value="">Select Category...</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Item Image <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Upload a high-quality photo of the dish.
            </p>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  className={cn("h-[260px]", errors.image && "border-red-500")}
                />
              )}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">
                {errors.image.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Additional Details */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Additional Details
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="prepTime"
                className="block text-sm font-medium text-gray-900 mb-1 flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-gray-400" />
                Preparation Time (mins)
              </label>
              <Input
                id="prepTime"
                type="number"
                min="0"
                {...register("prepTime")}
                disabled={isSubmitting}
                className={cn("w-full", errors.prepTime && "border-red-500")}
              />
              {errors.prepTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.prepTime.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                <Tags className="w-4 h-4 text-gray-400" />
                Mood Tags
              </label>
              <Controller
                control={control}
                name="moodTags"
                render={({ field }) => (
                  <MultiSelect
                    options={moodOptions}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    placeholder="Select applicable moods..."
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                <SunMoon className="w-4 h-4 text-gray-400" />
                Time of Day
              </label>
              <Controller
                control={control}
                name="timeOfDay"
                render={({ field }) => (
                  <MultiSelect
                    options={timeOptions}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    placeholder="Select best times..."
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Availability
              </label>
              <div className="flex items-center h-10">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("isAvailable")}
                    disabled={isSubmitting}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900 disabled:opacity-50"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    Item is currently available to order
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Submit Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full sm:w-auto min-w-[200px]"
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
