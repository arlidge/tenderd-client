import { createBrowserRouter } from "react-router-dom";
import { HomeOutlined, CarOutlined } from "@ant-design/icons";
import { AppLogo } from "../components/layout/Logo";
import MainLayout from "../components/layout/MainLayout";
import VehicleContainer from "../components/vehicle/Vehicle.container";
import VehicleCreate from "../components/vehicle/VehicleCreate";
import VehicleDetails from "../components/vehicle/VehicleDetails";
import VehicleUpdate from "../components/vehicle/VehicleUpdate";
import VehicleTable from "../components/vehicle/VehicleTable";

const menuItems = [
  {
    key: "home",
    label: "Home",
    path: "/",
    icon: <HomeOutlined />,
  },
  {
    key: "vehicles",
    label: "Vehicles",
    path: "/vehicles",
    icon: <CarOutlined />,
  },
];

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <p>Tenderd Home</p>
  </div>
);

const NotFoundPage = () => (
  <div>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout
        menuItems={menuItems}
        showDrawer={true}
        showNav={false}
        logo={<AppLogo />}
        footerContent="©2025 Tenderd. All Rights Reserved."
      />
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "vehicles",
        element: <VehicleContainer />,
        children: [
          {
            index: true,
            element: <VehicleTable pageSize={10} />,
          },
          {
            path: "create",
            element: <VehicleCreate />,
          },
          {
            path: ":id",
            element: <VehicleDetails />,
          },
          {
            path: ":id/update",
            element: <VehicleUpdate />,
          },
        ],
      },
    ],
  },
]);

export default routes;
