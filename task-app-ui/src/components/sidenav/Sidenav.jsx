import React, { useState } from "react";
import { Link } from "react-router-dom";
import Home from "../home/Home";
import logoMyAsks from "../../assets/icons/logo-min.svg";
import { HiOutlineHome } from "react-icons/hi2";
import { HiChevronLeft } from "react-icons/hi";
import "./Sidenav.css";

const Sidenav = () => {
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Home");

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div className="container-side">
      <div className={`sidebar ${open ? "open" : "closed"}`}>
        <button
          className={`control ${!open && "rotate"}`}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <HiChevronLeft />
        </button>
        <div className="logo-section">
          <img src={logoMyAsks} alt="My tasks" className={`logo`} />
          <h1 className={`title ${!open && "hidden-title"}`}>My tasks</h1>
        </div>
        <ul className="menu">
          <li className="menu-container">
            <Link
              to={Home}
              className={`menu-item ${
                activeMenu === "Home" ? "menu-active" : ""
              }`}
              onClick={() => handleMenuClick("Home")}
            >
              <HiOutlineHome className="icon-style" />
              <span className={`${!open && "hidden"} `}>Home</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidenav;
