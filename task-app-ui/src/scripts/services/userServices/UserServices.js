import apiClient from "../interceptor/interceptorServices";
import {
  ErrorToastMessage,
  SuccessToastMessage,
} from "../toastServices/ToastServices";

export const getUserById = async (id) => {
  const token = sessionStorage.getItem("access_token");
  console.log(token);
  try {
    const response = await apiClient.get(`user/${id}`);
    return response.data;
  } catch (error) {
    ErrorToastMessage("Erro ao obter dados do usuário:", "top-center");
    throw error;
  }
};

export const updateUser = async (id, updateData) => {
  const token = sessionStorage.getItem("access_token");
  console.log(token);
  try {
    const response = await apiClient.patch(`user/${id}`, updateData);
    SuccessToastMessage("Seu perfil foi atualizado", "top-center");
    console.log(response.data);
    return response.data;
  } catch (error) {
    ErrorToastMessage(`Erro: ${error.response.data.message}`, "top-center");
    throw error;
  }
};
