import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface PhysicalStockItem {
  id?: string;
  itemId: string;
  itemName?: string;
  location: string;
  quantity: number;
  lastUpdated: string; // ISO string
  countedBy: string;
  notes?: string | null;
}

export function usePhysicalStock() {
  const queryClient = useQueryClient();

  const stockQuery = useQuery<PhysicalStockItem[]>({
    queryKey: ["physical-stock"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/physical-stock");
      // Graceful JSON parse
      let data: any = [];
      try {
        data = await response.json();
      } catch (e) {
        console.warn("Failed to parse physical stock list JSON", e);
      }
      return Array.isArray(data) ? data : [];
    },
  });

  // Helper: safely parse JSON from a Response, detecting HTML fallback
  const parseJson = async (res: Response) => {
    const contentType = res.headers.get("Content-Type") || "";
    const text = await res.text();
    if (contentType.includes("text/html") || text.trim().startsWith("<")) {
      throw new Error("Server returned HTML instead of JSON. Possible route mismatch or server error.");
    }
    try {
      return text ? JSON.parse(text) : null;
    } catch (e) {
      throw new Error("Failed to parse server JSON response");
    }
  };

  // Optimistic Create
  const createMutation = useMutation<PhysicalStockItem, Error, Omit<PhysicalStockItem, "id">>({
    mutationFn: async (payload) => {
      const res = await apiRequest("POST", "/api/physical-stock", payload);
      return await parseJson(res);
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["physical-stock"] });
      const prev = queryClient.getQueryData<PhysicalStockItem[]>(["physical-stock"]) || [];
      const optimistic: PhysicalStockItem = {
        ...newItem,
        id: `temp-${Date.now()}`,
        itemName: prev.find(i => i.itemId === newItem.itemId)?.itemName,
      } as PhysicalStockItem;
      queryClient.setQueryData<PhysicalStockItem[]>(["physical-stock"], [optimistic, ...prev]);
      return { prev }; // context
    },
    onError: (_err, _vars, ctx: any) => {
      if (ctx?.prev) queryClient.setQueryData(["physical-stock"], ctx.prev);
    },
    onSuccess: (created, _vars, _ctx) => {
      // Replace temp item
      queryClient.setQueryData<PhysicalStockItem[]>(["physical-stock"], (curr = []) => {
        return curr.map(item => item.id?.startsWith("temp-") ? created : item);
      });
    },
  });

  // Optimistic Update
  const updateMutation = useMutation<PhysicalStockItem, Error, Partial<PhysicalStockItem> & { id: string }>({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiRequest("PUT", `/api/physical-stock/${id}`, payload);
      return await parseJson(res);
    },
    onMutate: async (update) => {
      await queryClient.cancelQueries({ queryKey: ["physical-stock"] });
      const prev = queryClient.getQueryData<PhysicalStockItem[]>(["physical-stock"]) || [];
      queryClient.setQueryData<PhysicalStockItem[]>(["physical-stock"], prev.map(item => item.id === update.id ? { ...item, ...update } as PhysicalStockItem : item));
      return { prev };
    },
    onError: (_err, _vars, ctx: any) => {
      if (ctx?.prev) queryClient.setQueryData(["physical-stock"], ctx.prev);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<PhysicalStockItem[]>(["physical-stock"], (curr = []) => curr.map(i => i.id === updated.id ? updated : i));
    },
  });

  // Optimistic Delete
  const deleteMutation = useMutation<{ message: string; id?: string }, Error, string>({
    mutationFn: async (id) => {
      const res = await apiRequest("DELETE", `/api/physical-stock/${id}`);
      let data: any;
      try {
        data = await parseJson(res);
      } catch (e) {
        data = { message: "Deleted" };
      }
      return { ...data, id };
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["physical-stock"] });
      const prev = queryClient.getQueryData<PhysicalStockItem[]>(["physical-stock"]) || [];
      queryClient.setQueryData<PhysicalStockItem[]>(["physical-stock"], prev.filter(i => i.id !== id));
      return { prev };
    },
    onError: (_err, _vars, ctx: any) => {
      if (ctx?.prev) queryClient.setQueryData(["physical-stock"], ctx.prev);
    },
  });

  return { ...stockQuery, createMutation, updateMutation, deleteMutation };
}

export function useInventoryItems() {
  return useQuery<any[]>({
    queryKey: ["inventory-items"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/inventory-items");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });
}
