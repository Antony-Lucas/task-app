import React from "react";
import { Link } from "react-router-dom";
import Home from "../home/Home";
import { HiOutlineSearch } from "react-icons/hi";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineLogout } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import { HiOutlineHome } from "react-icons/hi2";
import { HiExclamation } from "react-icons/hi";
import { HiMenu } from "react-icons/hi";
import { Modal } from "react-responsive-modal";
import ReactLoading from "react-loading";
import useUser from "../../scripts/hooks/useUser";
import { useTasks } from "../../scripts/services/taskcontext/TaskContext";
import "./Topnav.css";
import "react-responsive-modal/styles.css";
import "././../../styles/icons/icons.css";
import "././../../styles/components/inputs/FormInputs.css";
import "././../../styles/components/buttons/MenuButtons.css";
import "././../../styles/components/buttons/DeleteButtons.css";
import "././../../styles/components/modal/Modal.css";
import "././../../styles/components/modalmenu/ModalMenu.css";

const Topnav = () => {
  const { searchTerm, handleSearchChange } = useTasks();
  const {
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
    updateUserData,
    deleteUserData,
  } = useUser();

  return (
    <div className="container-top">
      <Menu>
        <MenuButton className="hamburguer-menu">
          <HiMenu className="icon-style-hamburguer" />
        </MenuButton>
        <MenuItems transition anchor="bottom end" className="menu-items">
          <MenuItem>
            <Link to={Home} className={`menu-item menu-active`}>
              <HiOutlineHome className="icon-style" />
              <span>Home</span>
            </Link>
          </MenuItem>
        </MenuItems>
      </Menu>
      <div className="search-block">
        <HiOutlineSearch className="icon-search" />
        <input
          className="form-input"
          type="text"
          placeholder="Buscar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <Menu>
        <MenuButton className="user-initials">
          <div>
            <span>{userData.name ? userData.name : "Carregando..."}</span>
            <small>@{userData.username}</small>
          </div>
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
        classNames={{
          overlay: "custom-overlay",
          modal: "custom-modal",
        }}
        center
      >
        <div className="user-details-modal">
          <div>
            <HiOutlineUser className="icon-style-menu" />
            <h4>{userData.name ? userData.name : "user"}</h4>
          </div>
          <button onClick={onOpenModalExclude}>
            <HiOutlineTrash className="icon-delete" />
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
          <div className="user-date-info">
            <small>
              <strong>Criado em:</strong> {userData.createdAt}
            </small>
            <small>
              <strong>Atualizado em:</strong> {userData.updatedAt}
            </small>
          </div>
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
      <Modal
        open={openExclude}
        onClose={onCloseExcludeModal}
        classNames={{ overlay: "custom-overlay", modal: "custom-modal" }}
        center
      >
        <div className="exclude-details-modal">
          <div>
            <HiExclamation className="icon-warn" />
            <h4>Deseja mesmo excluir sua conta?</h4>
          </div>
          <span>Esta ação não pode ser desfeita</span>
          <div className="exclude-buttons">
            <button className="menu-button" onClick={onCloseExcludeModal}>
              <span>Cancelar</span>
            </button>
            <button className="button-delete" onClick={deleteUserData}>
              <span>Excluir minha conta</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Topnav;
