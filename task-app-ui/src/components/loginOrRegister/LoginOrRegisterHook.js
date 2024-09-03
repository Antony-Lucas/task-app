import { useState } from "react";
import { useAuth } from "../../scripts/services/authServices/authContext";
import { useNavigate } from "react-router-dom";

function useLoginHook() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
  };
}

export default useLoginHook;
