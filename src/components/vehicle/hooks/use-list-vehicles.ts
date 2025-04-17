import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { VehicleResponse } from "../types/vehicle.types";
import { apiClient } from "../../../services/axios.service";

interface VehiclesData {
  docs: VehicleResponse[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

interface ApiResponse {
  data: {
    data: VehiclesData;
  };
}

interface useListVehiclesParams {
  page?: number;
  limit?: number;
}

const fetchVehicles = async ({
  page = 1,
  limit = 10,
}: useListVehiclesParams) => {
  const response = await apiClient.get<ApiResponse>("v1/vehicle", {
    params: { page, limit },
  });
  return response.data.data;
};

export const useListVehicles = (params: useListVehiclesParams = {}) => {
  const { page = 1, limit = 10 } = params;

  const queryKey = useMemo(() => ["vehicles", { page, limit }], [page, limit]);

  return useQuery({
    queryKey,
    queryFn: () => fetchVehicles({ page, limit }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
