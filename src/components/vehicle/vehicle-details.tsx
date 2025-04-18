import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Card,
  Descriptions,
  Spin,
  Button,
  Row,
  Col,
  Divider,
  Tag,
  Tooltip,
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DashboardOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useGetVehicle } from "./hooks/use-get-vehicle";
import moment from "moment";
import { socketService } from "../../services/socket.service";
import Header from "../layout/Header";

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicle, isLoading, error } = useGetVehicle(id || "");
  const [currentSpeed, setCurrentSpeed] = useState<number | null>(null);
  const [currentIgnitionStatus, setCurrentIgnitionStatus] = useState<
    boolean | null
  >(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "connecting" | "disconnected"
  >("connecting");
  const [reconnecting, setReconnecting] = useState(false);

  // Use refs to track retry attempts across renders
  const retryAttemptsRef = useRef(0);
  const maxRetryAttempts = 5;

  // Display retry count in UI when in trouble
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connectToSocket = useCallback(async () => {
    if (!id) return;

    try {
      // Only update UI state if we're not already connecting
      if (!reconnecting) {
        setConnectionStatus("connecting");
        setReconnecting(true);
        setConnectionError(null);
      }

      // Wait for connection to complete
      await socketService.connect();

      // Reset retry counter on success
      retryAttemptsRef.current = 0;

      // Only when connected, join the room
      socketService.joinRoom(id, "client");
      setConnected(true);
      setConnectionStatus("connected");
      setReconnecting(false);
      setConnectionError(null);

      // Listen for vehicle telemetry updates
      socketService.on("vehicleTelemetryUpdated", (data) => {
        if (data.vehicleId === id) {
          setCurrentSpeed(data.speedKm);
          setLastUpdated(new Date());
        }
      });

      // Listen for vehicle ignition updates
      socketService.on("vehicleIgnitionUpdated", (data) => {
        if (data.vehicleId === id) {
          // Update the UI based on ignition state
          setCurrentIgnitionStatus(data.isIgnitionOn);
          setLastUpdated(new Date());
        }
      });

      // Listen for other users joining/leaving the room
      socketService.on("user_joined", (data) => {
        console.log("User joined the client room:", data);
      });

      socketService.on("user_left", (data) => {
        console.log("User left the client room:", data);
      });

      // Handle disconnect events
      const handleDisconnect = () => {
        setConnectionStatus("disconnected");
        setConnected(false);
      };

      // Handle connection errors
      const handleError = (error: any) => {
        console.error("Socket error:", error);
        setConnectionStatus("disconnected");
        setConnected(false);

        // Log specific error information for debugging
        if (error.description) {
          console.error("Error details:", error.description);
        }
      };

      socketService.on("disconnect", handleDisconnect);
      socketService.on("connect_error", handleError);
      socketService.on("error", handleError);

      return () => {
        socketService.off("disconnect", handleDisconnect);
        socketService.off("connect_error", handleError);
        socketService.off("error", handleError);
      };
    } catch (error) {
      console.error("Error connecting to socket:", error);
      retryAttemptsRef.current++;

      setConnectionStatus("disconnected");
      setReconnecting(false);

      // Set error message with retry count for UI
      setConnectionError(
        `Connection error (Attempt ${retryAttemptsRef.current}/${maxRetryAttempts}): ${(error as Error).message}`
      );

      // Don't try to immediately reconnect, let the useEffect handle it
      return undefined;
    }
  }, [id]);

  useEffect(() => {
    let cleanupFn: (() => void) | undefined;
    let reconnectInterval: NodeJS.Timeout | null = null;
    let reconnectTimeoutId: NodeJS.Timeout | null = null;

    // Connect to socket and store cleanup function
    const setupConnection = async () => {
      // Don't try to connect if we've reached max retry attempts
      if (retryAttemptsRef.current >= maxRetryAttempts) {
        console.log(
          `Maximum retry attempts (${maxRetryAttempts}) reached. Stopping automatic reconnection.`
        );
        setConnectionError(
          `Maximum retry attempts (${maxRetryAttempts}) reached. Please try manual reconnection.`
        );
        return;
      }

      try {
        // Clear any pending reconnect timeout
        if (reconnectTimeoutId) {
          clearTimeout(reconnectTimeoutId);
          reconnectTimeoutId = null;
        }

        // Attempt connection
        cleanupFn = await connectToSocket();
      } catch (error) {
        console.error("Failed to connect to socket:", error);

        // If there's a cooldown error, extract the wait time
        const errorMsg = (error as Error).message || "";
        const cooldownMatch = errorMsg.match(/Try again in (\d+)s/);

        if (cooldownMatch && cooldownMatch[1]) {
          const waitSeconds = parseInt(cooldownMatch[1], 10);
          console.log(`Will retry in ${waitSeconds} seconds due to cooldown`);

          setConnectionError(
            `Connection cooldown active. Will retry in ${waitSeconds} seconds.`
          );

          // Schedule reconnect after cooldown
          reconnectTimeoutId = setTimeout(() => {
            if (connectionStatus === "disconnected") {
              setupConnection();
            }
          }, waitSeconds * 1000);
        }
      }
    };

    // Initialize connection on mount
    setupConnection();

    // Set up a reconnection interval if in disconnected state
    const setupReconnectInterval = () => {
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
      }

      // Try to reconnect every 30 seconds if disconnected (longer interval to avoid rapid cycles)
      reconnectInterval = setInterval(() => {
        if (
          connectionStatus === "disconnected" &&
          !reconnecting &&
          !reconnectTimeoutId &&
          retryAttemptsRef.current < maxRetryAttempts
        ) {
          console.log("Attempting scheduled reconnect...");
          setupConnection();
        }
      }, 30000); // 30 seconds - longer interval to prevent rapid reconnection
    };

    setupReconnectInterval();

    // Reset retry counter when component is mounted or id changes
    retryAttemptsRef.current = 0;

    // Cleanup on component unmount
    return () => {
      if (cleanupFn) cleanupFn();

      if (reconnectInterval) {
        clearInterval(reconnectInterval);
      }

      if (reconnectTimeoutId) {
        clearTimeout(reconnectTimeoutId);
      }

      if (socketService.isConnected()) {
        socketService.off("vehicleTelemetryUpdated", () => {});
        socketService.off("vehicleIgnitionUpdated", () => {});
        socketService.off("user_joined", () => {});
        socketService.off("user_left", () => {});
        socketService.leaveRoom(id || "", "client");
      }
    };
  }, [id, connectToSocket]);

  // Allow manual reconnection with reset of retry counter
  const handleManualReconnect = useCallback(() => {
    retryAttemptsRef.current = 0;
    setConnectionError(null);
    connectToSocket();
  }, [connectToSocket]);

  // Format relative time (e.g., "2 minutes ago")
  const getRelativeTime = () => {
    if (!lastUpdated) return null;
    return moment(lastUpdated).fromNow();
  };

  // Get status badge properties
  const getStatusBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return { status: "green", text: "Vehicle Connected" };
      case "connecting":
        return { status: "blue", text: "Vehicle Connecting" };
      case "disconnected":
        return { status: "magenta", text: "Vehicle Disconnected" };
      default:
        return { status: "volcano", text: "Vehicle Connection Unknown" };
    }
  };

  // Initialize ignition status state once vehicle data is loaded
  useEffect(() => {
    if (vehicle) {
      setCurrentIgnitionStatus(vehicle.isIgnitionOn);
    }
  }, [vehicle]);

  if (!id) return <div>Error: No vehicle ID provided</div>;

  if (isLoading) return <Spin size="large" />;

  if (error)
    return <div>Error loading vehicle: {(error as Error).message}</div>;

  if (!vehicle) return <div>Vehicle not found</div>;

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";
    return moment(dateString).format("MMMM DD, YYYY");
  };

  const statusBadge = getStatusBadge();

  return (
    <div>
      <div className="row">
        <Header
          headerText="Vehicle Details"
          headerIcon={<InfoCircleOutlined />}
        />
      </div>
      <div className="d-flex justify-content-end mb-4">
        <div className="d-flex gap-2">
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

      <Badge.Ribbon text={statusBadge.text} color={statusBadge.status}>
        <Card className="shadow-lg">
          <Row className="mb-md-4">
            <div className="flex items-center">
              {connectionStatus === "disconnected" && (
                <Button
                  type="dashed"
                  icon={<ReloadOutlined />}
                  size="small"
                  onClick={handleManualReconnect}
                  loading={reconnecting}
                  className="mr-4"
                  disabled={reconnecting}
                >
                  Reconnect
                </Button>
              )}
              {connectionError && (
                <span className="text-red-500 mr-4 text-sm">
                  {connectionError}
                </span>
              )}
              {connected && (
                <>
                  {currentIgnitionStatus !== null ? (
                    currentIgnitionStatus ? (
                      <Tag
                        color={
                          currentSpeed
                            ? currentSpeed > 80
                              ? "red"
                              : "green"
                            : "default"
                        }
                      >
                        {currentSpeed !== null
                          ? `${currentSpeed} km/h`
                          : "No data"}
                      </Tag>
                    ) : (
                      <Tag color="gray">Engine Off</Tag>
                    )
                  ) : (
                    <Tag color="default">Ignition Unknown</Tag>
                  )}
                  {lastUpdated && (
                    <Tooltip
                      title={`Last updated: ${lastUpdated.toLocaleString()}`}
                    >
                      <div className="flex items-center ml-3 text-gray-500 pt-md-2">
                        <ClockCircleOutlined className="mr-1" />
                        <span>&nbsp;{getRelativeTime()}</span>
                      </div>
                    </Tooltip>
                  )}
                </>
              )}
            </div>
          </Row>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Vehicle Identification</h3>
          </div>
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
                <Descriptions.Item label="Make">
                  {vehicle.make}
                </Descriptions.Item>
                <Descriptions.Item label="Model">
                  {vehicle.vehicleModel}
                </Descriptions.Item>
                <Descriptions.Item label="Year">
                  {vehicle.year}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>

          <Divider />
          <h3 className="text-lg font-semibold mb-2">Vehicle Details</h3>
          <Row gutter={[24, 0]}>
            <Col span={12}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Type">
                  {vehicle.type}
                </Descriptions.Item>
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
                  {vehicle.purchasePrice
                    ? `$${vehicle.purchasePrice.toLocaleString()}`
                    : "N/A"}
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
                  {vehicle.insurance?.provider || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Policy Number">
                  {vehicle.insurance?.policyNumber || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Coverage Type">
                  {vehicle.insurance?.coverageType || "N/A"}
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
      </Badge.Ribbon>
    </div>
  );
};

export default VehicleDetails;
