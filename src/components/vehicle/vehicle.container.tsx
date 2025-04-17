import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VehicleTable from "./vehicle-table";
import VehicleCreate from "./vehicle-create";
import { Button } from "antd";
const queryClient = new QueryClient();

const VehiclesPage: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {showCreateForm ? "Create New Vehicle" : "Fleet Vehicles"}
          </h1>

          {showCreateForm ? (
            <Button onClick={() => setShowCreateForm(false)}>
              Back to List
            </Button>
          ) : (
            <Button type="primary" onClick={() => setShowCreateForm(true)}>
              Create Vehicle
            </Button>
          )}
        </div>

        {showCreateForm ? (
          <VehicleCreate onCancel={() => setShowCreateForm(false)} />
        ) : (
          <VehicleTable pageSize={10} />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default VehiclesPage;
