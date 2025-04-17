import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VehicleTable from "./vehicle-table";
const queryClient = new QueryClient();

const VehiclesPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Fleet Vehicles</h1>
        <VehicleTable pageSize={10} />
      </div>
    </QueryClientProvider>
  );
};

export default VehiclesPage;
