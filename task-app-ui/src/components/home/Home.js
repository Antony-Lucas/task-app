import React from "react";
import { useAuth } from "../../scripts/services/authServices/authContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Teste {auth?.user?.email}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
