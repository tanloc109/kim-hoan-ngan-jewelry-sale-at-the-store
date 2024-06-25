import React, { useEffect, useState } from "react";
import axios from 'axios';
import './CashierDetail.css';
import { Link, useParams, useNavigate } from "react-router-dom";
import numeral from "numeral";
import config from "../config/config";

export default function CashierDetail() {
    const { orderId } = useParams();
    const [orderDetails, setorderDetails] = useState(null);
    const [order, setOrder] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [numOfProducts, setNumOfProducts] = useState(0);

    useEffect(() => {
        axios.get(`${config.API_ROOT}/api/Orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setOrder(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the order!', error);
                alert('There was an error fetching the order details. Please try again.');
            });
    }, [orderId, token]);

    useEffect(() => {
        axios.get(`${config.API_ROOT}/api/Orders/get-number-of-order-quantity/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setNumOfProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching num of products!', error);
            });

    }, []);

    useEffect(() => {
        axios.get(`${config.API_ROOT}/api/Orders/GetOrderDetails/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
                setorderDetails(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the order details!', error);
            });
    }, []);


    const [formData, setFormData] = useState({
        orderId: orderId,
        paymentType: '',
        cash: '',
        bankTransfer: '',
        transactionId: '',
        image: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('orderId', formData.orderId);
        data.append('paymentType', formData.paymentType);
        data.append('cash', formData.cash || 0);
        data.append('bankTransfer', formData.bankTransfer || 0);
        data.append('transactionId', formData.transactionId || '');
        data.append('image', formData.image);

        console.log(formData);

        try {
            const response = await fetch(`${config.API_ROOT}/api/Payments`, {
                method: 'POST',
                body: data
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);
            localStorage.setItem("paymentSuccess", "Bạn đã xác nhận thanh toán thành công");
            navigate('/staff/danh-sach-thanh-toan')
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const numberToWords = (num) => {
        const units = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
        const teens = ["mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"];
        const tens = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
        const scales = ["", "nghìn", "triệu", "tỷ"];

        if (num === 0) return "Không đồng";

        let words = [];

        for (let i = 0; num > 0; i++) {
            let chunk = num % 1000;

            if (chunk) {
                let chunkStr = '';

                if (chunk >= 100) {
                    chunkStr += units[Math.floor(chunk / 100)] + ' trăm ';
                    chunk %= 100;
                }

                if (chunk >= 20) {
                    chunkStr += tens[Math.floor(chunk / 10)] + ' ';
                    chunk %= 10;

                    if (chunk === 1) {
                        chunkStr += 'mốt ';
                    } else if (chunk === 5) {
                        chunkStr += 'lăm ';
                    } else if (chunk > 0) {
                        chunkStr += units[chunk] + ' ';
                    }
                } else if (chunk >= 10) {
                    chunkStr += teens[chunk - 10] + ' ';
                } else if (chunk > 0) {
                    chunkStr += units[chunk] + ' ';
                }

                chunkStr = chunkStr.trim();
                words.push(chunkStr + ' ' + scales[i]);
            }

            num = Math.floor(num / 1000);
        }

        let result = words.reverse().join(' ').trim() + ' đồng.';
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    if (!orderDetails) {
        return <div>Loading...</div>;
    }

    const formatDateTime = (dateTimeString) => {
        try {
            const options = {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            };
            return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateTimeString));
        } catch (error) {
            // console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    return (
        <div className="cash-detail" >
            <form onSubmit={handleSubmit}>
                <h1 className="cash-detail-title-page">Thông tin chi tiết đơn hàng #{orderId}</h1>
                <div className="d-flex justify-content-end">
                    <div className="pay-confirm">
                        <Link to="/staff/danh-sach-thanh-toan" className="btn btn-danger fas fa-times confirm-btn"><span className="ms-2">Hủy bỏ</span></Link>
                        <button className="btn btn-success fas fa-check confirm-btn ms-2" type="submit"><span className="ms-2">Xác nhận thanh toán</span></button>
                    </div>
                </div>
                <div className="row">
                    <div className="order-customer-info col-4">
                        <h6>Tên khách hàng: {order.customers?.customerName}</h6>
                        <h6>SĐT khách hàng: {order.customers?.phoneNumber}</h6>
                        <h6>Email khách hàng: {order.customers?.email}</h6>
                    </div>
                    <div className="col-4">
                        <h6>Thời gian tạo đơn hàng: {formatDateTime(order?.orderDate) || true}</h6>
                        <div className="info-sumarize">
                            <h6>Tổng số lượng sản phẩm: {numOfProducts} sản phẩm</h6>
                            <h6>Tổng cộng: {numeral(order.total).format("0,0")} VND</h6>
                            <h6>Bằng chữ: {numberToWords(order.total)}</h6>
                        </div>
                    </div>
                    <div className="col-4">

                        <div className="d-flex">
                            <h6 className="me-2">Hình thức thanh toán</h6>
                            <select
                                id="paymentType"
                                name="paymentType"
                                value={formData.paymentType}
                                onChange={handleChange}
                                className="ms-2"
                            >
                                <option value="Thanh toán tiền mặt">Thanh toán tiền mặt</option>
                                <option value="Thanh toán chuyển khoản">Thanh toán chuyển khoản</option>
                                <option value="Thanh toán kết hợp">Thanh toán kết hợp</option>
                            </select>
                        </div>
                        {formData.paymentType === 'Thanh toán chuyển khoản' && (
                            <div>
                                <div className="d-flex mt-3">
                                    <h6 className="me-2 flex-shrink-0">Mã chuyển khoản: </h6>
                                    <input
                                        type="text"
                                        id="transactionId"
                                        name="transactionId"
                                        value={formData.transactionId}
                                        onChange={handleChange}
                                        placeholder="Nhập mã giao dịch"
                                        className="flex-grow-1 ma-chuyen-khoan"
                                    />

                                </div>
                                <div className="d-flex mt-3">
                                    <h6>Ảnh minh chứng: </h6>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        className="ms-2 anh-minh-chung"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        )}
                        {formData.paymentType === 'Thanh toán kết hợp' && (
                            <div>
                                <div className="d-flex mt-3">
                                    <h6 className="me-2 flex-shrink-0">Số tiền mặt: </h6>
                                    <input
                                        type="number"
                                        id="cash"
                                        name="cash"
                                        value={formData.cash}
                                        onChange={handleChange}
                                        placeholder="Nhập số tiền mặt thanh toán"
                                        step="100000"
                                        className="flex-grow-1 ma-chuyen-khoan"
                                    />
                                </div>
                                <div className="d-flex mt-3">
                                    <h6 className="me-2 flex-shrink-0">Số tiền chuyển khoản: </h6>
                                    <input
                                        type="number"
                                        id="bankTransfer"
                                        name="bankTransfer"
                                        value={formData.bankTransfer}
                                        onChange={handleChange}
                                        step="100000"
                                        placeholder="Nhập số tiền chuyển khoản"
                                        className="flex-grow-1 ma-chuyen-khoan"
                                    />
                                </div>
                                <div className="d-flex mt-3">
                                    <h6 className="me-2 flex-shrink-0">Mã chuyển khoản: </h6>
                                    <input
                                        type="text"
                                        id="transactionId"
                                        name="transactionId"
                                        value={formData.transactionId}
                                        onChange={handleChange}
                                        placeholder="Nhập mã giao dịch"
                                        className="flex-grow-1 ma-chuyen-khoan"
                                    />
                                </div>
                                <div className="d-flex mt-3">
                                    <h6>Ảnh minh chứng: </h6>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        className="ms-2 anh-minh-chung"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="order-detail-info">
                    <h6 className="cash-detail-title fw-bold">Danh sách chi tiết đơn hàng:</h6>
                    <div className="order-detail-table ml-table d-flex justify-content-center align-items-center">
                        <table className="staff-orders-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã sản phẩm</th>
                                    <th>Hình ảnh</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Loại vàng</th>
                                    <th>Trọng lượng vàng</th>
                                    <th>Tiền đá</th>
                                    <th>Tiền công</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.map((detail, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{detail.products.productId}</td>
                                        <td>
                                            <div>
                                                <img className="pay-detail-img" src="https://ngoctham.com/wp-content/uploads/2023/02/nhan-nu-vang-18k-dvnutvv0000q506-ntj-01-1800x2025.jpg" />
                                            </div>
                                        </td>
                                        <td>{detail.products.productName}</td>
                                        <td>{detail.quantity}</td>
                                        <td>{detail.products.goldTypes.goldName}</td>
                                        <td>{detail.products.goldWeight} chỉ</td>
                                        <td>{numeral(250000).format("0,0")} VND</td>
                                        <td>{numeral(detail.products.wage).format("0,0")} VND</td>
                                        <td>{numeral(detail.price).format("0,0")} VND</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </form>
        </div >

    );
}
