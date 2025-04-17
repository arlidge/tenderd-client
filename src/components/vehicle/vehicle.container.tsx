import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VehicleTable from "./vehicle-table";
import VehicleCreate from "./vehicle-create";
import VehicleDetails from "./vehicle-details";
import VehicleUpdate from "./vehicle-update";
import { Button } from "antd";
const queryClient = new QueryClient();

// Define view types enum
enum ViewType {
  LIST = "list",
  CREATE = "create",
  DETAILS = "details",
  UPDATE = "update",
}

interface ViewState {
  type: ViewType;
  vehicleId?: string; // For details and update views
}

const VehiclesPage: React.FC = () => {
  const [view, setView] = useState<ViewState>({ type: ViewType.LIST });

  // Helper functions to change views
  const goToList = () => setView({ type: ViewType.LIST });
  const goToCreate = () => setView({ type: ViewType.CREATE });
  const goToDetails = (id: string) =>
    setView({ type: ViewType.DETAILS, vehicleId: id });
  const goToUpdate = (id: string) =>
    setView({ type: ViewType.UPDATE, vehicleId: id });

  // Get title based on current view
  const getTitle = () => {
    switch (view.type) {
      case ViewType.CREATE:
        return "Create New Vehicle";
      case ViewType.DETAILS:
        return "Vehicle Details";
      case ViewType.UPDATE:
        return "Update Vehicle";
      default:
        return "Fleet Vehicles";
    }
  };

  // Render the appropriate action button based on view
  const renderActionButton = () => {
    switch (view.type) {
      case ViewType.LIST:
        return (
          <Button type="primary" onClick={goToCreate}>
            Create Vehicle
          </Button>
        );
      case ViewType.DETAILS:
        return (
          <div className="space-x-2">
            <Button onClick={goToList}>Back to List</Button>
            <Button
              type="primary"
              onClick={() => view.vehicleId && goToUpdate(view.vehicleId)}
            >
              Edit Vehicle
            </Button>
          </div>
        );
      default:
        return <Button onClick={goToList}>Back to List</Button>;
    }
  };

  // Render the main content based on view
  const renderContent = () => {
    switch (view.type) {
      case ViewType.CREATE:
        return <VehicleCreate onCancel={goToList} />;
      case ViewType.DETAILS:
        return view.vehicleId ? (
          <VehicleDetails vehicleId={view.vehicleId} onEdit={goToUpdate} />
        ) : (
          <div>Error: No vehicle ID provided</div>
        );
      case ViewType.UPDATE:
        return view.vehicleId ? (
          <VehicleUpdate vehicleId={view.vehicleId} onCancel={goToList} />
        ) : (
          <div>Error: No vehicle ID provided</div>
        );
      default:
        return (
          <VehicleTable
            pageSize={10}
            onViewDetails={goToDetails}
            onEditVehicle={goToUpdate}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{getTitle()}</h1>
          {renderActionButton()}
        </div>

        {renderContent()}
      </div>
    </QueryClientProvider>
  );
};

export default VehiclesPage;
