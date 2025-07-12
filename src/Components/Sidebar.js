import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const [isOpen, setIsOpen] = useState(true); // for toggling on small screens

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (!user) navigate("/login");
  }, [navigate, user]);

  if (!user) return null;

  return (
    <div className="d-flex">
      {/* Toggle Button for Small Screens */}
      <button
        className="btn btn-outline-light d-md-none m-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Sidebar */}
      <div
        className={`bg-dark text-white p-3 d-flex flex-column ${
          isOpen ? "d-block" : "d-none d-md-block"
        }`}
        style={{ minHeight: "100vh", width: "250px" }}
      >
        <div className="d-flex align-items-center mb-3 text-white text-decoration-none">
          <i className="bi bi-box fs-4 me-2"></i>
          <span className="fs-5 fw-semibold">Admin Panel</span>
        </div>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <NavLink to="/" className="nav-link text-white" end>
              <i className="bi bi-house-door me-2"></i>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/productlist" className="nav-link text-white">
              <i className="bi bi-bag-check me-2"></i>
              Product List
            </NavLink>
          </li>
          <li>
            <NavLink to="/orderlist" className="nav-link text-white">
              <i className="bi bi-bar-chart-line me-2"></i>
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile" className="nav-link text-white">
              <i className="bi bi-person-circle me-2"></i>
              Profile
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="btn btn-link nav-link text-white text-start"
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
