import './ResetPassword.css';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config/config';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
    const navigate = useNavigate();
    const query = useQuery();
    const token = query.get('token');
    const [error, setError] = useState('');
    const [info, setInfo] = useState({});
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const response = await axios.get(`${config.API_ROOT}/api/StoreInfo`);
                setInfo(response.data);
            } catch (error) {
                console.error('Error fetching store info:', error);
            }
        };

        fetchInfo();
    }, []);

    const formik = useFormik({
        initialValues: {
            newPassword: '',
            confirm: '',
        },
        validationSchema: Yup.object({
            newPassword: Yup.string()
                .min(8, 'Mật khẩu phải dài ít nhất 8 ký tự')
                .matches(/[A-Z]/, 'Mật khẩu phải có ít nhất một chữ cái in hoa')
                .matches(/\d/, 'Mật khẩu phải có ít nhất một chữ số')
                .required('Mật khẩu là bắt buộc'),
            confirm: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp')
                .required('Mật khẩu xác nhận là bắt buộc'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post(`${config.API_ROOT}/auth/forget-password`, {
                    token: token,
                    newPassword: values.newPassword,
                    confirm: values.confirm,
                });

                if (response.status === 200) {
                    formik.resetForm();
                    localStorage.setItem("reset-password", "Bạn đã thay đổi mật khẩu thành công. Vui lòng đăng nhập tại đây");
                    navigate("/");
                }
            } catch (error) {
                console.error('There was an error when resetting the password!', error);
                const errorMessage = error.response?.data || 'Đã có lỗi xảy ra';
                setError(errorMessage);
                setTimeout(() => setError(''), 5000);
            }
        },
    });

    return (
        <div className="out-background">
            {error && (
                <div className="alert alert-danger position-fixed top-8 end-0 m-3 ">
                    {error}
                </div>
            )}
            <div className="container my-4 bg">
                <div className="d-flex login-form">
                    <div className="mb-5 d-flex justify-content-center align-items-center">
                        <div className="d-flex flex-column justify-content-center align-items-center gradient-custom-2 mb-4 img-logo logo-reset">
                            <img src={info.avatar} alt="logo" />
                        </div>
                    </div>
                    <div className="mb-5 login">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="reset-container">
                                <div className="input-container position-relative">
                                    <h6>Vui lòng nhập mật khẩu mới:</h6>
                                    <div className="password-wrapper">
                                        <input
                                            className="mt-2"
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={formik.values.newPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        <button
                                            type="button"
                                            className="btn-eye"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {formik.touched.newPassword && formik.errors.newPassword ? (
                                        <span className="error-reset">{formik.errors.newPassword}</span>
                                    ) : null}
                                    <br />
                                    <h6 className="mt-2">Vui lòng xác nhận lại mật khẩu:</h6>
                                    <div className="password-wrapper">
                                        <input
                                            className="mt-1"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirm"
                                            value={formik.values.confirm}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        <button
                                            type="button"
                                            className="btn-eye"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {formik.touched.confirm && formik.errors.confirm ? (
                                        <span className="error-reset error-confirm">{formik.errors.confirm}</span>
                                    ) : null}
                                </div>
                                <button className="reset-button" type="submit">Đổi mật khẩu</button>
                                <div className="mt-2 d-flex justify-content-end">
                                    <Link to="/">Nhấn vào đây để quay lại trang login</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
