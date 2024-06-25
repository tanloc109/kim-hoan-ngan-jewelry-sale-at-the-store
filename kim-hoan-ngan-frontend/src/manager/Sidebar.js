import React, { useEffect, useState } from "react";
import "./Sidebar.css";

import { jwtDecode } from "jwt-decode";
import { Link, useLocation, useNavigate } from "react-router-dom";
function Sidebar() {

  const [activeTab, setActiveTab] = useState("Báo Cáo Cửa Hàng");


  const handleClick = (label) => {
    setActiveTab(label);
    console.log(label);
  };

  const sidebars = []

  var decodedToken = ""

  var name = "";
  var token = "";
  var role = "";

  try {
    token = localStorage.getItem('token');
    decodedToken = jwtDecode(token);
    name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    role = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  } catch (e) {
  }

  return (
    <div>
      <div className="viewport col-2">
        <div className="sidebar col-2">
          <header>
            <div id="sidebar_header_avatar">
              <img src="https://storageimageazure.blob.core.windows.net/paymentcontainer/logo.jpg" width="75px" />
            </div>
            <div>
              <b> {name}</b>
            </div>
            <div id="role">
              <a>{role}</a>
            </div>
            <div id="line"></div>
          </header>
          <ul className="nav">
            <li className={`${activeTab === "Báo Cáo Cửa Hàng" ? "sidebarActive" : ""}`} onClick={() => handleClick("Báo Cáo Cửa Hàng")}>

              <Link to="/manager/report">
                <i className="fas fa-store"></i><p>Báo Cáo Cửa Hàng</p>
              </Link>
            </li>
            <li onClick={() => handleClick("Quản Lý Đơn Hàng")}>
              <Link to="/manager/revenue">
                <i className="fas fa-dollar-sign"></i><p>Quản Lý Đơn Hàng</p>
              </Link>
            </li>
            <li>
              <Link to="/manager/paytype">
                <i className="fas fa-file-invoice-dollar"></i><p>Quản Lý Thanh Toán</p>
              </Link>
            </li>
            <li>
              <Link to="/manager/product">
                <i className="fas fa-flag"></i><p>Quản Lý Sản Phẩm</p>
              </Link>
            </li>
            <li>
              <Link to="/manager/warranty">
                <i className="fas fa-user-shield"></i><p>Quản Lý Phiếu Bảo Hành</p>
              </Link>
            </li>
            <li>
              <Link to="/manager/customer">
                <i className="fas fa-users"></i><p>Quản Lý Khách Hàng</p>
              </Link>
            </li>
            {/* <li>
              <Link to="/manager/updatePriceGold">
                <i className="fas fa-wrench"></i> Cập Nhật Giá Vàng ****
              </Link>
            </li> */}
            <li>
              <Link to="/manager/category">
                <i className="fas fa-mortar-pestle"></i><p>Quản Lý Danh Mục</p>
              </Link>
            </li>
            <li>
              <Link to="/manager/stone">
                <i className="far fa-gem"></i><p>Quản Lý Đá</p>
              </Link>
            </li>
            <li>
              <Link to="/manager/gold">
                <i className="fas fa-coins"></i><p>Quản Lý Loại Vàng</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
