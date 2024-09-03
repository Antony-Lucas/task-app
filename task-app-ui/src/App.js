import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginOrRegister from "./components/loginOrRegister/LoginOrRegister";
import Home from "./components/home/Home";
import PrivateRoute from "./components/privateRoute/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navigate to="/home" />
            </PrivateRoute>
          }
        />
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
