import { AdminUser } from "@/lib/types/user";
import { useAuthStore } from "@/lib/store/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9001/api";

export interface GalleryImage {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface LogoutResponse {
  message: string;
}

function buildAuthHeaders(headers?: HeadersInit): HeadersInit {
  const token = useAuthStore.getState().token;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
}

async function parseErrorMessage(response: Response): Promise<string> {
  const data = await response.json().catch(() => null);
  if (data && typeof data.message === "string") {
    return data.message;
  }
  return response.statusText || "Request failed";
}

export const adminApi = {
  logout: async (): Promise<LogoutResponse> => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: buildAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }

    const data = await response.json().catch(() => null);
    return data ?? { message: "Logged out successfully" };
  },
};

export type AdminUserWithAvatar = AdminUser & {
  avatarUrl?: string | null;
  avatar?: string | null;
  image?: string | null;
};
