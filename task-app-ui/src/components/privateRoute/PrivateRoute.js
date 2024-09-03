import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute({ children }) {
  const auth = useAuth();

  return auth ? <Outlet /> : <Navigate to="login" />;
}

export default PrivateRoute;
