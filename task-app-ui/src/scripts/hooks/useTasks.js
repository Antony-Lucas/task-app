import { useEffect, useState } from "react";
import { useAuth } from "../services/authServices/authContext";
import { createTask, getTasks } from "../services/tasksServices/TasksServices";

const useTasks = () => {
  const { auth } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [taskList, setTaskList] = useState([]);
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

  const openOpenTaskModal = () => {
    setOpenModal(true);
  };

  const onCloseTaskModal = () => setOpenModal(false);

  const handleStatusChange = (status) => {
    setTaskData((prevData) => ({
      ...prevData,
      status,
    }));
  };

  const defaultTaskData = {
    title: "",
    description: "",
    status: "PENDING",
    priority: "MEDIUM",
    userId: auth.id,
  };

  const handlePriorityChange = (priority) => {
    setTaskData((prevData) => ({
      ...prevData,
      priority,
    }));
  };

  const getAllTasks = async () => {
    try {
      const tasksData = await getTasks();
      setTaskList(tasksData);
      countTasksByStatus(tasksData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTasks();
  });

  const createTaskData = async (e) => {
    e.preventDefault();
    try {
      console.log(taskData);
      await createTask(taskData);
      onCloseTaskModal();
      setTaskData(defaultTaskData);
      getAllTasks();
    } catch (error) {
      console.log(error);
    }
  };

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

  return {
    taskList,
    taskData,
    taskCounts,
    setTaskData,
    openModal,
    openOpenTaskModal,
    onCloseTaskModal,
    handleStatusChange,
    handlePriorityChange,
    createTaskData,
  };
};

export default useTasks;
