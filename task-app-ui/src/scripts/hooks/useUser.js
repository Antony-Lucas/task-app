import { useCallback, useEffect, useState } from "react";
import {
  deleteUser,
  getUserById,
  updateUser,
} from "../services/userServices/UserServices";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authcontext/authContext";

const useUser = () => {
  const { auth, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openExclude, setOpenExclude] = useState(false);
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

  const onOpenModalExclude = () => {
    setOpenExclude(true);
    fetchUserData();
  };
  const navigate = useNavigate();
  const onCloseModal = () => setOpen(false);
  const onCloseExcludeModal = () => setOpenExclude(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
      onCloseModal();
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const deleteUserData = async (e) => {
    e.preventDefault();
    try {
      deleteUser(auth.id, handleLogout);
    } catch {
      console.log(e);
    }
  };

  useEffect(() => {
    if (auth?.id) {
      fetchUserData();
    }
  }, [auth, fetchUserData]);

  return {
    userData,
    setUserData,
    loading,
    open,
    onOpenModal,
    openExclude,
    onOpenModalExclude,
    onCloseModal,
    onCloseExcludeModal,
    handleLogout,
    fetchUserData,
    updateUserData,
    deleteUserData,
  };
};

export default useUser;
