// frontend/lib/hooks/useTrending.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/api";

// Hook for trending stats
export function useTrendingStats() {
return useQuery({
queryKey: ["trending-stats"],
queryFn: async () => {
const response = await api.trending.getStats();
if (response.success && response.data) {
return response.data;
}
throw new Error(response.error || "Failed to fetch trending stats");
},
staleTime: 5 _ 60 _ 1000,
gcTime: 30 _ 60 _ 1000,
retry: 2,
});
}

// Hook for trending items (click-based)
export function useTrendingItems(limit: number = 4) {
return useQuery({
queryKey: ["trending-items", limit],
queryFn: async () => {
const response = await api.trending.getTrending(limit);
if (response.success && response.data) {
return response.data.map((trendingItem) => trendingItem.item);
}
throw new Error(response.error || "Failed to load trending items");
},
staleTime: 2 _ 60 _ 1000,
gcTime: 10 _ 60 _ 1000,
retry: 2,
});
}

// Hook for chef's favorites
export function useChefsFavorites() {
return useQuery({
queryKey: ["chefs-favorites"],
queryFn: async () => {
const response = await api.trending.getChefsFavorites();
if (response.success && response.data) {
return response.data;
}
throw new Error(response.error || "Failed to load chef's favorites");
},
staleTime: 10 _ 60 _ 1000,
gcTime: 30 _ 60 _ 1000,
retry: 2,
});
}

// Combined hook that returns the appropriate data based on mode
export function useTrendingSection() {
const statsQuery = useTrendingStats();
const trendingQuery = useTrendingItems(4);
const chefsQuery = useChefsFavorites();

// Determine which mode to use
const isChefsFavorites = statsQuery.data?.isUsingChefsFavorites ?? true;
const totalInteractions = statsQuery.data?.totalInteractions ?? 0;

// Select the appropriate query based on mode
const itemsQuery = isChefsFavorites ? chefsQuery : trendingQuery;

return {
items: itemsQuery.data ?? [],
isChefsFavorites,
totalInteractions,
isLoading: statsQuery.isLoading || itemsQuery.isLoading,
error: statsQuery.error || itemsQuery.error,
refetch: () => {
statsQuery.refetch();
itemsQuery.refetch();
},
};
}
