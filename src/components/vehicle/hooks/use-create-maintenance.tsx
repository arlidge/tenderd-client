import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../services/axios.service";
import { MaintenanceCreateData } from "../types/vehicle.types";

export const useCreateMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MaintenanceCreateData) => {
      return apiClient.post("v1/maintenance", data);
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
  });
};
