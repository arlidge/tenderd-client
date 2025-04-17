import React from "react";
import { Card, Descriptions, Spin } from "antd";
import { useParams } from "react-router-dom";

interface VehicleDetailsProps {
  vehicleId: string;
  onEdit?: (id: string) => void;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  vehicleId,
  onEdit,
}) => {
  // TODO: Create a hook to fetch vehicle details by ID
  const isLoading = false;
  const vehicle = null;
  const error = null;

  if (isLoading) return <Spin size="large" />;

  if (error)
    return <div>Error loading vehicle: {(error as Error).message}</div>;

  if (!vehicle) return <div>Vehicle not found</div>;

  return (
    <Card>
      <Descriptions title="Vehicle Information" bordered>
        <Descriptions.Item label="ID">{vehicleId}</Descriptions.Item>
        {/* Add other vehicle details here once the hook is implemented */}
      </Descriptions>
    </Card>
  );
};

export default VehicleDetails;
