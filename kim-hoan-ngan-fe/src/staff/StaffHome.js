import React, { useEffect, useState } from 'react';
import './StaffHome.css';
import { Link } from "react-router-dom";
import numeral from 'numeral';
import config from "../config/config";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
export default function StaffHome() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [curOrderPage, setCurOrderPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: 'orderId', direction: 'desc' });
    const [createOrderMessage, setCreateOrderMessage] = useState('');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('Tất cả');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const pageSize = 10;
    const token = localStorage.getItem('token');
    const [level, setLevel] = useState(null);
    const [curOrder, setCurOrder] = useState();
    const [payments, setPayments] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [warrantyList, setWarrantyList] = useState([]);
    const [showDetail, setShowDetail] = useState(false);
    const [chectype, setChectype] = useState('');
    const [showwDetailImg, setShowwDetailImg] = useState(false);
    const [imgDetail, setImgDetail] = useState('');
    const [showBill, setShowBill] = useState(false);
    const [info, setInfo] = useState();
    const [numOfProducts, setNumOfProducts] = useState(0);

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

    const fetchNumOfProduct = (order) => {
        axios.get(`${config.API_ROOT}/api/Orders/get-number-of-order-quantity/${order.id}`, {
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

    };

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
                    doc.save(`${curOrder.code}.pdf`);
                })
                .catch((error) => {
                    console.error("Error generating PDF:", error);
                });
        } catch (error) {
            console.error("Error loading images:", error);
        }
    };

    const closeModalDetail = () => {
        setShowDetail(false);
    }

    const showImgdetail = (img) => {
        setShowwDetailImg(true)
        setImgDetail(img)
    }

    const fetchWarranty = async (order) => {
        try {
            const response = await axios.get(`${config.API_ROOT}/warranties/get-warranties-by-order-id/${order.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Warranty List data:', response.data);
            setWarrantyList(response.data);
        } catch (error) {
            console.error('There was an error fetching the warranty!', error);
        }
    };

    const fetchPayments = (order) => {
        axios.get(`${config.API_ROOT}/payments/get-payments-by-order-id/${order.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setPayments(response.data);
                response.data.forEach((x) => {
                    setChectype(x.paymentType);
                });
            })
            .catch(error => {
                console.error('There was an error fetching payments!', error);
            });
    };

    const fetchOrderDetails = (order) => {
        axios.get(`${config.API_ROOT}/orders/get-order-details-by-orderid/${order.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setOrderDetails(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching order details:', error);
            });
    };

    const handleViewDetailOrder = (order) => {
        fetchOrderDetails(order);
        fetchPayments(order);
        fetchWarranty(order);
        setCurOrder(order);
        setShowDetail(true);
    };

    const handleViewBill = (order) => {
        fetchNumOfProduct(order);
        fetchOrderDetails(order);
        setCurOrder(order);
        setShowBill(true);
    }

    const statusFilters = [
        { key: 'Đợi thanh toán', label: 'Đợi thanh toán', color: "rgb(206, 136, 5)" },
        { key: 'Hủy thanh toán', label: 'Hủy thanh toán', color: "red" },
        { key: 'Đang thanh toán', label: 'Đang thanh toán', color: "#ca1667" },
        { key: 'Hết hạn thanh toán', label: 'Hết hạn thanh toán', color: "#9C9797" },
        { key: 'Đã thanh toán', label: 'Đã thanh toán', color: "rgb(15, 30, 252)" },
        { key: 'Đã hoàn thành', label: 'Đã hoàn thành', color: "rgb(0, 180, 0)" },
        { key: 'Tất cả', label: 'Tất cả' }
    ];

    const statusColors = {
        'Đợi thanh toán': 'rgb(206, 136, 5)',
        'Hủy thanh toán': 'red',
        'Đang thanh toán': '#ca1667',
        'Hết hạn thanh toán': '#9C9797',
        'Đã thanh toán': 'rgb(15, 30, 252)',
        'Đã hoàn thành': 'rgb(0, 180, 0)',
        'Tất cả': 'black'
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setLevel(parseInt(decodedToken.Level, 10));
        }
    }, []);

    useEffect(() => {
        fetch(`${config.API_ROOT}/orders`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setOrders(data);
                setFilteredOrders(data);
                setTotalOrders(data.length);
            })
            .catch(error => console.error('Error fetching orders:', error));
    }, [token]);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    };

    const handlePageChange = (newPage) => {
        setCurOrderPage(newPage);
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredOrders.length / pageSize);
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i} className={`page-item ${i === curOrderPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
                </li>
            );
        }

        return (
            <ul className="pagination staffhome-pagination">
                <li className={`page-item ${curOrderPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(curOrderPage - 1)}>Previous</button>
                </li>
                {pages}
                <li className={`page-item ${curOrderPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(curOrderPage + 1)}>Next</button>
                </li>
            </ul>
        );
    };

    useEffect(() => {
        const message = localStorage.getItem('createOrderMessage');
        if (message) {
            setCreateOrderMessage(message);
            localStorage.removeItem('createOrderMessage');
            setTimeout(() => {
                setCreateOrderMessage('');
            }, 3000);
        }
    }, []);

    const sortOrders = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filterOrders = () => {
        let updatedOrders = orders;
        if (selectedStatusFilter !== 'Tất cả') {
            updatedOrders = updatedOrders.filter(order => order?.status === selectedStatusFilter);
        }
        if (searchQuery) {
            updatedOrders = updatedOrders.filter(order =>
                order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (order.customers?.customerName || order.customerName || "").toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (startDateTime && endDateTime) {
            const start = new Date(startDateTime);
            const end = new Date(endDateTime);
            updatedOrders = updatedOrders.filter(order => {
                const orderDate = new Date(order?.orderDate);
                return orderDate >= start && orderDate <= end;
            });
        }
        setFilteredOrders(updatedOrders);
        setCurOrderPage(1);
    };

    useEffect(() => {
        filterOrders();
    }, [selectedStatusFilter, searchQuery, startDateTime, endDateTime, orders]);

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? '▲' : '▼';
        }
        return '';
    };

    const formatDateTime1 = (dateTimeString) => {
        if (!dateTimeString) {
            return 'Invalid date';
        }

        try {
            const date = new Date(dateTimeString);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${day}/${month}/${year}`;
        } catch (error) {
            return 'Invalid date';
        }
    };

    return (
        <div className="staffHome">
            {createOrderMessage && (
                <div className="alert alert-success position-fixed top-8 end-0 m-3 z-1000">
                    {createOrderMessage}
                </div>
            )}
            <div className="container">
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
                                        <img style={{ height: "100px" }} src='../logo.jpg' alt="Store Avatar"></img>
                                    </div>
                                    <div className='title-page'>
                                        <h1 className='pbh-title-pdf'>HÓA ĐƠN BÁN VÀNG</h1>
                                    </div>
                                </div>

                                <div className='d-flex'>
                                    <div className='col-7 shop bill-store'>
                                        <h5>Thông tin cửa hàng:</h5>
                                        <h6>DOANH NGHIỆP TƯ NHÂN KIM HOÀN NGÂN</h6>
                                        <h6>Email: <p className='non-bold'>info@kimhoanngan.com</p></h6>
                                        <h6>SĐT: <p className='non-bold'>0939686868</p></h6>
                                        <h6>Mã số thuế: <p className='non-bold'>250299999999</p></h6>
                                        <h6 className='d-flex mb-4'><i className="fas fa-home me-2"></i> <p className='non-bold'>Số 51, đường N6, KCN Mỹ Phước 1, Phường Thới Hoà, thành phố Bến Cát, tỉnh Bình Dương</p></h6>
                                    </div>
                                    <div className='col'>
                                        <h5>Thông tin đơn hàng:</h5>
                                        <h6>Mã đơn hàng: <p className='non-bold'>{curOrder.code}</p></h6>
                                        <h6>Thời gian: <p className='non-bold'>{formatDateTime(curOrder?.orderTime)}</p></h6>
                                        <h6 >Tổng số lượng sản phẩm:  <p className='non-bold'>{numOfProducts || "aaaa"} sản phẩm</p></h6>
                                        <h6 >Tổng tiền: <p className='non-bold'>{numeral(curOrder.total).format(0, 0)} VND</p></h6>
                                    </div>
                                    <div className='col'>
                                        <h5>Thông tin khách hàng:</h5>
                                        <h6>Tên khách hàng: <p className='non-bold'>{curOrder.customer.name || "Khách vãng lai"}</p></h6>
                                        <h6>SĐT khách hàng: <p className='non-bold'>{curOrder.customer.phone}</p></h6>
                                        <h6 >Email: <p className='non-bold'>{curOrder.customer.email}</p></h6>
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
                                                    <td>{orderDetail.product.code}</td>
                                                    <td>{orderDetail.product.name}</td>
                                                    <td>{orderDetail.product?.material?.name}</td>
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
                <h1 className="staffHome-orders fw-bold">DANH SÁCH ĐƠN HÀNG</h1>
                {level === 7 && (
                    <div className="d-flex justify-content-end align-items-end">
                        <Link to="/staff/giao-dich" className="fas fa-cart-plus btn btn-primary btn-create-new-order">
                            <span className="ms-2">Tạo mới đơn hàng</span>
                        </Link>
                    </div>
                )}
                <div className="btn-group mb-3 filter-status-form" role="group">
                    {statusFilters.map(filter => (
                        <button
                            key={filter.key}
                            type="button"
                            className={`btn btn-outline-success ${selectedStatusFilter === filter.key ? 'active' : ''}`}
                            onClick={() => setSelectedStatusFilter(filter.key)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <div className="search-filters">
                    <div className="filter-item">
                        <label htmlFor="nameOrCode" className="form-label">Tìm kiếm</label>
                        <input
                            id="nameOrCode"
                            type="text"
                            className="form-control form-input-search-order"
                            placeholder="Nhập mã đơn hàng hoặc tên khách hàng"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-item">
                        <label htmlFor="startDateTime" className="form-label">Ngày giờ bắt đầu</label>
                        <input
                            type="datetime-local"
                            id="startDateTime"
                            className="form-control"
                            value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)}
                        />
                    </div>
                    <div className="filter-item">
                        <label htmlFor="endDateTime" className="form-label">Ngày giờ kết thúc</label>
                        <input
                            type="datetime-local"
                            id="endDateTime"
                            className="form-control"
                            value={endDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)}
                        />
                    </div>
                    <div className="btn btn-primary clear-filter" onClick={() => { setSearchQuery(""); setStartDateTime(""); setEndDateTime("") }}>
                        <i class="fas fa-window-close"></i>
                    </div>
                </div>
                <table className="staff-orders-table table-striped">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th onClick={() => sortOrders('code')}>
                                Mã đơn hàng {getSortIcon('code')}
                            </th>
                            <th onClick={() => sortOrders('name')}>
                                Tên khách hàng {getSortIcon('name')}
                            </th>
                            <th onClick={() => sortOrders('phoneNumber')}>
                                SĐT khách hàng {getSortIcon('phoneNumber')}
                            </th>
                            <th onClick={() => sortOrders('orderDate')}>
                                Thời gian {getSortIcon('orderDate')}
                            </th>
                            <th onClick={() => sortOrders('total')}>
                                Tổng tiền {getSortIcon('total')}
                            </th>
                            <th onClick={() => sortOrders('status')}>
                                Trạng thái {getSortIcon('status')}
                            </th>
                            <th>
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedOrders.slice((curOrderPage - 1) * pageSize, curOrderPage * pageSize).map((order, index) => (
                            <tr key={order.orderId}>
                                <td>{(curOrderPage - 1) * pageSize + index + 1}</td>
                                <td>{order.code}</td>
                                <td>{order.customer.name || "Khách vãng lai"}</td>
                                <td>{order.customer.phone || ""}</td>
                                <td>{formatDateTime(order?.orderTime)}</td>
                                <td>{numeral(order.total).format("0,0")} VND</td>
                                <td style={{ textAlign: 'center', color: statusColors[order?.status] || 'black' }}>
                                    <p className="ms-2 " style={{ display: 'inline' }}>{order?.status}</p>
                                </td>
                                <td>
                                    <div className="btn-order-detail btn btn-primary" onClick={() => handleViewDetailOrder(order)}>
                                        Xem chi tiết
                                    </div>

                                    <div className="btn-order-detail btn btn-success" onClick={() => handleViewBill(order)}>
                                        Hóa đơn
                                    </div>
                                </td>

                            </tr>
                        ))}
                        {filteredOrders.length <= 0 && (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center' }}>
                                    <p>Chưa có đơn hàng nào</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <nav aria-label="..." className="d-flex float-end staffhome-pagination staffhome-pagination-filter">
                    {renderPagination()}
                </nav>
            </div>
            <div className={`modal-detail ${showDetail ? "open" : ""}`}>
                <div id='orderDetailPDF' className="modal-detail-child ">
                    <div className="modal-detail-header">
                        <div className="modal-detail-child-close" onClick={closeModalDetail}>
                            <i className="fas fa-times-circle"></i>
                        </div>
                        <p>Thông Tin Chi Tiết Đơn Hàng</p>
                    </div>
                    <div className="modal-detail-body dtbd">
                        <div className="modal-detail-body-right dtbdr">
                            <p className="dhdh">Đơn hàng</p>
                            <table className="tbDt ">
                                <thead>
                                    <tr>
                                        <td className="tieuDeMadh">Mã đơn hàng</td>
                                        <td>{curOrder?.code}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="tieuDe ">Thời gian</td>
                                        <td>{formatDateTime(curOrder?.orderTime)}</td>
                                    </tr>
                                    <tr>
                                        <td className="tieuDe">Tổng tiền</td>
                                        <td> {numeral(curOrder?.total).format(0, 0)} VND</td>
                                    </tr>
                                    <tr>
                                        <td className="tieuDe">Trạng thái</td>
                                        <td className={
                                            curOrder?.status === 'Đợi thanh toán' ? 'status-waitingg' :
                                                curOrder?.status === 'Đang thanh toán' ? 'status-payingg' :
                                                    curOrder?.status === 'Đã thanh toán' ? 'status-paidd' :
                                                        curOrder?.status === 'Đã hoàn thành' ? 'status-completedd' :
                                                            curOrder?.status === 'Hủy thanh toán' ? 'status-cancell' :
                                                                ''
                                        }>
                                            {curOrder?.status}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="tieuDe">Nhân viên tư vấn</td>
                                        <td>{curOrder?.saleStaff?.fullName || "Chưa có"}</td>
                                    </tr>
                                    <tr>
                                        <td className="tieuDe">Nhân viên thu ngân</td>
                                        <td>{curOrder?.cashierStaff?.fullName || "Chưa có"}</td>
                                    </tr>
                                    <tr>
                                        <td className="tieuDe">Nhân viên CSKH</td>
                                        <td>{curOrder?.cashierStaff?.fullName || "Chưa có"}</td>
                                    </tr>
                                </tbody >
                            </table >
                            <p className="dhkh">Khách hàng</p>
                            <table className="ttkhct">
                                <thead>
                                    <tr>
                                        <td className="tieuDe">Tên khách hàng</td>
                                        <td>{curOrder?.customer?.name || "Khách vãng lai"}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="tieuDe">Số điện thoại</td>
                                        <td>{curOrder?.customer?.phone || ""}</td>
                                    </tr>
                                    <tr>
                                        <td className="tieuDe">Email</td>
                                        <td>{curOrder?.customer?.email || ""}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div >
                        <div className="modal-detail-body-left mddtl">
                            <p className="dsPrDt">Danh sách sản phẩm</p>
                            <table className="tbDtDt">
                                <thead>
                                    <tr>
                                        <th>Mã sản phẩm</th>
                                        <th>Tên sản phẩm</th>
                                        <th>Số lượng</th>
                                        <th>Loại vàng</th>
                                        <th>Tiền công</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(orderDetails).map((post) => (
                                        <tr key={post.product?.code}>
                                            <td>{post.product?.code || "NA"}</td>
                                            <td>{post.product?.name}</td>
                                            <td>{post.quantity}</td>
                                            <td>{post.product?.material?.name}</td>
                                            <td>{numeral(post.product?.wage).format('0,0')} VND</td>
                                            <td>{numeral(post.product?.price).format('0,0')} VND</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="dhct">
                                {payments.length > 0 && (
                                    <div>
                                        <h6 className="dsdh mt-4">Danh sách thanh toán</h6>
                                        <table className="tbdsdh tbdsdhl">
                                            <thead>
                                                <tr>
                                                    <td className="tieuDe">STT</td>
                                                    <td className="tieuDe">Mã giao dịch</td>
                                                    <td className="tieuDe">Thời gian</td>
                                                    <td className="tieuDe">Phương thức thanh toán</td>
                                                    <td className="tieuDe">Số tiền thanh toán</td>
                                                    <td className="tieuDe">Mã chuyển khoản</td>
                                                    <td className="tieuDe">Ảnh minh chứng</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payments.map((payment, index) => (
                                                    <tr key={payment.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{payment.code}</td>
                                                        <td>{formatDateTime(payment.paymentTime)}</td>
                                                        <td>{payment.type}</td>
                                                        <td >{payment.cash === 0 ? numeral(payment.bank).format(0, 0) : numeral(payment.cash).format(0, 0)} VND</td>
                                                        <td >{payment.bankingCode}</td>
                                                        <td onClick={() => showImgdetail(payment.bankImage)}>
                                                            {payment.bankImage && <img className="img-luan" src={payment.bankImage} alt="N/A" width="100" />}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                                }
                            </div>
                            {warrantyList.length > 0 && (
                                <>
                                    <p className="pbhdhh">Phiếu bảo hành</p>
                                    <table className="pbhdh">
                                        <thead>
                                            <tr>
                                                <td className="tieuDe">STT</td>
                                                <td className="tieuDe">Mã phiếu bảo hành</td>
                                                <td className="tieuDe">Mã sản phẩm</td>
                                                <td className="tieuDe">Tên sản phẩm</td>
                                                <td className="tieuDe">Hạn bảo hành</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {warrantyList.map((post, index) => (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{post.code}</td>
                                                    <td>{post.product.code}</td>
                                                    <td>{post.product.name}</td>
                                                    <td>{formatDateTime1(post.endDate)} </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div>
                </div >
            </div >
            <div className={`modal-detail-img ${showwDetailImg ? "open" : ""}`}>
                <div className="modal-product-close" onClick={() => setShowwDetailImg(false)}>
                    <i className="fas fa-times-circle"></i>
                </div>
                <div className="product-img">
                    <img className="product-img" src={imgDetail} alt="{post.productName}" />
                </div>

            </div>
        </div >
    );
}
