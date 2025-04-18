type VehicleType =
  | "sedan"
  | "suv"
  | "truck"
  | "van"
  | "bus"
  | "motorcycle"
  | "other";
type FuelType = "petrol" | "diesel" | "electric" | "hybrid" | "cng" | "lpg";
type TransmissionType = "manual" | "automatic" | "cvt" | "amt";
type VehicleStatus = "active" | "maintenance" | "retired" | "out_of_service";

interface GeoPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

// Insurance interface
interface Insurance {
  provider?: string;
  policyNumber?: string;
  coverageType?: string;
  startDate?: Date;
  endDate?: Date;
  premium?: number;
}

type MaintenanceType =
  | "scheduled"
  | "unscheduled"
  | "preventive"
  | "corrective"
  | "inspection"
  | "other";

type MaintenanceStatus = "pending" | "in_progress" | "completed" | "cancelled";

interface Maintenance {
  id: string;
  vehicleId: string; // Reference to the Vehicle model
  date: Date;
  type: MaintenanceType;
  description: string;
  cost?: number;
  odometerReadingKm?: number;
  status: MaintenanceStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

interface Vehicle {
  id: string;
  registrationNumber: string;
  isIgnitionOn: boolean;
  vin: string;
  make: string;
  vehicleModel: string;
  year: number;
  type: VehicleType;
  color?: string;
  fuelType: FuelType;
  engineCapacityCC?: number;
  transmission?: TransmissionType;
  status: VehicleStatus;
  currentOdometerKm: number;
  fuelEfficiencyKm?: number;
  purchaseDate?: Date;
  purchasePrice?: number;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  maintenanceHistory?: Maintenance[];
  insurance?: Insurance;
  gpsDeviceId?: string;
  currentLocation?: GeoPoint;
  notes?: string;
  speedKm: number;
  createdAt?: Date;
  updatedAt?: Date;
  age?: number;
}

interface VehicleCreatePayload {
  registrationNumber: string;
  vin: string;
  make: string;
  vehicleModel: string;
  year: number;
  type: VehicleType;
  color?: string;
  fuelType: FuelType;
  engineCapacityCC?: number;
  transmission?: TransmissionType;
  status: VehicleStatus;
  purchaseDate?: Date;
  purchasePrice?: number;
  insurance?: Insurance;
  gpsDeviceId?: string;
  currentLocation?: GeoPoint;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Virtual
  age?: number;
}

interface MaintenanceCreateData {
  vehicleId: string;
  date: Date;
  type:
    | "scheduled"
    | "unscheduled"
    | "preventive"
    | "corrective"
    | "inspection"
    | "other";
  description: string;
  cost?: number;
  odometerReadingKm?: number;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  notes?: string;
}

export type {
  VehicleCreatePayload,
  Vehicle,
  MaintenanceCreateData,
  MaintenanceStatus,
  MaintenanceType,
  Maintenance,
};
