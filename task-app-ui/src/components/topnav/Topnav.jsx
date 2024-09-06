import React from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineLogout } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMenu } from "react-icons/hi";
import { Modal } from "react-responsive-modal";
import ReactLoading from "react-loading";
import "./Topnav.css";
import "react-responsive-modal/styles.css";
import "././../../styles/components/inputs/FormInputs.css";
import "././../../styles/components/buttons/MenuButtons.css";
import "././../../styles/components/modal/Modal.css";
import useUser from "../../scripts/hooks/useUser";

const Topnav = () => {
  const {
    userData,
    setUserData,
    loading,
    open,
    onOpenModal,
    onCloseModal,
    handleLogout,
    updateUserData,
  } = useUser();

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
          <span>{userData.name ? userData.name : "Carregando..."}</span>
          <span>
            {userData.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")}
          </span>
        </MenuButton>
        <MenuItems transition anchor="bottom end" className="menu-items">
          <MenuItem>
            <button className="menu-button" onClick={onOpenModal}>
              <HiOutlineUser className="icon-style-menu " />
              <span>Meu perfil</span>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="menu-button" onClick={handleLogout}>
              <HiOutlineLogout className="icon-style-menu " />
              <span>Sair</span>
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
        <div className="user-details-modal">
          <div>
            <HiOutlineUser className="icon-style-menu" />
            <h4>{userData.name ? userData.name : "user"}</h4>
          </div>
          <button>
            <HiOutlineTrash className="icon-delete-profile" />
          </button>
        </div>
        <form className="main-form" onSubmit={updateUserData}>
          <label>Nome completo</label>
          <input
            className="form-input"
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            placeholder="Seu Nome"
            required
          />
          <label>Nome de usuário</label>
          <input
            className="form-input"
            type="text"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
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
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            placeholder="me@email.com"
            required
          />
          <label>Senha</label>
          <input
            className="form-input"
            type="password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button className="button-primary" type="submit" disabled={loading}>
            {loading ? (
              <ReactLoading
                type="spin"
                color="#ffffff"
                height={20}
                width={20}
              />
            ) : (
              "Atualizar"
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Topnav;
