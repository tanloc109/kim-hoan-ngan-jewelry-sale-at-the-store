import React, { useState, useEffect } from "react";
import './Login.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../config/config';
import { Link } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [logoutMessage, setLogoutMessage] = useState('');
    const [forget, setForget] = useState('no');
    const [email, setEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [resetPassword, setResetPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${config.API_ROOT}/api/Auth/login`, {
                username,
                password
            });

            const { token } = response.data;
            const decodedToken = jwtDecode(token);

            const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            localStorage.setItem('token', token);

            redirectToDashboard(roles);
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response.status === 401) {
                setErrorMessage('Tên tài khoản hoặc mật khẩu không đúng.');
            } else {
                setErrorMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        }
    };

    const redirectToDashboard = (roles) => {
        if (roles) {
            switch (roles) {
                case 'manager':
                    window.location.href = '/manager/report';
                    break;
                case 'admin':
                    window.location.href = '/admin/users';
                    break;
                case 'staff':
                    window.location.href = '/staff/trang-chu-nv';
                    break;
                default:
                    window.location.href = '/default-dashboard';
                    break;
            }
        } else {
            console.error('Role not found');
        }
    };

    useEffect(() => {
        const resetPassword = localStorage.getItem('reset-password');
        if (resetPassword) {
            setResetPassword(resetPassword);
            localStorage.removeItem('reset-password');
        }
        setTimeout(() => {
            setResetPassword('');
        }, 3000);
    }, []);

    useEffect(() => {
        const logoutMessage = localStorage.getItem('logoutMessage');
        if (logoutMessage) {
            setLogoutMessage(logoutMessage);
            localStorage.removeItem('logoutMessage');
        }
        setTimeout(() => {
            setLogoutMessage('');
        }, 3000);
    }, []);

    const requestResetPassword = async () => {
        try {
            const response = await axios.post(`${config.API_ROOT}/api/PasswordReset/request-password-reset`, {
                email: email
            });
            if (response.status === 200) {
                setResetMessage('Một email đã được gửi đến địa chỉ email của bạn. Vui lòng kiểm tra email để tiếp tục.');
                setTimeout(() => {
                    setResetMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    return (
        <div className="out-background">
            {logoutMessage && (
                <div className="alert alert-success position-fixed top-0 end-0 m-3">
                    {logoutMessage}
                </div>

            )}
            {resetMessage && (
                <div className="alert alert-success position-fixed top-0 end-0 m-3">
                    {resetMessage}
                </div>
            )}
            {resetPassword && (
                <div className="alert alert-success position-fixed top-0 end-0 m-3">
                    {resetPassword}
                </div>

            )}
            <div className="container my-4 bg">
                <div className="d-flex login-form">
                    <div className="mb-5 d-flex justify-content-center align-items-center">
                        <div className="d-flex flex-column justify-content-center align-items-center gradient-custom-2 mb-4 img-logo">
                            <img src='https://storageimageazure.blob.core.windows.net/paymentcontainer/logo.jpg' alt="logo" />
                        </div>
                    </div>
                    <div className="mb-5 login">
                        <div className="d-flex flex-column ms-5">
                            <div className="text-center abc">
                                <i className="far fa-gem diamond"></i>
                                <h4 className="mt-1 mb-2 pb-1 fw-bold">Phần mềm quản lí bán vàng tại<br /> tiệm vàng Kim Hoàn Ngân</h4>
                            </div>
                            {forget &&
                                <>
                                    <p className="mb-4">Vui lòng đăng nhập bằng tài khoản của bạn.</p>
                                    <input className='mb-20' placeholder='Tên tài khoản' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                                    <input className='mb-20' placeholder='Mật khẩu' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

                                    {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
                                    <div className="mb-2 d-flex justify-content-end">
                                        <Link onClick={() => setForget('')}>Quên mật khẩu</Link>
                                    </div>


                                    <div className="text-center pt-1 mb-5 pb-1">
                                        <button className="mb-4 w-100 btn btn-login" onClick={handleLogin}>Đăng nhập</button>
                                    </div>
                                </>

                            }
                            {forget === '' &&
                                <div className="forget">
                                    <h5 className="mb-2">Để thay đổi mật vui lòng làm theo yêu cầu dưới đây.</h5>
                                    <p className="mb-4">Vui lòng nhập thông tin email của bạn.</p>
                                    <input type="text" className="email-forget" placeholder="Nhập email của bạn vào đây..."
                                        value={email} onChange={(e) => setEmail(e.target.value)}
                                    />

                                    <div className="text-center mb-2">
                                        <button className="w-100 btn btn-success forget-btn" onClick={requestResetPassword}>Tiến hành xác thực email</button>
                                    </div>
                                    <div className="mb-2 d-flex justify-content-end">
                                        <Link onClick={() => setForget('no')}>Nhấn vào đây để quay lại trang login</Link>
                                    </div>
                                </div>

                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
