import apiClient from "../interceptor/interceptorServices";
import {
  ErrorToastMessage,
  SuccessToastMessage,
} from "../toastServices/ToastServices";

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`user/${id}`);
    return response.data;
  } catch (error) {
    ErrorToastMessage("Erro ao obter dados do usuário:", "top-center");
    throw error;
  }
};

export const updateUser = async (id, updateData) => {
  try {
    const response = await apiClient.patch(`user/${id}`, updateData);
    SuccessToastMessage("Seu perfil foi atualizado", "top-center");
    return response.data;
  } catch (error) {
    ErrorToastMessage(`Erro: ${error.response.data.message}`, "top-center");
    throw error;
  }
};

export const deleteUser = async (id, logout) => {
  try {
    const response = apiClient.delete(`user/${id}`);
    logout();
    return response.data;
  } catch (error) {
    ErrorToastMessage("Ocorreu um erro ao excluir sua conta");
    throw error;
  }
};
