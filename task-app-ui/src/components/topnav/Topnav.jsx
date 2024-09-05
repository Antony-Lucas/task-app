import React, { useState } from "react";
import { useAuth } from "../../scripts/services/authServices/authContext";
import { HiOutlineSearch } from "react-icons/hi";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineLogout } from "react-icons/hi";
import { HiMenu } from "react-icons/hi";
import { Modal } from "react-responsive-modal";
import { Navigate } from "react-router-dom";
import ReactLoading from "react-loading";
import "./Topnav.css";
import "react-responsive-modal/styles.css";
import "././../../styles/components/inputs/FormInputs.css";
import "././../../styles/components/buttons/MenuButtons.css";
import "././../../styles/components/modal/Modal.css";

const Topnav = () => {
  const { auth, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const handleLogout = async () => {
    await logout();
    Navigate("/login");
  };

  return (
    <div className="container-top">
      <button className="hamburguer-menu">
        <HiMenu className="icon-style-hamburguer" />
      </button>
      <div className="search-block">
        <HiOutlineSearch className="icon-search" />
        <input className="form-input" type="text" placeholder="Buscar" />
      </div>
      <Menu>
        <MenuButton className="user-initials">
          <span>{auth ? auth.name : "Carregando..."}</span>
          <p>AL</p>
        </MenuButton>
        <MenuItems transition anchor="bottom end" className="menu-items">
          <MenuItem>
            <button className="menu-button" onClick={onOpenModal}>
              <HiOutlineUser className="icon-style-menu " />
              <p>Meu perfil</p>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="menu-button" onClick={handleLogout}>
              <HiOutlineLogout className="icon-style-menu " />
              <p>Sair</p>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
      <Modal
        open={open}
        onClose={onCloseModal}
        classNames={{ overlay: "custom-overlay", modal: "custom-modal" }}
        center
      >
        <h4>Meus dados</h4>
        <form className="main-form">
          <label>Nome completo</label>
          <input
            className="form-input"
            type="text"
            placeholder="Seu Nome"
            required
          />
          <label>Nome de usuário</label>
          <input
            className="form-input"
            type="text"
            placeholder="seu_nome"
            required
          />
          <small className="input-hint">
            Pode conter apenas letras minúsculas, números, _ e .
          </small>
          <br />
          <label>Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="me@email.com"
            required
          />
          <label>Senha</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <button className="button-primary" type="submit" disabled={loading}>
            {loading ? (
              <ReactLoading
                type="spin"
                color="#157bff"
                height={30}
                width={30}
              />
            ) : (
              "Atualizar meus dados"
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Topnav;
