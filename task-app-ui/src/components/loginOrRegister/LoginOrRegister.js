import React from "react";
import useLoginHook from "./LoginOrRegisterHook";

const LoginOrRegister = () => {
  const { email, setEmail, password, setPassword, handleSubmit } =
    useLoginHook();
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        ></input>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        ></input>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginOrRegister;
