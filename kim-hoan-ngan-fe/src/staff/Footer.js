import React, { useState, useEffect } from "react";
import './Footer.css'
import { Link } from "react-router-dom";
import config from "../config/config";
import { jwtDecode } from 'jwt-decode';

function Footer() {

    const [info, setInfo] = useState({});
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    return (
        <div className="container-fluid footer">
            <div className="row">
                <div className="col-4 logo-img-ft">
                    <img className="logo-footer" src='../logo-tachnen.png' />
                    <p className="slogan-khn">CHỮ TÍN TẠO NIỀM TIN</p>
                </div>
                <div className="col-4 info-khn">
                    <h4>VỀ CHÚNG TÔI</h4>
                    <span>DOANH NGHIỆP TƯ NHÂN TIỆM VÀNG KIM HOÀN NGÂN</span> <br />
                    <span>Địa chỉ: Số 51, đường N6, KCN Mỹ Phước 1, Phường Thới Hoà, thành phố Bến Cát, tỉnh Bình Dương</span><br />
                    <span>Email: info@kimhoanngan.com</span><br />
                    <span>Số điện thoại: 0939686868</span><br />
                    <span>Mã số thuế: 250299999999</span>
                </div>
                <div className="col-4 info-khn">
                    <h4>CHÍNH SÁCH KHÁCH HÀNG    </h4>
                    <Link to="/staff/chinh-sach-thanh-toan">Chính sách thanh toán</Link><br />
                    <Link to="/staff/chinh-sach-bao-hanh">Chính sách bảo hành</Link> <br />
                    <Link to="/staff/chinh-sach-bao-mat">Chính sách bảo mật</Link><br />
                    <Link to="/staff/chinh-sach-ve-van-de-phap-luat">Chính sách về vấn đề pháp lý</Link><br />
                </div>
            </div>
            <div className="text-center copyright">
                <i className="far fa-copyright"></i>
                DOANH NGHIỆP TƯ NHÂN TIỆM VÀNG KIM HOÀN NGÂN
            </div>
        </div>
    );

}

export default Footer