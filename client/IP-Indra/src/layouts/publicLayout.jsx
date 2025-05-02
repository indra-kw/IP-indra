import { Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-vh-100 vw-100 d-flex flex-column">
      <Navbar />
      <Outlet />
    </div>
  );
}
