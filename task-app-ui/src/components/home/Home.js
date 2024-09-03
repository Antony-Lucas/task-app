import React from "react";
import { useAuth } from "../../scripts/services/authServices/authContext";
const Home = () => {
  const { auth, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {auth?.user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;
