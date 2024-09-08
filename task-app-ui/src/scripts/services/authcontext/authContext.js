import axios from "axios";
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
      console.log(response.data);
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
      const firstName = userData.name.split(" ")[0];
      setAuth(response.data.userData);
      sessionStorage.setItem("userData", JSON.stringify(userData));
      sessionStorage.setItem("access_token", access_token);
      sessionStorage.setItem("refresh_token", refresh_token);
      SuccessToastMessage(
        `Olá '${firstName}' seja bem vindo ao My tasks`,
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
      throw error;
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
    }
  };
  const value = {
    auth,
    login,
    logout,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
