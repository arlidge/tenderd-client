import React from "react";
import { Card, Spin } from "antd";

interface VehicleUpdateProps {
  vehicleId: string;
  onCancel?: () => void;
}

const VehicleUpdate: React.FC<VehicleUpdateProps> = ({
  vehicleId,
  onCancel,
}) => {
  // TODO: Create hooks to fetch vehicle details and update vehicle
  const isLoading = false;
  const vehicle = null;
  const error = null;

  if (isLoading) return <Spin size="large" />;

  if (error)
    return <div>Error loading vehicle: {(error as Error).message}</div>;

  if (!vehicle) return <div>Vehicle not found</div>;

  return (
    <Card>
      <div>
        <h2>Edit Vehicle Form (ID: {vehicleId})</h2>
        <p>
          This will be similar to the VehicleCreate component, but pre-populated
          with the vehicle's current data. It will reuse most of the form
          structure from VehicleCreate.
        </p>
      </div>
    </Card>
  );
};

export default VehicleUpdate;
