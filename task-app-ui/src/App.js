import "./App.css";
import { Route, Router, Routes } from "react-router-dom";
import LoginOrRegister from "./components/loginOrRegister/LoginOrRegister";
import PrivateRoute from "./components/privateRoute/privateRoute";
import Home from "./components/home/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginOrRegister />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
