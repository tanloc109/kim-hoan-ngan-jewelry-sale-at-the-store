import "./ResetPassword.css";
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import config from "../config/config";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {

    const nevigate = useNavigate();

    const query = useQuery();
    const token = query.get('token');
    const [newPassword, setNewPassword] = useState('')
    const [confirm, setConfirm] = useState('')

    const resetRequest = async () => {
        axios.post(`${config.API_ROOT}/api/PasswordReset/reset-password`,
            {
                token: token,
                newPassword: newPassword,
                confirmPassword: confirm
            }
        )
            .then(response => {
                if (response.status === 200) {
                    localStorage.setItem("reset-password", "Bạn đã thay đổi mật khẩu thành công. Vui lòng đăng nhập tại đây")
                    nevigate("/")
                }
            })
            .catch(error => {
                console.error('There was an error when reset password!', error);
            });
    }

    return (
        <div className="reset-page">
            <div className="reset-container">
                <p>Vui lòng nhập mật khẩu mới: </p> <input type="password" className="" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <br />
                <p>Vui lòng xác nhận lại mật khẩu: </p> <input type="password" className="" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                <br />
                <button className="reset-button" onClick={resetRequest}>Đổi mật khẩu</button>
            </div>
        </div>
    )
}