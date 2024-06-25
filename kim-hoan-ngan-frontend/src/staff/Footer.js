import React from "react";
import './Footer.css'
import { Link } from "react-router-dom";

function Footer() {

    return (
        <div className="container-fluid footer">
            <div className="row">
                <div className="col-4 logo-img-ft">
                    <img className="logo-footer" src="https://storageimageazure.blob.core.windows.net/paymentcontainer/logo-tachnen123.png" />
                    <p className="slogan-khn">CHỮ TÍN TẠO NIỀM TIN</p>
                </div>
                <div className="col-4 info-khn">
                    <h4>VỀ CHÚNG TÔI</h4>
                    <span>Doanh Nghiệp Tư Nhân Tiệm Vàng Kim Hoàn Ngân</span> <br />
                    <span>Địa chỉ: số 51 đường N6, khu phố 6, phường Thới Hòa, thành phố Bến Cát, tỉnh Bình Dương</span><br />
                    <span>Email: info@kimhoanngan.com</span><br />
                    <span>Số điện thoại: 0397 999 999</span><br />
                    <span>Mã số thuế: 2502200399</span>
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