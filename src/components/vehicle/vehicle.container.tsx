import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

const queryClient = new QueryClient();

const VehiclesPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6">
        <Outlet />
      </div>
    </QueryClientProvider>
  );
};

export default VehiclesPage;
