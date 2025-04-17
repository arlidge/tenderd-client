import { useState, useEffect } from "react";
import { message } from "antd";
import { apiClient } from "../../../services/axios.service";
import { Vehicle } from "../types/vehicle.types";

interface ApiResponse {
  data: Vehicle;
}

export const useGetVehicle = (id: string) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response: ApiResponse = await apiClient.get(`v1/vehicle/${id}`);
        if (!response.data) {
          throw new Error(`Failed to fetch vehicle`);
        }

        const data: Vehicle = response.data;
        console.log(data);
        setVehicle(data);
      } catch (err) {
        setError(err as Error);
        message.error("Failed to load vehicle details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  return { vehicle, isLoading, error };
};
