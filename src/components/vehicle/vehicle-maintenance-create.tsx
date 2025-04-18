import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Typography,
} from "antd";
import { toast } from "react-toastify";
import moment from "moment";
import { useCreateMaintenance } from "./hooks/use-create-maintenance";
import { MaintenanceCreateData } from "./types/vehicle.types";

const { Title } = Typography;
const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

interface VehicleMaintenanceCreateProps {
  visible: boolean;
  onClose: () => void;
  vehicleId: string;
  onSuccess?: () => void;
}

const VehicleMaintenanceCreate: React.FC<VehicleMaintenanceCreateProps> = ({
  visible,
  onClose,
  vehicleId,
  onSuccess,
}) => {
  const { mutate: createMaintenance, isPending } = useCreateMaintenance();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MaintenanceCreateData>({
    defaultValues: {
      vehicleId,
      date: new Date(),
      type: "scheduled",
      status: "pending",
      description: "",
    },
  });

  const onSubmit = (data: MaintenanceCreateData) => {
    createMaintenance(data, {
      onSuccess: () => {
        toast.success("Maintenance record created successfully");
        reset();
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      },
      onError: (error: any) => {
        toast.error(`Failed to create maintenance record: ${error.message}`);
      },
    });
  };

  return (
    <Modal
      title="Create Maintenance Record"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Item
            label="Date"
            required
            validateStatus={errors.date ? "error" : ""}
            help={errors.date?.message}
          >
            <Controller
              name="date"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  className="w-full"
                  onChange={(date) =>
                    field.onChange(date ? date.toDate() : null)
                  }
                  value={field.value ? moment(field.value) : undefined}
                />
              )}
            />
          </Item>

          <Item
            label="Maintenance Type"
            required
            validateStatus={errors.type ? "error" : ""}
            help={errors.type?.message}
          >
            <Controller
              name="type"
              control={control}
              rules={{ required: "Maintenance type is required" }}
              render={({ field }) => (
                <Select {...field}>
                  <Option value="scheduled">Scheduled</Option>
                  <Option value="unscheduled">Unscheduled</Option>
                  <Option value="preventive">Preventive</Option>
                  <Option value="corrective">Corrective</Option>
                  <Option value="inspection">Inspection</Option>
                  <Option value="other">Other</Option>
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
                  <Option value="pending">Pending</Option>
                  <Option value="in_progress">In Progress</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              )}
            />
          </Item>

          <Item
            label="Cost"
            validateStatus={errors.cost ? "error" : ""}
            help={errors.cost?.message}
          >
            <Controller
              name="cost"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} className="w-full" min={0} prefix="$" />
              )}
            />
          </Item>

          <Item
            label="Odometer Reading (km)"
            validateStatus={errors.odometerReadingKm ? "error" : ""}
            help={errors.odometerReadingKm?.message}
          >
            <Controller
              name="odometerReadingKm"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} className="w-full" min={0} />
              )}
            />
          </Item>

          <div className="md:col-span-2">
            <Item
              label="Description"
              required
              validateStatus={errors.description ? "error" : ""}
              help={errors.description?.message}
            >
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => <TextArea {...field} rows={3} />}
              />
            </Item>
          </div>

          <div className="md:col-span-2">
            <Item
              label="Notes"
              validateStatus={errors.notes ? "error" : ""}
              help={errors.notes?.message}
            >
              <Controller
                name="notes"
                control={control}
                render={({ field }) => <TextArea {...field} rows={3} />}
              />
            </Item>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Create Maintenance Record
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default VehicleMaintenanceCreate;
