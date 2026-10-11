import React, { useCallback, useState } from "react";
import "../styles/warehouse.css";
import { initials } from "../utils/warehouseUtils.js";
import useWarehouseData from "../hooks/useWarehouseData.js";
import WarehouseShell from "../components/WarehouseShell.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";

export default function WarehouseApp({
  user = {},
  warehouseId = user.id,
  navigate,
}) {
  const [toast, setToast] = useState(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const notify = useCallback((msg, isError = false) => {
    setToast({ msg, isError });
    window.setTimeout(() => setToast(null), 3500);
  }, []);
  const data = useWarehouseData(warehouseId, notify);
  const handleNavigate = useCallback(
    (page) => {
      if (typeof navigate !== "function") {
        notify(`The ${page} page is not available in this dashboard build.`, true);
        return;
      }
      navigate(page);
    },
    [navigate, notify],
  );
  const currentDate = new Date();
  const greeting =
    currentDate.getHours() < 12
      ? "Good Morning"
      : currentDate.getHours() < 17
        ? "Good Afternoon"
        : "Good Evening";

  return (
    <WarehouseShell
      activePage="dashboard"
      headerTitle="Dashboard"
      inventoryOpen={inventoryOpen}
      onNavigate={handleNavigate}
      onToggleInventory={() => setInventoryOpen((open) => !open)}
      user={user}
      initials={initials}
      onSettings={() => handleNavigate("settings")}
      toast={toast}
    >
      <DashboardPage
        user={user}
        greeting={greeting}
        today={currentDate.toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
        stats={data.stats}
        activityRows={data.inventory.slice(0, 5)}
        onShipments={() => handleNavigate("shipments")}
        onPreAlerts={() => handleNavigate("prealert")}
      />
    </WarehouseShell>
  );
}
