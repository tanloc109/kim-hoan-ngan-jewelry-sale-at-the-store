import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotAuthorized.css';

const NotAuthorized = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/');
    };

    return (
        <div className="not-authorized-container">
            <h1>403 - Không có quyền truy cập</h1>
            <p>Bạn không có quyền truy cập vào trang này.</p>
            <button onClick={handleLoginClick} className="login-button">
                Đăng nhập
            </button>
        </div>
    );
};

export default NotAuthorized;
