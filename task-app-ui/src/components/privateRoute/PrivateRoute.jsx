import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidenav from "../sidenav/Sidenav";
import Topnav from "../topnav/Topnav";
import { TaskProvider } from "../../scripts/services/taskcontext/TaskContext";
import { useAuth } from "../../scripts/services/authcontext/authContext";
function PrivateRoute() {
  const { auth } = useAuth();
  if (auth === null) {
    return <p>Loading...</p>;
  }

  return auth ? (
    <div style={{ display: "flex" }}>
      <Sidenav />
      <div style={{ flex: 1, padding: "0", backgroundColor: "#f4f6f8" }}>
        <TaskProvider>
          <Topnav />
          <Outlet />
        </TaskProvider>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoute;
