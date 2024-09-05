import { useState } from "react";
import { useAuth } from "../../scripts/services/authServices/authContext";
import { useNavigate } from "react-router-dom";

function useLoginSignupHook(setLoading, setIsLogging) {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setIsLogging(true);
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(name, username, email, password);
      setIsLogging(true);
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const validateUsername = (value) => {
    const regex = /^[a-z0-9._]+$/;
    return regex.test(value);
  };

  return {
    name,
    setName,
    username,
    setUserName,
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    handleSignUp,
    validateUsername,
  };
}

export default useLoginSignupHook;
