import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../authServices/authContext";
import { getTasks } from "../tasksServices/TasksServices";

const FilterContext = createContext();

export const useFilterContext = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const { auth } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [filteredTaskList, setFilteredTaskList] = useState([]);

  const getAllTasks = useCallback(async () => {
    try {
      const tasksData = await getTasks();
      const userTasks = tasksData.filter((task) => task.userId === auth.id);
      setTaskList(userTasks);
      setFilteredTaskList(userTasks);
    } catch (error) {
      console.log(error);
    }
  }, [auth.id]);

  useEffect(() => {
    getAllTasks();
  }, [auth.id, getAllTasks]);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <FilterContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        filteredTaskList,
        taskList,
        handleSearchChange,
        setTaskList,
        setFilteredTaskList,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
