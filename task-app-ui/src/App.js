import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginOrRegister from "./components/loginOrRegister/LoginOrRegister";
import Home from "./components/home/Home";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import { AuthProvider } from "./scripts/services/authServices/authContext";

function App() {
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
