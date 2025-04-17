import React from "react";
import { Card, Descriptions, Spin, Button } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // TODO: Create a hook to fetch vehicle details by ID
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
        <h1 className="text-2xl font-bold">Vehicle Details</h1>
        <div className="space-x-2">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/vehicles")}
          >
            Back to List
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/vehicles/${id}/update`)}
          >
            Edit Vehicle
          </Button>
        </div>
      </div>

      <Card>
        <Descriptions title="Vehicle Information" bordered>
          <Descriptions.Item label="ID">{id}</Descriptions.Item>
          {/* Add other vehicle details here once the hook is implemented */}
        </Descriptions>
      </Card>
    </div>
  );
};

export default VehicleDetails;
