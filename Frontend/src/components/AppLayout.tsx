import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import MobileBottomNav from "./MobileBottomNav";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="md:ml-64 min-h-screen p-4 md:p-6 pb-24 md:pb-6">
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  );
};

export default AppLayout;
