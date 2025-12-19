import React from "react";
import "./SidebarStyles.css";
import { Link } from "react-router-dom";

const SidebarItem = ({ icon, label, href }) => {
  return (
    <Link to={href} className="sidebar-item">
      {icon}
      <span className="sidebar-label">{label}</span>
    </Link>
  );
};

export default SidebarItem;
