import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginOrRegister from "./components/loginOrRegister/LoginOrRegister";
import Home from "./components/home/Home";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import "./App.css";
import { AuthProvider } from "./scripts/services/authcontext/authContext";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timeOut);
  }, []);

  if (loading) {
    return (
      <div className="loading-style">
        <ReactLoading type="spin" color="#157bff" height={30} width={30} />
      </div>
    );
  }
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<LoginOrRegister />} />
          <Route path="/home" element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
