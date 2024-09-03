import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const ApiUrl = "http://localhost:3000/";

  const login = async (email, password) => {
    try {
      const response = await axios.post(ApiUrl + "auth/login", {
        email,
        password,
      });
      setAuth(response.data);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    } catch (error) {
      console.error("A tentativa de login falhou", error);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await axios.post(ApiUrl + "auth/logout", {
      refresh_token: refreshToken,
    });
    setAuth(response.data);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const response = await axios.post(ApiUrl + "auth/refresh_token", {
        refresh_token: refreshToken,
      });
      setAuth(response.data);
      localStorage.setItem("access_token", response.data.access_token);
    } catch (error) {
      console.error("Refresh token failed", error);
      logout();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("access_token");
      if (isTokenExpiringSoon(token)) {
        refreshToken();
      }
    }, 3 * 60 * 1000);

    return () => clearInterval(interval);
  });

  const value = {
    auth,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

function isTokenExpiringSoon(token) {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000);
  const timeLeft = exp - currentTime;
  return timeLeft < 180;
}
