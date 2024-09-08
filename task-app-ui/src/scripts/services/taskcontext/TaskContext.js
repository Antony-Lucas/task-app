import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  createTask,
  deleteTask,
  getTasks,
  getTasksById,
  updateTask,
} from "../tasksServices/TasksServices";
import { useAuth } from "../authcontext/authContext";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { auth } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskList, setTaskList] = useState([]);
  const [filteredTaskList, setFilteredTaskList] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "PENDING",
    priority: "MEDIUM",
    userId: auth.id,
  });
  const [taskCounts, setTaskCounts] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    total: 0,
  });

  const openOpenTaskModal = (modalChange, taskId = null) => {
    setOpenModal(modalChange);
    setSelectedTaskId(taskId);
  };

  const onCloseTaskModal = () => setOpenModal(null);

  // Função para contar tarefas por status, prioridade, concluídas e total
  const countTasksByStatus = (tasks) => {
    const pending = tasks.filter((task) => task.status === "PENDING").length;
    const inProgress = tasks.filter(
      (task) => task.status === "IN_PROGRESS"
    ).length;
    const completed = tasks.filter(
      (task) => task.status === "COMPLETED"
    ).length;
    const total = tasks.length;

    setTaskCounts({
      pending,
      inProgress,
      completed,
      total,
    });
  };

  // Função para buscar todas as tarefas do usuário logado
  const getAllTasks = useCallback(async () => {
    try {
      const tasksData = await getTasks();
      const userTasks = tasksData
        .filter((task) => task.userId === auth.id)
        .sort((a, b) => b.id - a.id);
      setTaskList(userTasks);
      setFilteredTaskList(userTasks);
      countTasksByStatus(userTasks);
    } catch (error) {
      console.log(error);
    }
  }, [auth.id]);

  // Função para criar nova tarefa
  const createTaskData = async (e) => {
    e.preventDefault();
    try {
      const newTask = await createTask(taskData);
      setTaskList((prevTaskList) => [newTask, ...prevTaskList]);
      countTasksByStatus([newTask, ...taskList]);
      onCloseTaskModal();
      setTaskData({
        title: "",
        description: "",
        status: "PENDING",
        priority: "MEDIUM",
        userId: auth.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateTaskData = async (e) => {
    e.preventDefault();
    try {
      const dataRequest = {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        userId: auth.id,
      };
      const updatedTask = await updateTask(selectedTaskId, dataRequest);
      setTaskList((prevTaskList) =>
        prevTaskList.map((task) =>
          task.id === selectedTaskId ? { ...task, ...updatedTask } : task
        )
      );
      countTasksByStatus(taskList);
      onCloseTaskModal();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTaskData = async () => {
    try {
      await deleteTask(selectedTaskId);
      setTaskList((prevTaskList) => {
        const updatedTaskList = prevTaskList.filter(
          (task) => task.id !== selectedTaskId
        );

        countTasksByStatus(updatedTaskList);

        return updatedTaskList;
      });
      onCloseTaskModal();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);

  //Funcionalidade do campo de busca, a cada termo digitado, as tarefas serão filtradas e exibidas
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredTaskList(taskList);
    } else {
      const filteredTasks = taskList.filter(
        (tasks) =>
          tasks.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tasks.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTaskList(filteredTasks);
    }
  }, [searchTerm, taskList]);

  //Funcção para ao abrir o modal de edição, carregar nos campos todos os dados da tarefa
  useEffect(() => {
    if (selectedTaskId && openModal === "edit") {
      const fetchTaskDetails = async () => {
        try {
          const taskDetails = await getTasksById(selectedTaskId);
          setTaskData({
            title: taskDetails.title,
            description: taskDetails.description,
            status: taskDetails.status,
            priority: taskDetails.priority,
            createdAt: taskDetails.createdAt,
            updatedAt: taskDetails.updatedAt,
            userId: taskDetails.userId,
          });
        } catch (error) {
          console.log(error);
        }
      };
      fetchTaskDetails();
    }
  }, [selectedTaskId, openModal]);

  // Função para alterar o status da tarefa
  const handleStatusChange = (status) => {
    setTaskData((prevData) => ({
      ...prevData,
      status,
    }));
  };

  // Função para alterar a prioridade da tarefa
  const handlePriorityChange = (priority) => {
    setTaskData((prevData) => ({
      ...prevData,
      priority,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Função para converter os status da tarefa
  const formatStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Pendente";
      case "IN_PROGRESS":
        return "Fazendo";
      case "COMPLETED":
        return "Concluída";
      default:
        return status;
    }
  };

  const formatPriority = (priority) => {
    switch (priority) {
      case "LOW":
        return "Baixa";
      case "MEDIUM":
        return "Média";
      case "HIGH":
        return "Alta";
      default:
        return priority;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        filteredTaskList,
        searchTerm,
        taskData,
        taskCounts,
        taskList,
        formatStatus,
        formatPriority,
        setTaskData,
        openModal,
        openOpenTaskModal,
        onCloseTaskModal,
        handleStatusChange,
        handlePriorityChange,
        handleSearchChange,
        createTaskData,
        updateTaskData,
        deleteTaskData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
