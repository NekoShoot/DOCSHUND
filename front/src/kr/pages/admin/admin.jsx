import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import AdminSideBar from "./components/adminSideBar";

const Admin = () => {
  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSideBar />
      <main className="flex-1 p-6 ml-[280px]">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
