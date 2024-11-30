import React, { useEffect, useState } from "react";
import axios from 'axios';
import './CashierDetail.css';
import { Link, useParams, useNavigate } from "react-router-dom";
import numeral from "numeral";
import config from "../config/config";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function CashierDetail() {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [order, setOrder] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [numOfProducts, setNumOfProducts] = useState(0);
    const [curTab, setCurTab] = useState(1);
    const [payments, setPayments] = useState([]);
    const [paid, setPaid] = useState(0);
    const [addPaymentSuccess, setAddPaymentSuccess] = useState(false);
    const [pttt, setPttt] = useState('')
    const [payType, setPayType] = useState(true);
    const [formattedInputValue, setFormattedInputValue] = useState('');
    const [showBill, setShowBill] = useState(false)
    const [info, setInfo] = useState();
    const [mess, setMess] = useState("");
    const formatedInputNumber = (input) => {
        return numeral(input).format('0,0');
    };

    useEffect(() => {
        fetch(`${config.API_ROOT}/api/StoreInfo`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setInfo(data);
            })
            .catch(error => console.error("Error fetching store info:", error));
    }, []);

    const generatePDF = async () => {
        const capture = document.querySelector(".orderPDF");
        if (!capture) {
            console.error("Element not found!");
            return;
        }
        try {
            html2canvas(capture, { useCORS: true })
                .then((canvas) => {
                    const imgData = canvas.toDataURL("image/png");
                    const doc = new jsPDF("p", "mm", "a4");
                    const componentWidth = doc.internal.pageSize.getWidth();
                    const componentHeight = (canvas.height * componentWidth) / canvas.width;
                    doc.addImage(imgData, "PNG", 0, 0, componentWidth, componentHeight);
                    doc.save(`${order.orderCode}.pdf`);
                })
                .catch((error) => {
                    console.error("Error generating PDF:", error);
                });
        } catch (error) {
            console.error("Error loading images:", error);
        }
    };


    const validationSchemaCash = Yup.object({
        cash: Yup.number()
            .min(1000, 'Số tiền mặt tối thiểu là 1,000 VND')
            .max(order.total - paid, `Số tiền còn lại tối đa là ${numeral(order.total - paid).format(0, 0)} VND`)
            .required('Vui lòng nhập số tiền mặt'),
    });

    const validationSchemaBank = Yup.object({
        bankTransfer: Yup.number()
            .min(10000, 'Số tiền chuyển khoản tối thiểu là 10,000 VND')
            .max(order.total - paid, `Số tiền còn lại tối đa là ${numeral(order.total - paid).format(0, 0)} VND`)
            .required('Vui lòng nhập số tiền chuyển khoản'),
        transactionId: Yup.string()
            .matches(/^[A-Za-z\d]{5,14}$/, 'Mã giao dịch phải chứa từ 5 đến 14 ký tự, chỉ bao gồm chữ và số')
            .required('Vui lòng nhập mã giao dịch'),
        image: Yup.mixed()
            .test('fileType', 'Ảnh giao dịch chỉ chấp nhận định dạng PNG hoặc JPG', (value) => {
                if (!value) return true; // Bỏ qua nếu không có file
                const supportedFormats = ['image/jpeg', 'image/png'];
                return supportedFormats.includes(value.type);
            })
            .test('fileSize', 'Ảnh giao dịch không được quá 5MB', (value) => {
                return value && value.size <= 5 * 1024 * 1024;
            })
            .required('Vui lòng tải lên ảnh giao dịch'),
    });

    const formik = useFormik({
        initialValues: {
            cash: '',
            bankTransfer: '',
            transactionId: '',
            image: null,
        },
        validationSchema: pttt === "Chuyển khoản" ? validationSchemaBank : validationSchemaCash,
        validateOnChange: true,
        onSubmit: values => {
            console.log(values);
            handleSubmit(values);
        },
    });

    const handlePayFull = (type) => {
        const remainingAmount = order.total - paid;
        const formattedAmount = formatedInputNumber(remainingAmount);
        if (type === 'Tiền mặt') {
            formik.setFieldValue('cash', remainingAmount);
            setFormattedInputValue(formattedAmount);
        } else if (type === 'Chuyển khoản') {
            formik.setFieldValue('bankTransfer', remainingAmount);
            setFormattedInputValue(formattedAmount);
        }
    };

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

    }, [payType]);

    useEffect(() => {
        const totalPaid = payments.reduce((sum, payment) => sum + (payment.cash || 0) + (payment.bankTransfer || 0), 0);
        setPaid(totalPaid);
    }, [payments]);

    const fetchPayments = () => {
        axios.get(`${config.API_ROOT}/api/Payments/GetPaymentByOrderOrderCode?orderOrder=${order.orderCode}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setPayments(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching payments!', error);
            });
    }

    useEffect(() => {
        fetchPayments();
    }, [payType]);

    useEffect(() => {
        axios.get(`${config.API_ROOT}/api/Orders/GetOrderDetails/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
                setOrderDetails(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the order details!', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const rawValue = value.replace(/,/g, '');
        const formattedValue = numeral(rawValue).format('0,0');
        formik.setFieldValue(name, rawValue);
        setFormattedInputValue(formattedValue);
    };

    const handleFileChange = (e) => {
        formik.setFieldValue('image', e.currentTarget.files[0]);
    };


    const handleSubmit = async (e) => {
        const data = new FormData();
        data.append('orderId', order.orderId);
        data.append('paymentType', pttt);
        data.append('cash', e.cash || 0);
        data.append('bankTransfer', e.bankTransfer || 0);
        data.append('transactionId', e.transactionId || '');
        data.append('image', e.image);
        try {
            const response = await fetch(`${config.API_ROOT}/api/Payments`, {
                method: 'POST',
                body: data,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.ok) {
                formik.resetForm();
                setAddPaymentSuccess(true);
                setTimeout(() => {
                    setAddPaymentSuccess(false);
                }, 3000);
                setPaid('');
            }
            setPayType(false);
            if (order.total === paid) {
                localStorage.setItem("paymentSuccess", `Bạn đã xác nhận thanh toán đơn hàng ${order.orderCode} thành công`);
            }
        } catch (error) {
            setMess(error.response.data)
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
            return 'Invalid date';
        }
    };



    return (
        <div className="cash-detail" >
            {addPaymentSuccess && (
                <div className="alert alert-success position-fixed top-8 end-0 m-3">
                    Đã thêm thanh toán thành công
                </div>

            )}
            {/* {mess && (
                <div className="alert alert-success position-fixed top-8 end-0 m-3">
                    {mess}
                </div>

            )} */}
            {showBill && (
                <div className="warranty-detail-pdf-overlay">

                    <div className="warranty-detail-pdf">
                        <div className='d-flex justify-content-between pbh-nutbam'>
                            <div className='btn btn-primary' onClick={generatePDF}>IN HÓA ĐƠN BÁN HÀNG</div>
                            <i class="fas fa-window-close btn btn-danger closeShow" onClick={() => setShowBill(false)}></i>
                        </div>
                        <div className='orderPDF'>
                            <div className='d-flex'>
                                <div className='img-logo-pbh'>
                                    <img style={{ height: "100px" }} src={info.avatar} alt="Store Avatar"></img>
                                </div>
                                <div className='title-page'>
                                    <h1 className='pbh-title-pdf'>HÓA ĐƠN BÁN VÀNG</h1>
                                </div>
                            </div>

                            <div className='d-flex'>
                                <div className='col-7 shop bill-store'>
                                    <h5>Thông tin cửa hàng:</h5>
                                    <h6>{info.footer}</h6>
                                    <h6>Email: <p className='non-bold'>{info.email}</p></h6>
                                    <h6>SĐT: <p className='non-bold'>{info.numberPhone}</p></h6>
                                    <h6>Mã số thuế: <p className='non-bold'>{info.taxNumber}</p></h6>
                                    <h6 className='d-flex mb-4'><i className="fas fa-home me-2"></i> <p className='non-bold'>{info.address}</p></h6>
                                </div>
                                <div className='col'>
                                    <h5>Thông tin đơn hàng:</h5>
                                    <h6>Mã đơn hàng: <p className='non-bold'>{order.orderCode}</p></h6>
                                    <h6>Thời gian: <p className='non-bold'>{formatDateTime(order?.orderDate)}</p></h6>
                                    <h6 >Tổng số lượng sản phẩm:  <p className='non-bold'>{numOfProducts} sản phẩm</p></h6>
                                    <h6 >Tổng tiền: <p className='non-bold'>{numeral(order.total).format(0, 0)} VND</p></h6>
                                </div>
                                <div className='col'>
                                    <h5>Thông tin khách hàng:</h5>
                                    <h6>Tên khách hàng: <p className='non-bold'>{order.customers?.customerName || order.customerName || "Khách vãng lai"}</p></h6>
                                    <h6>SĐT khách hàng: <p className='non-bold'>{order.customers?.phoneNumber || order.phoneNumber}</p></h6>
                                    <h6 >Email: <p className='non-bold'>{order.customers?.email || order.email}</p></h6>
                                </div>

                            </div>

                            <div>
                                <h6>Thông tin sản phẩm</h6>

                                <table className='product-table'>
                                    <thead className='table-header'>
                                        <tr>
                                            <th>Mã sản phẩm</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Loại vàng</th>
                                            <th>Trọng lượng vàng</th>
                                            <th>Tiền công</th>
                                            <th>Tổng tiền đá</th>
                                            <th>Số lượng</th>
                                            <th>Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDetails.map((orderDetail, index) => (
                                            <tr key={index}>
                                                <td>{orderDetail.product.productCode}</td>
                                                <td>{orderDetail.product.productName}</td>
                                                <td>{orderDetail.product.goldTypes.goldName}</td>
                                                <td>{orderDetail.product.goldWeight} chỉ</td>
                                                <td>{numeral(orderDetail.product.wage).format("0,0")} VND</td>
                                                <td>{numeral(orderDetail.product.stones.reduce((acc, stone) => acc + stone.price, 0)).format("0,0")} VND</td>
                                                <td>{orderDetail.quantity}</td>
                                                <td>{numeral(orderDetail.price).format("0,0")} VND</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                            <div className='d-flex justify-content-between kyten'>
                                <div className='text-center'>
                                    Khách hàng
                                    <br />
                                    (Ký, Ghi rõ họ tên)
                                </div>
                                <div className='text-center'>
                                    Cửa hàng
                                    <br />
                                    (Đóng mọc)
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
            <h1 className="cash-detail-title-page">Thông tin chi tiết đơn hàng {order.orderCode}</h1>
            <div className="d-flex justify-content-end">
                <div className="pay-confirm">
                    {paid !== order.total &&
                        <Link to="/staff/danh-sach-thanh-toan" className="btn btn-danger fas fa-times confirm-btn" onClick={() => formik.resetForm()}><span className="ms-2">Trở về</span></Link>
                    }
                    {paid === order.total &&
                        <div>
                            <div className="btn btn-primary invoice-btn" onClick={() => setShowBill(true)}>
                                <i class="fas fa-file-invoice me-2"></i>
                                Hóa đơn</div>
                            <Link to="/staff/danh-sach-thanh-toan" className="btn btn-success fas fa-check confirm-btn ms-2" ><span className="ms-2">Hoàn thành</span></Link>
                        </div>
                    }
                </div>
            </div>
            <div className="row">
                <div className="order-customer-info col-4">
                    <h6>Tên khách hàng: {order.customers?.customerName || order.customerName}</h6>
                    <h6>SĐT khách hàng: {order.customers?.phoneNumber || order.phoneNumber}</h6>
                    <h6>Email khách hàng: {order.customers?.email || order.email}</h6>
                </div>
                <div className="col-6">
                    <h6>Thời gian tạo đơn hàng: {formatDateTime(order?.orderDate) || true}</h6>
                    <div className="info-sumarize">
                        <h6>Tổng số lượng sản phẩm: {numOfProducts} sản phẩm</h6>
                        <h6>Tổng cộng: {numeral(order.total).format("0,0")} VND</h6>
                        <h6>Bằng chữ: {numberToWords(order.total)}</h6>
                    </div>
                </div>
            </div>
            <div className="order-detail-info">
                <div className="d-flex">
                    <h6 className={`cash-detail-title fw-bold btn ${curTab === 1 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCurTab(1)}>Danh sách chi tiết đơn hàng</h6>
                    <h6 className={`fw-bold btn btn-primary ms-2 ${curTab === 2 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setCurTab(2); setPayType(false) }}>Thanh toán</h6>
                </div>

                {curTab === 1
                    && <div className="order-detail-table ml-table d-flex justify-content-center align-items-center">
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
                                        <td>{detail.product.productCode}</td>
                                        <td>
                                            <div>
                                                <img className="pay-detail-img" src="https://ngoctham.com/wp-content/uploads/2023/02/nhan-nu-vang-18k-dvnutvv0000q506-ntj-01-1800x2025.jpg" />
                                            </div>
                                        </td>
                                        <td>{detail.product.productName}</td>
                                        <td>{detail.quantity}</td>
                                        <td>{detail.product.goldTypes.goldName}</td>
                                        <td>{detail.product.goldWeight} chỉ</td>
                                        <td>{numeral(250000).format("0,0")} VND</td>
                                        <td>{numeral(detail.product.wage).format("0,0")} VND</td>
                                        <td>{numeral(detail.price).format("0,0")} VND</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                }

                {curTab === 2 &&
                    <div className="">
                        <div>
                            <h6 className="payinfo-title">Thông tin thanh toán: </h6>

                            <div>
                                <table className="staff-orders-table payment-info">
                                    <thead>
                                        <th>Tổng tiền cần thanh toán</th>
                                        <th>Tổng tiền đã thanh toán</th>
                                        <th>Tiền còn lại</th>
                                    </thead>
                                    <tr>
                                        <td>{numeral(order.total).format(0, 0)} VND</td>
                                        <td>{numeral(paid).format(0, 0)} VND</td>
                                        <td>{numeral(order.total - paid).format(0, 0)} VND</td>
                                    </tr>
                                </table>
                            </div>


                            <div className="payment-history">
                                <div className="d-flex justify-content-between payment-info-section">
                                    <h6 className="payment-history-title">Lịch sử thanh toán: </h6>
                                    {!payType && !(paid === order.total) &&
                                        <h6 className="btn btn-success" onClick={() => {
                                            setPayType(!payType);
                                            setPttt('');
                                        }}><i class="fas fa-plus me-2" ></i> Tạo thanh toán</h6>
                                    }
                                </div>
                                {payType && (
                                    <form onSubmit={formik.handleSubmit}>
                                        <div className="">
                                            <div className="d-flex my-4 pay-container">
                                                <div className="form-check me-5">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="paymentType"
                                                        id="cash"
                                                        value="Tiền mặt"
                                                        onChange={(e) => {
                                                            setPttt(e.target.value);
                                                        }}

                                                    />
                                                    <label className="form-check-label" htmlFor="cash">
                                                        Thanh toán tiền mặt
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="paymentType"
                                                        id="bankTransfer"
                                                        value="Chuyển khoản"
                                                        onChange={(e) => {
                                                            setPttt(e.target.value);
                                                        }}
                                                    />
                                                    <label className="form-check-label" htmlFor="bankTransfer">
                                                        Chuyển khoản
                                                    </label>
                                                </div>
                                            </div>
                                            {pttt === 'Tiền mặt' && (
                                                <>
                                                    <div className="pay-form d-flex cash-section">
                                                        <label htmlFor="cash">Tiền mặt:</label>
                                                        <input
                                                            type="text"
                                                            name="cash"
                                                            id="cash"
                                                            className="form-control"
                                                            value={formattedInputValue}
                                                            onChange={handleChange}
                                                            onBlur={formik.handleBlur}
                                                            placeholder="Nhập số tiền mặt"

                                                        />
                                                        <span className="input-payment-currency-cash">VND</span>
                                                        <h6 className="btn-payfull btn btn-warning" onClick={() => handlePayFull('Tiền mặt')}>Thanh toán hết</h6>
                                                    </div>
                                                    {formik.errors.cash && formik.touched.cash && <div className="text-danger error-cash">{formik.errors.cash}</div>}
                                                </>
                                            )}
                                            {pttt === 'Chuyển khoản' && (
                                                <div>
                                                    <div className="pay-form d-flex bank-section mb-3">
                                                        <label htmlFor="bankTransfer">Số tiền chuyển khoản:</label>
                                                        <div className="input-payment-container">
                                                            <input
                                                                type="text"
                                                                id="bankTransfer"
                                                                placeholder="Nhập số tiền"
                                                                name="bankTransfer"
                                                                className="form-control"
                                                                value={formattedInputValue}
                                                                onChange={handleChange}
                                                                onBlur={formik.handleBlur}
                                                            />
                                                            <span className="input-payment-currency">VND</span>
                                                        </div>
                                                        <h6 className="btn-payfull btn btn-warning" onClick={() => handlePayFull('Chuyển khoản')}>Thanh toán hết</h6>
                                                        <label htmlFor="transactionId">Mã giao dịch:</label>
                                                        <input
                                                            type="text"
                                                            name="transactionId"
                                                            className="form-control input-bank-id"
                                                            id="transactionId"
                                                            placeholder="Nhập mã giao dịch"
                                                            value={formik.values.transactionId}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                        <label htmlFor="image">Ảnh giao dịch:</label>
                                                        <input
                                                            type="file"
                                                            name="image"
                                                            className="form-control"
                                                            id="image"
                                                            onChange={(e) => formik.setFieldValue('image', e.currentTarget.files[0])}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                    </div>
                                                    <div className="error-bank row">
                                                        <div className="col-5">
                                                            {formik.errors.bankTransfer && formik.touched.bankTransfer && <div className="text-danger error-banktranfer">{formik.errors.bankTransfer}</div>}
                                                        </div>
                                                        <div className="col-4">
                                                            {formik.errors.transactionId && formik.touched.transactionId && <div className="text-danger error-bankid">{formik.errors.transactionId}</div>}
                                                        </div>
                                                        <div className="col-2">
                                                            {formik.errors.image && formik.touched.image && <div className="text-danger error-img">{formik.errors.image}</div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="d-flex justify-content-end mb-4 btn-pay-confirm">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger fas fa-times confirm-btn"
                                                    onClick={() => {
                                                        setPayType(false);
                                                        formik.resetForm();
                                                        setPttt('')
                                                    }}
                                                >
                                                    <span className="ms-2">Hủy bỏ</span>
                                                </button>

                                                <button type="submit" className="btn btn-success fas fa-check confirm-btn ms-2"><span className="ms-2">Xác nhận</span></button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                <table className="staff-orders-table payment-history-table">
                                    <thead>
                                        <th>STT</th>
                                        <th>Mã giao dịch</th>
                                        <th>Phương thức thanh toán</th>
                                        <th>Số tiền thanh toán</th>
                                        <th>Mã chuyển khoản</th>
                                        <th>Ảnh minh chứng</th>
                                    </thead>
                                    <tbody>
                                        {payments.map((payment, index) => (
                                            <tr key={payment.paymentId}>
                                                <td>{index + 1}</td>
                                                <td>{payment.paymentCode}</td>
                                                <td>{payment.paymentType}</td>
                                                <td>{payment.cash === 0 ? numeral(payment.bankTransfer).format(0, 0) : numeral(payment.cash).format(0, 0)} VND</td>
                                                <td>{payment.transactionId}</td>
                                                <td>
                                                    {payment.image && <img src={payment.image} alt="N/A" width="100" />}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                        </div>
                    </div>
                }
            </div >
        </div >

    );
}
