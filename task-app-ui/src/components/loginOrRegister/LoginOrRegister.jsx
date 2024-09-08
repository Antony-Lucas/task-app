import React, { useEffect, useState } from "react";
import useLoginSignupHook from "./LoginOrRegisterHook";
import { useNavigate } from "react-router-dom";
import mainCharLogin from "../../assets/icons/loginOrRegister/3d_char_login.svg";
import logoMyAsks from "../../assets/icons/logo.svg";
import ReactLoading from "react-loading";
import "react-toastify/dist/ReactToastify.css";
import "./LoginOrRegister.css";
import "././../../styles/components/inputs/FormInputs.css";
import "././../../styles/components/buttons/PrimaryButtons.css";
import "././../../styles/components/buttons/LinkButtons.css";
import { useAuth } from "../../scripts/services/authcontext/authContext";

const LoginOrRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const { auth } = useAuth();
  const {
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
  } = useLoginSignupHook(setLoading, setIsLogging);

  useEffect(() => {
    if (auth) {
      const timeOut = setTimeout(() => {
        setLoading(true);
      }, 1000);
      return clearTimeout(timeOut);
    }
  }, [auth, navigate]);

  const HandleUSerNameChange = (e) => {
    const { value } = e.target;
    if (value === "" || validateUsername(value)) {
      setUserName(value);
    }
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div className="main-container">
      <div className="image-container">
        <img src={mainCharLogin} alt="3D character" />
      </div>
      <div className="login-signup-container">
        <div>
          <img src={logoMyAsks} alt="My tasks" />
          <h3>My tasks</h3>
        </div>
        <p>Escreva, planeje e organize do seu jeito</p>
        {!isLogging && !isSignup && (
          <form className="main-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              maxLength={255}
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="me@email.com"
              required
            ></input>
            <label>Senha</label>
            <input
              maxLength={255}
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            ></input>
            <button className="button-primary" type="submit" disabled={loading}>
              {loading ? (
                <ReactLoading
                  type="spin"
                  color="#ffffff"
                  height={20}
                  width={20}
                />
              ) : (
                "Login"
              )}
            </button>
          </form>
        )}
        {!isLogging && isSignup && (
          <form className="main-form" onSubmit={handleSignUp}>
            <label>Nome completo</label>
            <input
              maxLength={255}
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu Nome"
              required
            />
            <label>Nome de usuário</label>
            <input
              maxLength={120}
              className="form-input"
              type="text"
              placeholder="seu_nome"
              value={username}
              onChange={HandleUSerNameChange}
              required
            />
            <small className="input-hint">
              Pode conter apenas letras minúsculas, números, _ e .
            </small>
            <br />
            <label>Email</label>
            <input
              maxLength={120}
              className="form-input"
              type="email"
              placeholder="me@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Senha</label>
            <input
              maxLength={255}
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button className="button-primary" type="submit" disabled={loading}>
              {loading ? (
                <ReactLoading
                  type="spin"
                  color="#157bff"
                  height={20}
                  width={20}
                />
              ) : (
                "Criar Conta"
              )}
            </button>
          </form>
        )}
        {isLogging && (
          <div className="isLogging">
            <ReactLoading type="spin" color="#157bff" height={20} width={20} />
            <p>Entrando...</p>
          </div>
        )}
        {!isLogging && (
          <div className="container-divider">
            <hr />
          </div>
        )}
        <div className="signup-link">
          {isSignup
            ? !isLogging && (
                <>
                  <small>Já tem uma conta?</small>
                  <button className="button-link" onClick={toggleForm}>
                    Faça login
                  </button>
                </>
              )
            : !isLogging && (
                <>
                  <small>Novo por aqui?</small>
                  <button className="button-link" onClick={toggleForm}>
                    Crie uma conta
                  </button>
                </>
              )}
        </div>
      </div>
    </div>
  );
};

export default LoginOrRegister;
