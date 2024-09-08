import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../scripts/services/authServices/authContext";
import Sidenav from "../sidenav/Sidenav";
import Topnav from "../topnav/Topnav";
import { FilterProvider } from "../../scripts/services/filterContext/FilterContext";
function PrivateRoute() {
  const { auth } = useAuth();
  if (auth === null) {
    return <p>Loading...</p>;
  }

  return auth ? (
    <div style={{ display: "flex" }}>
      <Sidenav />
      <div style={{ flex: 1, padding: "0", backgroundColor: "#f4f6f8" }}>
        <FilterProvider>
          <Topnav />
          <Outlet />
        </FilterProvider>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateRoute;
