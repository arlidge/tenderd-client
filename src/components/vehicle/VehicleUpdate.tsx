import React from "react";
import { Card, Spin, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";

const VehicleUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isLoading = false;
  const vehicle = null;
  const error = null;

  if (!id) return <div>Error: No vehicle ID provided</div>;

  if (isLoading) return <Spin size="large" />;

  if (error)
    return <div>Error loading vehicle: {(error as Error).message}</div>;

  if (!vehicle) return <div>Vehicle not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Update Vehicle</h1>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/vehicles")}
        >
          Back to List
        </Button>
      </div>

      <Card>
        <div>
          <h2>Edit Vehicle Form (ID: {id})</h2>
          <p>
            This will be similar to the VehicleCreate component, but
            pre-populated with the vehicle's current data. It will reuse most of
            the form structure from VehicleCreate.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default VehicleUpdate;
