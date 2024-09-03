import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const ApiUrl = "http://localhost:3000/";

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    } else {
      setAuth(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Enviando requisição:", { email, password });
      const response = await axios.post(
        ApiUrl + "auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setAuth(response.data);
      localStorage.setItem("auth", JSON.stringify(response.data));
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      startTokenRefreshInterval();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error("Erro de login:", error.response.data.message);
        setAuth(null);
        throw error;
      } else {
        console.error("A tentativa de login falhou", error);
        setAuth(null);
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      await axios.post(ApiUrl + "auth/logout", {
        refresh_token: refreshToken,
      });
    } catch (error) {
      console.log("Ocorreu um erro ao realizar o logout" + error);
    } finally {
      setAuth(null);
      localStorage.removeItem("auth");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      clearTokenRefreshInterval();
    }
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

  function isTokenExpiringSoon(token) {
    if (!token) return true;
    const { exp } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = exp - currentTime;
    return timeLeft < 180;
  }

  function startTokenRefreshInterval() {
    clearTokenRefreshInterval();

    const interval = setInterval(() => {
      const token = localStorage.getItem("access_token");
      console.log(token);
      if (isTokenExpiringSoon(token)) {
        refreshToken();
      }
    }, 3 * 60 * 1000);

    setAuth((prevAuth) => ({ ...prevAuth, interval }));
  }

  function clearTokenRefreshInterval() {
    if (auth?.interval) {
      clearInterval(auth.interval);
    }
  }

  useEffect(() => {
    return () => clearTokenRefreshInterval();
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
