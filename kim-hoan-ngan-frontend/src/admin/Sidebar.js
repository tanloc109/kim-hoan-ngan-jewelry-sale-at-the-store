import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
function Sidebar() {

  var decodedToken = ""

  var name = "";
  var token = "";
  var role = "";
  try {
    token = localStorage.getItem('token');
    decodedToken = jwtDecode(token);
    name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  } catch (e) {
  }
  return (
    <div>
      <div className="viewport col-2">
        <div className="sidebar col-2">
          <header>
            <div id="sidebar_header_avatar">
              <img
                src="https://storageimageazure.blob.core.windows.net/paymentcontainer/logo.jpg"
                width="75px"
              />
            </div>
            <div>
              <b>{name}</b>
            </div>
            <div id="role">
              <a>{role}</a>
            </div>
            <div id="line"></div>
          </header>
          <ul className="nav">

            <li>
              <Link to="/admin/users">
                <i className="fas fa-user-tie"></i> Người Dùng
              </Link>
            </li>
            <li>
              <Link to="/admin/role">
                <i className="fas fa-user-tag"></i> Vai Trò
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
