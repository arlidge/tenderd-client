import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../services/axios.service";
import { Vehicle } from "../types/vehicle.types";

interface ApiResponse {
  data: Vehicle;
}

const fetchVehicle = async (id: string) => {
  const response = await apiClient.get<ApiResponse>(`v1/vehicle/${id}`);
  if (!response.data) {
    throw new Error(`Failed to fetch vehicle`);
  }
  return response.data;
};

export const useGetVehicle = (id: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => fetchVehicle(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    vehicle: data || null,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
