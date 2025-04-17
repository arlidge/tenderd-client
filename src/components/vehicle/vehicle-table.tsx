import React, { useMemo, useState } from "react";
import { Tag, Button, Space } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { useListVehicles } from "./hooks/use-list-vehicles";
import { VehicleResponse } from "./types/vehicle.types";
import PaginatedTable, { ColumnConfig } from "../common/paginated-table";

interface VehicleTableProps {
  pageSize?: number;
  className?: string;
  onViewDetails?: (id: string) => void;
  onEditVehicle?: (id: string) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({
  pageSize = 10,
  className,
  onViewDetails,
  onEditVehicle,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useListVehicles({
    page: currentPage,
    limit: pageSize,
  });

  const columns = useMemo<ColumnConfig<VehicleResponse>[]>(
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
      // Only add the actions column if we have handlers
      ...(onViewDetails || onEditVehicle
        ? [
            {
              title: "Actions",
              key: "actions",
              render: (_: any, record: VehicleResponse) => (
                <Space size="small">
                  {onViewDetails && (
                    <Button
                      icon={<EyeOutlined />}
                      size="small"
                      onClick={() => onViewDetails(record.id)}
                    >
                      View
                    </Button>
                  )}
                  {onEditVehicle && (
                    <Button
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => onEditVehicle(record.id)}
                    >
                      Edit
                    </Button>
                  )}
                </Space>
              ),
            },
          ]
        : []),
    ],
    [onViewDetails, onEditVehicle]
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
    setCurrentPage(page);
  };

  if (error) {
    return <div>Error loading vehicles data: {(error as Error).message}</div>;
  }

  return (
    <PaginatedTable<VehicleResponse>
      data={tableData}
      columns={columns}
      loading={isLoading}
      pagination={data}
      onPageChange={handlePageChange}
      rowKey="key"
      className={className}
    />
  );
};

export default VehicleTable;
