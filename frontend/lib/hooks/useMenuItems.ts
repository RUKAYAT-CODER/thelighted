import { useQuery } from "@tanstack/react-query";
import { menuApi } from "@/lib/api/api";

export function useMenuItems() {
return useQuery({
queryKey: ["menu-items"],
queryFn: async () => {
const response = await menuApi.getAll();
if (response.success && response.data) {
return response.data;
}
throw new Error(response.error || "Failed to load menu items");
},
staleTime: 5 _ 60 _ 1000,
gcTime: 30 _ 60 _ 1000,
retry: 2,
});
}
