import apiClient from "../interceptor/interceptorServices";
import {
  ErrorToastMessage,
  SuccessToastMessage,
} from "../toastServices/ToastServices";

export const getTasks = async () => {
  try {
    const response = await apiClient.get(`tasks`);
    return response.data;
  } catch (error) {
    ErrorToastMessage(
      "Não foi possível obter a lista de tarefas, por favor, verifique sua conexão com o servidor",
      "top-center"
    );
    throw error;
  }
};

export const getTasksById = async (id) => {
  try {
    const response = await apiClient.get(`tasks/${id}`);
    return response.data;
  } catch (error) {
    ErrorToastMessage(
      "Não foi possível obter os dados da sua tarefa, verifique sua conexão com o servidor",
      "top-center"
    );
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await apiClient.post(`tasks`, {
      ...taskData,
      createdAt: undefined,
      updatedAt: undefined,
    });
    SuccessToastMessage(
      `A tarefa '${response.data.title}' foi adicionada ao quadro😎`
    );
    return response.data;
  } catch (error) {
    ErrorToastMessage("Ocorreu um erro ao criar a tarefa", "top-center");
    throw error;
  }
};

export const updateTask = async (id, updateTaskData) => {
  try {
    const response = await apiClient.patch(`tasks/${id}`, updateTaskData);
    return response.data;
  } catch (error) {
    ErrorToastMessage("Ocorreu um erro ao atualizar sua tarefa", "top-center");
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await apiClient.delete(`tasks/${id}`);
    SuccessToastMessage("Tarefa excluída", "top-center");
    return response.data;
  } catch (error) {
    ErrorToastMessage("Não foi possível excluir esta tarefa");
    throw error;
  }
};
