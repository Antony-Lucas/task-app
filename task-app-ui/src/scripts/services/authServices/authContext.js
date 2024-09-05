import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ErrorToastMessage,
  SuccessToastMessage,
} from "../toastServices/ToastServices";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const ApiUrl = "http://localhost:3000/";

  useEffect(() => {
    const storedAuth = localStorage.getItem("userData");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    } else {
      setAuth(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        ApiUrl + "auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { access_token, refresh_token, userData } = response.data;
      const firstName = userData.name.split(" ")[0];
      setAuth(response.data.userData);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      SuccessToastMessage(`Bem-vindo novamente ${firstName} 😎🔥`);
      startTokenRefreshInterval();
    } catch (error) {
      let errorMessage =
        "A tentativa de login falhou, verifique sua conexão com servidor";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = `Erro: ${error.response.data.message}`;
      }
      setAuth(null);
      ErrorToastMessage(errorMessage);

      throw error;
    }
  };

  const signUp = async (name, username, email, password) => {
    try {
      console.log(name, username, email, password);
      const response = await axios.post(ApiUrl + "auth/signup", {
        name,
        username,
        email,
        password,
      });
      const { access_token, refresh_token, userData } = response.data;
      setAuth(response.data.userData);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      SuccessToastMessage(`Olá '${username}' seja bem vindo ao My tasks`);
    } catch (error) {
      console.log(error);
      let errorMessage =
        "A tentativa de registro falhou, verifique sua conexão com servidor";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = `Erro: ${error.response.data.message}`;
      }
      setAuth(null);
      ErrorToastMessage(errorMessage);
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
      localStorage.removeItem("userData");
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
      console.log(response);
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
    signUp,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
