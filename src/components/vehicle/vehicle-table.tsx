import React, { useMemo, useState } from "react";
import { Tag, Button, Space } from "antd";
import { EyeOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useListVehicles } from "./hooks/use-list-vehicle";
import { Vehicle } from "./types/vehicle.types";
import PaginatedTable, { ColumnConfig } from "../common/paginated-table";

interface VehicleTableProps {
  pageSize?: number;
  className?: string;
}

const VehicleTable: React.FC<VehicleTableProps> = ({
  pageSize = 10,
  className,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || pageSize.toString(), 10);

  const { data, isLoading, error } = useListVehicles({
    page: currentPage,
    limit,
  });

  const columns = useMemo<ColumnConfig<Vehicle>[]>(
    () => [
      {
        title: "Registration Number",
        key: "registrationNumber",
        dataIndex: "registrationNumber",
        sorter: (a, b) =>
          a.registrationNumber.localeCompare(b.registrationNumber),
      },
      {
        title: "Vehicle",
        key: "vehicle",
        render: (_, record) =>
          `${record.make} ${record.vehicleModel} (${record.year})`,
        sorter: (a, b) => {
          const aStr = `${a.make} ${a.vehicleModel}`;
          const bStr = `${b.make} ${b.vehicleModel}`;
          return aStr.localeCompare(bStr);
        },
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
        render: (status: string) => {
          let color = "green";

          switch (status) {
            case "active":
              color = "green";
              break;
            case "maintenance":
              color = "orange";
              break;
            case "retired":
              color = "red";
              break;
            case "out_of_service":
              color = "gray";
              break;
            default:
              color = "blue";
          }

          return <Tag color={color}>{status.replace("_", " ")}</Tag>;
        },
        filters: [
          { text: "Active", value: "active" },
          { text: "Maintenance", value: "maintenance" },
          { text: "Retired", value: "retired" },
          { text: "Out of Service", value: "out_of_service" },
        ],
        onFilter: (value, record) => record.status === value,
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: any, record: Vehicle) => (
          <Space size="small">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => navigate(`/vehicles/${record.id}`)}
            >
              View
            </Button>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => navigate(`/vehicles/${record.id}/update`)}
            >
              Edit
            </Button>
          </Space>
        ),
      },
    ],
    [navigate]
  );

  // Transform data for the table
  const tableData = useMemo(() => {
    return (
      data?.docs.map((vehicle) => ({
        ...vehicle,
        key: vehicle.id || vehicle.id?.toString() || vehicle.registrationNumber,
      })) || []
    );
  }, [data]);

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString(), limit: limit.toString() });
  };

  if (error) {
    return <div>Error loading vehicles data: {(error as Error).message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fleet Vehicles</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/vehicles/create")}
        >
          Create Vehicle
        </Button>
      </div>

      <PaginatedTable<Vehicle>
        data={tableData}
        columns={columns}
        loading={isLoading}
        pagination={data}
        onPageChange={handlePageChange}
        rowKey="key"
        className={className}
      />
    </div>
  );
};

export default VehicleTable;
