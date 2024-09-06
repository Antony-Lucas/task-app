import { useCallback, useEffect, useState } from "react";
import { getUserById, updateUser } from "../services/userServices/UserServices";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authServices/authContext";

const useUser = () => {
  const { auth, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    createdAt: "",
    updatedAt: "",
  });

  const onOpenModal = () => {
    setOpen(true);
    fetchUserData();
  };

  const navigate = useNavigate();
  const onCloseModal = () => setOpen(false);

  const fetchUserData = useCallback(async () => {
    if (!auth || !auth.id) {
      setLoading(false);
      return;
    }

    try {
      const data = await getUserById(auth.id);
      setUserData({ ...data, password: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  // useEffect para buscar os dados quando o auth estiver disponível
  useEffect(() => {
    if (auth?.id) {
      fetchUserData();
    }
  }, [auth, fetchUserData]);

  const updateUserData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let dataToUpdate = {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
      };
      const updateData = await updateUser(auth.id, dataToUpdate);
      setUserData({ ...updateData, password: "" });
      getUserById(auth.id);
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return {
    userData,
    setUserData,
    loading,
    open,
    onOpenModal,
    onCloseModal,
    handleLogout,
    fetchUserData,
    updateUserData,
  };
};

export default useUser;
