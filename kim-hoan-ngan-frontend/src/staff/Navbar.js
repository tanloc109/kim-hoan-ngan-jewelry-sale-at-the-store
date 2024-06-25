import React, { useEffect, useState } from "react";
import './Navbar.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState('');
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const userName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
                setName(userName);
            }
        } catch (e) {
            console.error("Error decoding token:", e);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.setItem('logoutMessage', "Bạn đã đăng xuất tài khoản");
        localStorage.removeItem('tab');
        navigate('/');
    };

    const navItems = [
        { path: '/staff/trang-chu-nv', label: 'Trang chủ' },
        { path: '/staff/giao-dich', label: 'Giao dịch' },
        { path: '/staff/danh-sach-thanh-toan', label: 'Thu ngân' },
        { path: '/staff/danh-sach-bao-hanh', label: 'Bảo hành' },
        { path: '/staff/gia-vang', label: 'Bảng tỉ giá vàng' }
    ];

    const handleClick = (label) => {
        localStorage.setItem('tab', label);
        setActiveTab(label);
    };

    return (
        <nav className="navbar-staff navbar-expand-lg bg-body-tertiary nav-container-staff">
            <div className="container-fluid d-flex justify-content-between align-items-center bc-primary">
                <Link className="navbar-brand" to="/staff/trang-chu-nv">
                    <img className="logo-staff" src="https://storageimageazure.blob.core.windows.net/paymentcontainer/logo.jpg" alt="Logo" />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav">
                        {navItems.map((item) => (
                            <div key={item.path}
                                className={`nav-item ${location.pathname === item.path || activeTab === item.label ? 'nav-active' : ''}`} onClick={() => handleClick(item.label)}>
                                <Link className="nav-link" to={item.path}>{item.label}</Link>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="nav-user-staff">
                    <img className="avatar" src="https://storageimageazure.blob.core.windows.net/paymentcontainer/logo.jpg" alt="User Avatar" />
                    <span className="user-name">{name}</span>
                    <button className="fas fa-sign-out-alt btn btn-m btn-logout ms-2" onClick={handleLogout}></button>
                </div>
            </div>
        </nav >
    );
}

export default Navbar;
