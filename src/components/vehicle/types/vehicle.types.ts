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

interface Vehicle {
  id: string;
  registrationNumber: string;
  vin: string;
  make: string;
  vehicleModel: string;
  year: number;
  type: string;
  color: string;
  fuelType: string;
  engineCapacityCC: number;
  transmission: string;
  status: string;
  currentOdometerKm: number;
  purchaseDate: string;
  purchasePrice: number;
  insurance: Insurance;
  gpsDeviceId: string;
  currentLocation: GeoPoint;
  notes: string;
  createdAt: string;
  updatedAt: string;
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

export type { VehicleCreatePayload, Vehicle };
