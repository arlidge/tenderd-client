import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VehicleCreatePayload } from "../types/vehicle.types";
import { apiClient } from "../../../services/axios.service";

interface CreateVehicleResponse {
  data: {
    data: {
      id: string;
    };
  };
}

const createVehicle = async (payload: VehicleCreatePayload) => {
  const response = await apiClient.post<CreateVehicleResponse>(
    "v1/vehicle",
    payload
  );
  return response.data.data;
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      // Invalidate the vehicles list query to fetch updated data
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};
