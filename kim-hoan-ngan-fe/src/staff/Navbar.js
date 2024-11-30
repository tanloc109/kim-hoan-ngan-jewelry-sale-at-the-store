import React, { useEffect, useState } from "react";
import './Navbar.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Integer from "@zxing/library/esm/core/util/Integer";
import config from "../config/config";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("Trang chủ");
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    useEffect(() => {
        const currentPath = location.pathname;
        const activeNavItem = navItems.find(item => item.path === currentPath);
        if (activeNavItem) {
            setActiveTab(activeNavItem.label);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.setItem('logoutMessage', "Bạn đã đăng xuất tài khoản");
        localStorage.removeItem('tab');
        navigate('/');
    };

    const navItems = [
        { path: '/staff/trang-chu-nv', label: 'Trang chủ', level: [1, 2, 3, 4, 5, 6, 7] },
        { path: '/staff/giao-dich', label: 'Giao dịch', level: [1, 3, 5, 7] },
        { path: '/staff/danh-sach-thanh-toan', label: 'Thu ngân', level: [2, 3, 6, 7] },
        { path: '/staff/danh-sach-bao-hanh', label: 'Bảo hành', level: [4, 5, 6, 7] },
        { path: '/staff/gia-vang', label: 'Bảng tỉ giá vàng', level: [1, 2, 3, 4, 5, 6, 7] }
    ];

    const handleClick = (label) => {
        localStorage.setItem('tab', label);
        setActiveTab(label);
    };

    return (
        <nav className="navbar-staff navbar-expand-lg bg-body-tertiary nav-container-staff">
            <div className="container-fluid d-flex justify-content-between align-items-center bc-primary">
                <Link className="navbar-brand" to="/staff/trang-chu-nv">
                    <img className="logo-staff" src='../logo.jpg' alt="Logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav">
                        {navItems.map((item) => (
                            item.level.includes(decodedToken.level) && (
                                <div key={item.path}
                                    className={`nav-item ${location.pathname === item.path || activeTab === item.label ? 'nav-active' : ''}`} onClick={() => handleClick(item.label)}>
                                    <Link className="nav-link" to={item.path}>{item.label}</Link>
                                </div>
                            )
                        ))}
                    </div>
                </div>
                <div className="nav-user-staff">
                    <img className="avatar" src='../logo.jpg' alt="User Avatar" />
                    <span className="user-name">{decodedToken.fullName}</span>
                    <button className="fas fa-sign-out-alt btn btn-m btn-logout ms-2" onClick={handleLogout}></button>
                </div>
            </div>
        </nav >
    );
}

export default Navbar;
