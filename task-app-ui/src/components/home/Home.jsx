import React from "react";
import { useAuth } from "../../scripts/services/authServices/authContext";
import "./Home.css";

const Home = () => {
  const { auth } = useAuth();
  console.log(auth);

  return <div className="home-container"></div>;
};

export default Home;
