import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
} from "antd";
import { toast } from "react-toastify";
import { VehicleCreatePayload } from "./types/vehicle.types";
import { useCreateVehicle } from "./hooks/use-create-vehicle";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

const VehicleCreate: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createVehicle, isPending } = useCreateVehicle();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleCreatePayload>({
    defaultValues: {
      status: "active",
      type: "sedan",
      fuelType: "petrol",
      transmission: "automatic",
      insurance: {},
    },
  });

  const onSubmit = (data: VehicleCreatePayload) => {
    createVehicle(data, {
      onSuccess: () => {
        toast.success("Vehicle created successfully");
        navigate("/vehicles");
      },
      onError: (error: any) => {
        toast.error(`Failed to create vehicle: ${error.message}`);
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Create New Vehicle</h1>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/vehicles")}
        >
          Back to List
        </Button>
      </div>

      <Card>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle Identification */}
            <div className="md:col-span-2">
              <Title level={4}>Vehicle Identification</Title>
            </div>

            <Item
              label="Registration Number"
              required
              validateStatus={errors.registrationNumber ? "error" : ""}
              help={errors.registrationNumber?.message}
            >
              <Controller
                name="registrationNumber"
                control={control}
                rules={{ required: "Registration number is required" }}
                render={({ field }) => <Input {...field} />}
              />
            </Item>

            <Item
              label="VIN"
              required
              validateStatus={errors.vin ? "error" : ""}
              help={errors.vin?.message}
            >
              <Controller
                name="vin"
                control={control}
                rules={{ required: "VIN is required" }}
                render={({ field }) => <Input {...field} />}
              />
            </Item>

            {/* Vehicle Details */}
            <div className="md:col-span-2 mt-4">
              <Title level={4}>Vehicle Details</Title>
            </div>

            <Item
              label="Make"
              required
              validateStatus={errors.make ? "error" : ""}
              help={errors.make?.message}
            >
              <Controller
                name="make"
                control={control}
                rules={{ required: "Make is required" }}
                render={({ field }) => <Input {...field} />}
              />
            </Item>

            <Item
              label="Model"
              required
              validateStatus={errors.vehicleModel ? "error" : ""}
              help={errors.vehicleModel?.message}
            >
              <Controller
                name="vehicleModel"
                control={control}
                rules={{ required: "Model is required" }}
                render={({ field }) => <Input {...field} />}
              />
            </Item>

            <Item
              label="Year"
              required
              validateStatus={errors.year ? "error" : ""}
              help={errors.year?.message}
            >
              <Controller
                name="year"
                control={control}
                rules={{
                  required: "Year is required",
                  min: { value: 1900, message: "Year must be 1900 or later" },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: "Year cannot be in the future",
                  },
                }}
                render={({ field }) => (
                  <InputNumber {...field} className="w-full" />
                )}
              />
            </Item>

            <Item label="Color">
              <Controller
                name="color"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Item>

            <Item
              label="Vehicle Type"
              required
              validateStatus={errors.type ? "error" : ""}
              help={errors.type?.message}
            >
              <Controller
                name="type"
                control={control}
                rules={{ required: "Vehicle type is required" }}
                render={({ field }) => (
                  <Select {...field}>
                    <Option value="sedan">Sedan</Option>
                    <Option value="suv">SUV</Option>
                    <Option value="truck">Truck</Option>
                    <Option value="van">Van</Option>
                    <Option value="bus">Bus</Option>
                    <Option value="motorcycle">Motorcycle</Option>
                    <Option value="other">Other</Option>
                  </Select>
                )}
              />
            </Item>

            <Item
              label="Fuel Type"
              required
              validateStatus={errors.fuelType ? "error" : ""}
              help={errors.fuelType?.message}
            >
              <Controller
                name="fuelType"
                control={control}
                rules={{ required: "Fuel type is required" }}
                render={({ field }) => (
                  <Select {...field}>
                    <Option value="petrol">Petrol</Option>
                    <Option value="diesel">Diesel</Option>
                    <Option value="electric">Electric</Option>
                    <Option value="hybrid">Hybrid</Option>
                    <Option value="cng">CNG</Option>
                    <Option value="lpg">LPG</Option>
                  </Select>
                )}
              />
            </Item>

            <Item label="Engine Capacity (CC)">
              <Controller
                name="engineCapacityCC"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} className="w-full" />
                )}
              />
            </Item>

            <Item label="Transmission">
              <Controller
                name="transmission"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                    <Option value="manual">Manual</Option>
                    <Option value="automatic">Automatic</Option>
                    <Option value="cvt">CVT</Option>
                    <Option value="amt">AMT</Option>
                  </Select>
                )}
              />
            </Item>

            <Item
              label="Status"
              required
              validateStatus={errors.status ? "error" : ""}
              help={errors.status?.message}
            >
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select {...field}>
                    <Option value="active">Active</Option>
                    <Option value="maintenance">Maintenance</Option>
                    <Option value="retired">Retired</Option>
                    <Option value="out_of_service">Out of Service</Option>
                  </Select>
                )}
              />
            </Item>

            {/* Purchase Information */}
            <div className="md:col-span-2 mt-4">
              <Title level={4}>Purchase Information</Title>
            </div>

            <Item label="Purchase Date">
              <Controller
                name="purchaseDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="w-full"
                    onChange={(date) => field.onChange(date)}
                    value={field.value}
                  />
                )}
              />
            </Item>

            <Item label="Purchase Price">
              <Controller
                name="purchasePrice"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} className="w-full" prefix="$" />
                )}
              />
            </Item>

            {/* Insurance Information */}
            <div className="md:col-span-2 mt-4">
              <Title level={4}>Insurance Information</Title>
            </div>

            <Item label="Insurance Provider">
              <Controller
                name="insurance.provider"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Item>

            <Item label="Policy Number">
              <Controller
                name="insurance.policyNumber"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Item>

            <Item label="Coverage Type">
              <Controller
                name="insurance.coverageType"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Item>

            <Item label="Premium">
              <Controller
                name="insurance.premium"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} className="w-full" prefix="$" />
                )}
              />
            </Item>

            <Item label="Start Date">
              <Controller
                name="insurance.startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="w-full"
                    onChange={(date) => field.onChange(date)}
                    value={field.value}
                  />
                )}
              />
            </Item>

            <Item label="End Date">
              <Controller
                name="insurance.endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="w-full"
                    onChange={(date) => field.onChange(date)}
                    value={field.value}
                  />
                )}
              />
            </Item>

            {/* Additional Information */}
            <div className="md:col-span-2 mt-4">
              <Title level={4}>Additional Information</Title>
            </div>

            <Item label="GPS Device ID">
              <Controller
                name="gpsDeviceId"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
            </Item>

            <div className="md:col-span-2">
              <Item label="Notes">
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => <TextArea {...field} rows={4} />}
                />
              </Item>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-4">
            <Button onClick={() => navigate("/vehicles")}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Create Vehicle
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default VehicleCreate;
