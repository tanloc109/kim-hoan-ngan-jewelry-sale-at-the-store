import React from "react";
import "./NavbarAdmin.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
function Navbar() {
  var token = ""
  var decodedToken = ""
  var name = ""
  const navigate = useNavigate();

  try {
    token = localStorage.getItem('token');
    decodedToken = jwtDecode(token);
    name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  } catch (e) {
  }
  const location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('logoutMessage', "Bạn đã đăng xuất tài khoản")
    navigate('/');
  };
  return (
    <div className="col-10">
      <div className="navbar">
        <div className="buttonNav">
          <i className="fas fa-sign-out-alt" onClick={handleLogout}></i>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
