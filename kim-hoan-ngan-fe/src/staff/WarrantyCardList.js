import './WarrantyCardList.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import numeral from 'numeral';
import config from '../config/config';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function WarrantyCardList() {
    const { orderId } = useParams();
    const [order, setOrder] = useState({});
    const [warrantyList, setWarrantyList] = useState([]);
    const token = localStorage.getItem('token');
    const [exportWarrantyMessage, setExportWarrantyMessage] = useState('');
    const [numOfProducts, setNumOfProducts] = useState(0);
    const [currentWarranty, setCurrentWarranty] = useState(null);
    const [show, setShow] = useState(false);
    const [info, setInfo] = useState();

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
                    doc.save(`${currentWarranty.warrantyCode}.pdf`);
                })
                .catch((error) => {
                    console.error("Error generating PDF:", error);
                });
        } catch (error) {
            console.error("Error loading images:", error);
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${config.API_ROOT}/api/Orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrder(response.data);
            } catch (error) {
                console.error('There was an error fetching the order!', error);
            }
        };

        const fetchWarrantyList = async () => {
            try {
                const response = await axios.get(`${config.API_ROOT}/api/Cart/get-warranty/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setWarrantyList(response.data);
            } catch (error) {
                console.error('There was an error fetching the warranty!', error);
            }
        };

        fetchOrder();
        fetchWarrantyList();
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
    }, [orderId, token]);

    const formatDateTime = (dateTimeString) => {
        try {
            const options = {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour12: false
            };
            return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateTimeString));
        } catch (error) {
            return 'Invalid date';
        }
    };

    const addMonths = (date, months) => {
        let d = new Date(date);
        d.setMonth(d.getMonth() + months);
        return d;
    };

    useEffect(() => {
        const exportWarrantyMessage = localStorage.getItem('exportWarrantyMessage');
        if (exportWarrantyMessage) {
            setExportWarrantyMessage(exportWarrantyMessage);
            localStorage.removeItem('exportWarrantyMessage');
        }
        setTimeout(() => {
            setExportWarrantyMessage('');
        }, 3000);
    }, []);

    return (
        <>
            {exportWarrantyMessage && (
                <div className="alert alert-success position-fixed top-8 end-0 m-3">
                    {exportWarrantyMessage}
                </div>
            )}
            {order && (
                <div className="warrantyCardList">
                    {show && (
                        <div className="warranty-detail-pdf-overlay">

                            <div className="warranty-detail-pdf">
                                <div className='d-flex justify-content-between pbh-nutbam'>
                                    <div className='btn btn-primary' onClick={generatePDF}>IN PHIẾU BẢO HÀNH</div>
                                    <i class="fas fa-window-close btn btn-danger closeShow" onClick={() => setShow(false)}></i>
                                </div>
                                <div className='orderPDF'>
                                    <div className='d-flex'>
                                        <div className='img-logo-pbh'>
                                            <img style={{ height: "100px" }} src={info.avatar} alt="Store Avatar"></img>
                                        </div>
                                        <div className='title-page'>
                                            <h1 className='pbh-title-pdf'>GIẤY BẢO HÀNH VÀNG</h1>
                                            <div className='d-flex justify-content-between'>
                                                <p>Mã giấy bảo hành: {currentWarranty.warrantyCode}</p>
                                                <p>Ngày hết hạn: {formatDateTime(addMonths(order?.orderDate, currentWarranty.orderDetails.products.warrantyPeriod))}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='d-flex'>
                                        <div className='col-7 shop'>
                                            <h5>Thông tin cửa hàng:</h5>
                                            <h6>{info.footer}</h6>
                                            <h6>Email: <p className='non-bold'>{info.email}</p></h6>
                                            <h6>SĐT: <p className='non-bold'>{info.numberPhone}</p></h6>
                                            <h6>Mã số thuế: <p className='non-bold'>{info.taxNumber}</p></h6>
                                            <h6><i className="fas fa-home"></i> <p className='non-bold'>{info.address}</p></h6>
                                        </div>

                                        <div className='col'>
                                            <h5>Thông tin khách hàng:</h5>
                                            <h6>Tên khách hàng: <p className='non-bold'>{order.customers?.customerName || order.customerName}</p></h6>
                                            <h6>SĐT khách hàng: <p className='non-bold'>{order.customers?.phoneNumber || order.phoneNumber}</p></h6>
                                            <h6 >Email khách hàng: <p className='non-bold'>{order.customers?.email || order.email}</p></h6>
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
                                                    <th>Thành tiền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{currentWarranty.orderDetails.products.productCode}</td>
                                                    <td>{currentWarranty.orderDetails.products.productName}</td>
                                                    <td>{currentWarranty.orderDetails.products.goldTypes.goldName}</td>
                                                    <td>{currentWarranty.orderDetails.products.goldWeight}</td>
                                                    <td>{numeral(currentWarranty.orderDetails.products.wage).format("0,0")} VND</td>
                                                    <td>{numeral(currentWarranty.orderDetails.products.stones.reduce((acc, stone) => acc + stone.price, 0)).format("0,0")} VND</td>
                                                    <td>{numeral(currentWarranty.orderDetails.price).format("0,0")} VND</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <h6>Danh sách đá đính trên sản phẩm</h6>
                                        {currentWarranty.orderDetails.products.stones.length > 0 && (
                                            <table className='stone-table'>
                                                <thead className='table-header'>
                                                    <tr>
                                                        <th>Mã đá</th>
                                                        <th>Tên đá</th>
                                                        <th>Màu sắc</th>
                                                        <th>Giá đá</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentWarranty.orderDetails.products.stones.map((stone, index) => (
                                                        <tr key={index}>
                                                            <td>{stone.stoneCode}</td>
                                                            <td>{stone.name}</td>
                                                            <td>{stone.color}</td>
                                                            <td>{numeral(stone.price).format("0,0")} VND</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}

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
                            <Link to="/staff/danh-sach-bao-hanh" className="btn btn-success fas fa-check confirm-btn ms-2">
                                <span className="ms-2">Hoàn thành</span>
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="order-customer-info col-4">
                            <h6>Tên khách hàng: {order.customers?.customerName || order.customerName}</h6>
                            <h6>SĐT khách hàng: {order.customers?.phoneNumber || order.phoneNumber}</h6>
                            <h6>Email khách hàng: {order.customers?.email || order.email}</h6>
                        </div>
                        <div className="col-4">
                            <h6>Thời gian tạo đơn hàng: {formatDateTime(order?.orderDate) || true}</h6>
                            <div className="info-sumarize">
                                <h6>Tổng số lượng sản phẩm: {numOfProducts} sản phẩm</h6>
                                <h6>Tổng cộng: {numeral(order.total).format("0,0")} VND</h6>
                            </div>
                        </div>
                    </div>
                    <h4 className="warrantyCardList-title mt-2">Danh sách phiếu bảo hành cho đơn hàng {order?.orderCode}</h4>
                    <div className="">
                        <table className="table table-striped table-warranties">
                            <thead>
                                <tr>
                                    <th>Mã Phiếu Bảo Hành</th>
                                    <th>Mã sản phẩm</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Loại vàng</th>
                                    <th>Trọng lượng vàng</th>
                                    <th>Ngày hết hạn</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {warrantyList.map((warranty) => (
                                    <tr key={warranty.warrantyId}>
                                        <td>{warranty.warrantyCode}</td>
                                        <td>{warranty.orderDetails.products.productCode}</td>
                                        <td>{warranty.orderDetails.products.productName}</td>
                                        <td>{warranty.orderDetails.products.goldTypes.goldName}</td>
                                        <td>{warranty.orderDetails.products.goldWeight} chỉ</td>
                                        <td>{formatDateTime(addMonths(order?.orderDate, warranty.orderDetails.products.warrantyPeriod))}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => {
                                                setCurrentWarranty(warranty);
                                                setShow(true)
                                            }}>
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div >
            )
            }
        </>
    );
}
