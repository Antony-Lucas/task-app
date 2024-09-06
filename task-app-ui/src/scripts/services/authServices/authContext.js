import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ErrorToastMessage,
  SuccessToastMessage,
} from "../toastServices/ToastServices";
import { apiUrl } from "../../../env/environment";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const ApiUrl = apiUrl;

  useEffect(() => {
    const storedAuth = sessionStorage.getItem("userData");
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
      sessionStorage.setItem("userData", JSON.stringify(userData));
      sessionStorage.setItem("access_token", access_token);
      sessionStorage.setItem("refresh_token", refresh_token);
      SuccessToastMessage(
        `Bem-vindo novamente ${firstName} 😎🔥`,
        "top-center"
      );
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
      ErrorToastMessage(errorMessage, "top-right");

      throw error;
    }
  };

  const signUp = async (name, username, email, password) => {
    try {
      const response = await axios.post(ApiUrl + "auth/signup", {
        name,
        username,
        email,
        password,
      });
      const { access_token, refresh_token, userData } = response.data;
      setAuth(response.data.userData);
      sessionStorage.setItem("userData", JSON.stringify(userData));
      sessionStorage.setItem("access_token", access_token);
      sessionStorage.setItem("refresh_token", refresh_token);
      SuccessToastMessage(
        `Olá '${username}' seja bem vindo ao My tasks`,
        "top-center"
      );
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
      ErrorToastMessage(errorMessage, "top-right");
    }
  };

  const logout = async () => {
    try {
      const refreshToken = sessionStorage.getItem("refresh_token");
      await axios.post(ApiUrl + "auth/logout", {
        refresh_token: refreshToken,
      });
    } catch (error) {
      ErrorToastMessage(
        "Ocorreu um erro ao realizar o logout" + error,
        "top-center"
      );
    } finally {
      setAuth(null);
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      clearTokenRefreshInterval();
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = sessionStorage.getItem("refresh_token");
      const response = await axios.post(ApiUrl + "auth/refresh_token", {
        refresh_token: refreshToken,
      });
      setAuth((prevAuth) => ({
        ...prevAuth,
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      }));
      sessionStorage.setItem("access_token", response.data.access_token);
      sessionStorage.setItem("refresh_token", response.data.refresh_token);
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
      const token = sessionStorage.getItem("access_token");
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
