import { useState } from "react";
import { useAuth } from "../../scripts/services/authServices/authContext";

function useLoginHook() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
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
