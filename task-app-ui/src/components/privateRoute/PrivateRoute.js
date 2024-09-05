import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../scripts/services/authServices/authContext";

function PrivateRoute() {
  const { auth } = useAuth();
  if (auth === null) {
    return <p>Loading...</p>;
  }

  return auth ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
