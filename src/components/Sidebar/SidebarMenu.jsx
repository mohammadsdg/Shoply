import React from "react";
import "./SidebarStyles.css";

const SidebarMenu = ({ children }) => {
  return (
    <div className="sidebar-menu">
      <div className="sidebar-logo">
        <img src="/images/shoply.png" alt="Logo" className="logo" />
      </div>
      <nav className="sidebar-nav">{children}</nav>
    </div>
  );
};

export default SidebarMenu;
