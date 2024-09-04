import React, { useEffect, useState } from "react";
import useLoginHook from "./LoginOrRegisterHook";
import { useAuth } from "../../scripts/services/authServices/authContext";
import { useNavigate } from "react-router-dom";
import mainCharLogin from "../../assets/icons/loginOrRegister/3d_char_login.svg";
import logoMyAsks from "../../assets/icons/logo.svg";
import ReactLoading from "react-loading";
import "react-toastify/dist/ReactToastify.css";
import "./LoginOrRegister.css";
import "././../../styles/components/inputs/FormInputs.css";
import "././../../styles/components/buttons/PrimaryButtons.css";
import "././../../styles/components/buttons/LinkButtons.css";

const LoginOrRegister = () => {
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const { email, setEmail, password, setPassword, handleSubmit } =
    useLoginHook(setLoading);

  useEffect(() => {
    console.log(auth);
    if (auth) {
      const timeOut = setTimeout(() => {
        setLoading(true);
      }, 1000);
      navigate("/home");
      return clearTimeout(timeOut);
    }
  }, [auth, navigate]);

  return (
    <div className="main-container">
      <div className="image-container">
        <img src={mainCharLogin} alt="3D character" />
      </div>
      <div className="login-container">
        <div>
          <img src={logoMyAsks} alt="My tasks" />
          <h3>My tasks</h3>
        </div>
        <p>Escreva, planeje e organize do seu jeito</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            className="form-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="me@email.com"
            required
          ></input>
          <label>Senha</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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
        <div className="container-divider">
          <hr />
        </div>
        <div className="signup-link">
          <small>Novo por aqui?</small>
          <button className="button-link">Crie uma conta</button>
        </div>
      </div>
    </div>
  );
};

export default LoginOrRegister;
