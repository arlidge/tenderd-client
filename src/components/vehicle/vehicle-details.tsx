import React from "react";
import { Card, Descriptions, Spin, Button, Row, Col, Divider } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useGetVehicle } from "./hooks/use-get-vehicle";
import moment from "moment";

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicle, isLoading, error } = useGetVehicle(id || "");

  if (!id) return <div>Error: No vehicle ID provided</div>;

  if (isLoading) return <Spin size="large" />;

  if (error)
    return <div>Error loading vehicle: {(error as Error).message}</div>;

  if (!vehicle) return <div>Vehicle not found</div>;

  const formatDate = (dateString: string) => {
    return moment(dateString).format("MMMM DD, YYYY");
  };

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
        <h3 className="text-lg font-semibold mb-2">Vehicle Identification</h3>
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Registration Number">
                {vehicle.registrationNumber}
              </Descriptions.Item>
              <Descriptions.Item label="VIN">{vehicle.vin}</Descriptions.Item>
              <Descriptions.Item label="GPS Device ID">
                {vehicle.gpsDeviceId}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Make">{vehicle.make}</Descriptions.Item>
              <Descriptions.Item label="Model">
                {vehicle.vehicleModel}
              </Descriptions.Item>
              <Descriptions.Item label="Year">{vehicle.year}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider />
        <h3 className="text-lg font-semibold mb-2">Vehicle Details</h3>
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Type">{vehicle.type}</Descriptions.Item>
              <Descriptions.Item label="Color">
                {vehicle.color}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {vehicle.status}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Fuel Type">
                {vehicle.fuelType}
              </Descriptions.Item>
              <Descriptions.Item label="Engine Capacity (CC)">
                {vehicle.engineCapacityCC}
              </Descriptions.Item>
              <Descriptions.Item label="Transmission">
                {vehicle.transmission}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider />
        <h3 className="text-lg font-semibold mb-2">Purchase Information</h3>
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Purchase Date">
                {formatDate(vehicle.purchaseDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Current Odometer (km)">
                {vehicle.currentOdometerKm}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Purchase Price">
                ${vehicle.purchasePrice.toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider />
        <h3 className="text-lg font-semibold mb-2">Insurance Details</h3>
        <Row gutter={[24, 0]}>
          {/* todo: uncomment following */}
          <Col span={12}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Provider">
                {vehicle.insurance.provider}
              </Descriptions.Item>
              <Descriptions.Item label="Policy Number">
                {vehicle.insurance.policyNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Coverage Type">
                {vehicle.insurance.coverageType}
              </Descriptions.Item>
            </Descriptions>
          </Col>

          {/* <Col span={12}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Start Date">
                {formatDate(vehicle?.insurance?.startDate)}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                {formatDate(vehicle?.insurance?.endDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Premium">
                ${vehicle?.insurance?.premium?.toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Col> */}
        </Row>

        {vehicle.notes && (
          <>
            <Divider />
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p>{vehicle.notes}</p>
          </>
        )}

        <Divider />
        <h3 className="text-lg font-semibold mb-2">System Information</h3>
        <Row gutter={[24, 0]}>
          <Col span={12}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Created At">
                {formatDate(vehicle.createdAt)}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Updated At">
                {formatDate(vehicle.updatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default VehicleDetails;
