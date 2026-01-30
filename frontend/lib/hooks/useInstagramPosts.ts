import { useQuery } from "@tanstack/react-query";
import { instagramApi } from "@/lib/api/api";

export function useInstagramPosts(limit: number = 6) {
return useQuery({
queryKey: ["instagram-posts-public", limit],
queryFn: async () => {
const response = await instagramApi.getPosts(limit);
if (response.success && response.data) {
return response.data;
}
throw new Error(response.error || "Failed to load Instagram posts");
},
staleTime: 5 _ 60 _ 1000,
gcTime: 30 _ 60 _ 1000,
retry: 2,
});
}
