import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './CreateOrder.css';
import numeral from 'numeral';
import { Link, useNavigate } from "react-router-dom";
import './CreateCustomer.css';
import './ProductDetail.css';
import config from '../config/config.js';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';
import "./BarcodeScanner.css"

function CreateOrder() {
    var numOfItems = 0;
    var total = 0;
    const [totalPriceStones, setTotalPriceStones] = useState(0);
    const navigate = useNavigate();
    const [idOrName, setIdOrName] = useState("");
    const [customerPhone, setCustomerPhone] = useState('');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [card, setCard] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [popupProduct, setPopupProduct] = useState(false);
    const [curProductPage, setCurProductPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(1);
    const [createCustomerMessage, setCreateCustomerMessage] = useState('');
    const pageSize = 6;
    const token = localStorage.getItem('token');
    const [customers, setCustomers] = useState([]);
    const [noProductMessage, setNoProductMessage] = useState('');
    const webcamRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [selectedProduct, setSelectedProduct] = useState({});
    const [primaryStone, setPrimaryStone] = useState({});

    const [customerInfo, setCustomerInfo] = useState({
        customerName: '',
        phoneNumber: '',
        email: '',
    });

    useEffect(() => {
        if (products.length > 0) {
            setNoProductMessage('');
        } else {
            setNoProductMessage('Không có sản phẩm nào phù hợp');
        }
    }, [products])

    const addCustomerDone = () => {
        setCreateCustomerMessage('Đã thêm thông tin khách hàng thành công');
    }

    const togglePopup = () => {
        setShowPopup(!showPopup);
        setCustomerInfo({})
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCustomerInfo({ ...customerInfo, [name]: value });
    };

    const handleSubmit = (event) => {
        createCustomer();
        event.preventDefault();
        setShowPopup(false);
    };

    const createCustomer = async () => {
        try {
            const response = await axios.post(`${config.API_ROOT}/api/Customer`, {
                customerName: customerInfo.name,
                email: customerInfo.email,
                phoneNumber: customerInfo.phone,
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setCustomer({
                customerName: customerInfo.name,
                email: customerInfo.email,
                phoneNumber: customerInfo.phone,
            });
            setCustomerInfo({})
        } catch (error) {
            console.error('There was an error adding customer!', error);
        }
    };


    useEffect(() => {
        axios.get(`${config.API_ROOT}/api/Category`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setCategories(response.data);
                if (response.data.length > 0) {
                }
            })
            .catch(error => {
                console.error('There was an error fetching the categories!', error);
            });
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${config.API_ROOT}/api/Cart/items`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCard(response.data);
        } catch (error) {
            console.error('There was an error fetching the cart!', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [card.length])

    const handleAddToCart = (product) => {
        axios.post(`${config.API_ROOT}/api/Cart/add`,
            {
                productId: product.productId,
                quantity: 1
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
                fetchData();
            })
            .catch(error => {
                console.error('There was an error adding the product to the cart!', error);
            });

    };


    const removeFromCart = async (productId) => {
        try {
            const response = await axios.delete(`${config.API_ROOT}/api/Cart/remove/${productId}?quantity=1`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchData();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error('Bad request. Invalid data or missing required fields.');
            } else {
                console.error('There was an error removing the product from the cart:', error);
            }
        }
    };

    const handleCheckOut = () => {
        axios.post(`${config.API_ROOT}/api/Cart/checkout`,
            {

                phoneNumberCustomer: `${customer.phoneNumber}`
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
                localStorage.setItem('createOrderMessage', "Bạn đã tạo đơn hàng mới thành công")
                navigate('/staff/trang-chu-nv');
            })
            .catch(error => {
                console.error('There was an error adding the product to the checkout!', error);
            });
    };

    const fetchCustomer = async () => {
        try {
            const response = await axios.get(`${config.API_ROOT}/api/Customer/get-customer-by-phone-number?phone=${customerPhone}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCustomer(response.data);
            setCustomerPhone('');
        } catch (error) {
            console.error('There was an error fetching the customer!', error);
        }
    };

    useEffect(() => {
        fetchCustomerListSearch();
        if (customerPhone.length === 0) {
            setCustomers([]);
        }
    }, [customerPhone]);

    useEffect(() => {
        fetchCustomerListSearch();
        if (customerPhone.length == 10) {
            fetchCustomer();
        }
        if (customerPhone.length === 0) {
            setCustomers([]);
        }
    }, [customerPhone]);

    const fetchCustomerListSearch = async () => {
        if (customerPhone.length > 0 && customerPhone.length < 10) {
            try {
                const response = await axios.get(`${config.API_ROOT}/api/Customer/get-customers-by-phone-number?phone=${customerPhone}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCustomers(response.data.slice(0, 3));
            } catch (error) {
                console.error('There was an error fetching the customer list!', error);
            }
        }
    };

    const searchProduct = async () => {
        try {
            setActiveCategory(null);
            const response = await axios.get(`${config.API_ROOT}/api/Product?filterOn=name&filterQuery=${idOrName}&pageNumber=${curProductPage}&pageSize=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(response.data);

            const response2 = await axios.get(`${config.API_ROOT}/api/Product?filterOn=name&filterQuery=${idOrName}&pageNumber=1&pageSize=1000`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTotalProducts(response2.data.length);
        } catch (error) {
            console.error('There was an error fetching the products!', error);
        }
    };

    useEffect(() => {
        searchProduct();
    }, [idOrName]);

    useEffect(() => {
        if (activeCategory != null) {
            fetchProductData(activeCategory);
        } else {
            searchProduct();
        }
    }, [curProductPage]);


    const handleClickCategory = (categoryId) => {
        setActiveCategory(categoryId);
        setCurProductPage(1);
    };

    const fetchProductData = async (categoryId) => {
        try {
            const response = await axios.get(`${config.API_ROOT}/api/Product?filterOn=CategoryId&filterQuery=${categoryId}&pageNumber=${curProductPage}&pageSize=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(response.data);

            const totalResponse = await axios.get(`${config.API_ROOT}/api/Product?filterOn=CategoryId&filterQuery=${categoryId}&pageNumber=1&pageSize=1000`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTotalProducts(totalResponse.data.length);
        } catch (error) {
            console.error('There was an error fetching the products by category!', error);
        }
    };

    useEffect(() => {
        if (activeCategory !== null) {
            fetchProductData(activeCategory);
        }
    }, [activeCategory]);


    const handlePageChange = (newPage) => {
        setCurProductPage(newPage);
    };

    const handleViewDetailIncard = async (id) => {
        axios.get(`${config.API_ROOT}/api/Product/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    setSelectedProduct(response.data);
                    setPopupProduct(true);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the product!', error);
            });

    }

    const renderPagination = () => {
        const totalPages = Math.ceil(totalProducts / pageSize);
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i} className={`page-item ${i === curProductPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
                </li>
            );
        }

        return (
            totalPages > 1 &&
            <ul className="pagination staffhome-panationing">
                <li className={`page-item ${curProductPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(curProductPage - 1)}>Previous</button>
                </li>
                {pages}
                <li className={`page-item ${curProductPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(curProductPage + 1)}>Next</button>
                </li>
            </ul>
        );
    };

    useEffect(() => {
        setTimeout(() => {
            setCreateCustomerMessage('');
        }, 3000);
    }, [createCustomerMessage]);

    const handleChooseCustomer = (customerChoose) => {
        setCustomer(customerChoose);
        setCustomerPhone('');
        setCustomers([]);
    }

    const startScan = () => {
        setScanning(true);
    };

    const handleScan = async () => {
        if (!scanning) return;
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            try {
                const code = await decodeBarcode(imageSrc);
                if (code) {
                    setBarcode(code);
                    await addToCart(code);
                    setScanning(false);
                }
            } catch (error) {
                console.error('Barcode decoding failed', error);
            }
        }
    };

    const decodeBarcode = async (imageSrc) => {
        const codeReader = new BrowserMultiFormatReader();
        try {
            const result = await codeReader.decodeFromImage(undefined, imageSrc);
            return result.text;
        } catch (error) {
            return null;
        }
    };

    const addToCart = async (code) => {
        axios.post(`${config.API_ROOT}/api/Cart/add`,
            {
                productId: code,
                quantity: 1
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
                fetchData();
            })
            .catch(error => {
                console.error('There was an error adding the product to the cart!', error);
            });

    };

    useEffect(() => {
        let interval;
        if (scanning) {
            interval = setInterval(handleScan, 300); // Quét mỗi 300ms
        } else if (interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [scanning]);

    const closeScan = () => {
        setScanning(false);
    }

    const handleProductDetail = (product) => {
        setPopupProduct(true)
        setSelectedProduct(product);
        product.stones.map(stone => {
            if (stone.isPrimary) {
                setPrimaryStone(stone);
            }
            setTotalPriceStones(previous => previous + stone.price);
        })
    }

    return (
        <div className="container-fluid order ">
            {createCustomerMessage && (
                <div className="alert alert-success position-fixed top-8 end-0 m-3">
                    {createCustomerMessage}
                </div>

            )}
            <div className="row ">
                <div className="col-2 sidebar-order">
                    <div className="order-category text-center">
                        DANH MỤC
                    </div>
                    <ul className="category-list">
                        {categories.map((category) => (
                            <li
                                key={category.categoryId}
                                className={`category-item ${activeCategory === category.categoryId ? 'sidebar-active' : ''}`}
                                onClick={() => handleClickCategory(category.categoryId)}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-7 san-phamb vertical-line">
                    <div className="text-center  san-pham">
                        <h3 className="order-category">SẢN PHẨM</h3>
                        <div className="d-flex">
                            <div className="search-form d-flex align-items-center div-search">
                                <input className="input-search form-control min-width-100vh" type="text" placeholder="Nhập mã hoặc tên sản phẩm để tìm sản phẩm..." name="idOrName" value={idOrName} onChange={(e) => setIdOrName(e.target.value)} />
                                <i type="submit" className="btn btn-search" onClick={searchProduct}>
                                    <i className="fas fa-search"></i>
                                </i>
                            </div>
                            <i className="fas fa-filter btn btn-info btn-filter"></i>
                            <i className="fas fa-barcode btn btn-primary ms-2" onClick={startScan}></i>
                        </div>
                        <div className="product-list d-flex">
                            {noProductMessage && <div className='noProduct mt-8'>
                                {noProductMessage}
                            </div>}
                            {products?.map((product) => (
                                <div className="card product-item" key={product.productId}>
                                    <div className="link-xem-chi-tiet-san-pham" onClick={() => handleProductDetail(product)}>
                                        <img className="card-img-top img-product-item" src="https://storageimageazure.blob.core.windows.net/paymentcontainer/nhan-cuoi.jpg" alt={product.productName} />
                                    </div>
                                    <div className="card-body">
                                        <div className="link-xem-chi-tiet-san-pham" onClick={() => handleProductDetail(product)}>
                                            <h5 className="card-title product-name fw-bold">{product.productName}</h5>
                                            <h5 className="card-title product-id">{product.productId}</h5>
                                            <h6 className="product-price fw-bold">{numeral(product.price).format("0,0")} VND</h6>
                                        </div>
                                        <div className="text-center">
                                            <button className="btn btn-primary" onClick={() => handleAddToCart(product)}>
                                                <i className="fas fa-cart-plus margin-right"></i>
                                                Thêm vào đơn hàng
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                        {popupProduct && <div className='out-product-popup'>
                            <div className="row product-detail-popup">
                                <div className="col-5">
                                    <div className="product-detail-img">
                                        <img className="product-detail-picture" src="https://ngoctham.com/wp-content/uploads/2023/09/nhan-nu-vang-18k-dvnutvv0100q776-ntj-01-1800x2025.jpg" alt="product.productName" />
                                    </div>
                                </div>
                                <div className="col-7 product-info">
                                    <div className="off-popup" onClick={() => { setPopupProduct(false) && setSelectedProduct({}) && setTotalPriceStones(0) }}>
                                        <i className="far fa-times-circle btn btn-danger btn-off-popup"></i>
                                    </div>
                                    <div className="d-flex align-items-center detail-info">
                                        <div className="product-info-detail">
                                            <span className="fw-bold">Tên sản phẩm: </span> <span className='product-detail-name'>{selectedProduct.productName}</span><br />
                                            <span className="fw-bold">Mã sản phẩm:</span> <span> {selectedProduct.productId}</span><br />
                                            <span className="fw-bold">Loại vàng:</span> <span> {selectedProduct.goldTypes.goldName}</span><br />
                                            <span className="fw-bold">Trọng lượng vàng:</span> <span> {selectedProduct.goldWeight}</span><br />
                                            <span className="fw-bold">Đá chính:</span> <span>{primaryStone.name}</span><br />
                                            <span className="fw-bold">Màu đá chính:</span> <span> {primaryStone.color}</span><br />
                                            <span className="fw-bold">Tiền đá:</span> <span> {numeral(totalPriceStones).format(0, 0)} VND</span><br />
                                            <span className="fw-bold">Tiền công:</span><span> {numeral(selectedProduct.wage).format(0, 0)} VND</span><br />
                                            <span className="fw-bold">Số lượng:</span><span> {selectedProduct.quantity}</span><br />
                                            <span className="fw-bold">Tổng tiền:</span> <span className='product-detail-name'> {numeral(selectedProduct.price).format(0, 0)} VND</span><br />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>}
                        <nav aria-label="..." className="pagination-order position-absolute end-0 ">
                            {renderPagination()}
                        </nav>
                    </div>
                </div>
                <div className="col-3 don-hang">
                    <div className="">
                        <h3 className="order-category text-center">ĐƠN HÀNG</h3>
                        <div className="d-flex div-search">
                            <form className="search-form d-flex align-items-center search-customer">
                                <input className="input-search form-control"
                                    name="customerPhone"
                                    type="text"
                                    placeholder="Nhập sđt để tìm khách hàng ..."
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                />
                                <i className="btn btn-search" onClick={fetchCustomer}>
                                    <i className="fas fa-search"></i>
                                </i>
                            </form>
                            <button className="fas fa-user-plus btn btn-primary d-flex align-items-center justify-content-center add-cus" onClick={togglePopup}></button>
                            {showPopup && <div className="popup">
                                <div className="popup-content">
                                    <h2>Thêm thông tin khách hàng</h2>
                                    <form onSubmit={handleSubmit}>
                                        <div className="input-group">
                                            <label htmlFor="name">Tên:</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={customerInfo.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="email">Email:</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={customerInfo.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="phone">Số điện thoại:</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={customerInfo.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="nutbam text-center">
                                            <button type="submit" className='btn btn-success' onClick={addCustomerDone}>Lưu</button>

                                            <button className="btn btn-danger close-button" onClick={togglePopup}>Hủy bỏ</button>
                                        </div>
                                    </form>
                                </div>
                            </div>}
                        </div>
                        <>
                            {customers.length > 0 && (
                                <ul className="results-list">
                                    Thông tin khách hàng phù hợp:
                                    {customers.map((customerSearch) => (
                                        <li className='position-relative' key={customerSearch.customerId}>
                                            {customerSearch.customerName} - {customerSearch.phoneNumber}
                                            <i className="fas fa-plus-circle position-absolute top-0 end-0 m-1 btn btn-success p-2" onClick={() => handleChooseCustomer(customerSearch)}></i></li>
                                    ))}
                                </ul>
                            )}

                        </>
                        <div className="cus-info">
                            <h5 className="fw-bold">Thông tin khách hàng: </h5>
                            <span className="cus-name fw-bold">Tên khánh hàng: </span> <span>{customer?.customerName}</span> <br />
                            <span className="cus-name fw-bold">Số điện thoại: </span> <span>{customer?.phoneNumber}</span><br />
                            <span className="cus-name fw-bold">Email: </span> <span>{customer?.email}</span> <br />
                        </div>
                        <div className="order-info">
                            <h5 className="fw-bold">Thông tin đơn hàng:</h5>
                            <div className="order-product-list">
                                {card.map((item, index) => (
                                    <div className="order-item d-flex" key={index}>
                                        <img className="img-product" src="https://storageimageazure.blob.core.windows.net/paymentcontainer/nhan-cuoi.jpg" alt="Product" onClick={() => handleViewDetailIncard(item.productId)} />
                                        <div className="product-info">
                                            <h5>{item.productName}</h5>
                                            <div className="price-quantity d-flex">
                                                <h6 className="">{numeral(item.subTotal / item.quantity).format("0,0")} VND</h6>
                                                <div className="quantity-controls">
                                                    <span>SL: </span>
                                                    <button className="btn btn-sm" onClick={() => removeFromCart(item.productId)}>-</button>
                                                    <span className="quantity">{item.quantity}</span>
                                                    <button className="btn btn-sm" onClick={() => handleAddToCart(item)}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {card.map((item) => {
                                numOfItems = numOfItems + item.quantity;
                                total = total + item.subTotal
                            })}
                            <div className="tong-sl d-flex">
                                <h6 className="sl-text fw-bold">Tổng số lượng sản phẩm: </h6>
                                <h6 className="sl-num">{numOfItems}</h6>
                            </div>
                            <div className="tong-tien d-flex">
                                <h6 className="tien-text fw-bold">Tổng tiền: </h6>
                                <h6 className="tien-num">{numeral(total).format("0,0")} VNĐ</h6>
                            </div>
                            <div className="text-center nut-order">
                                <Link to="/staff/trang-chu-nv" className="btn btn-danger btn-order huy-bo-order fw-bold">Hủy bỏ</Link>
                                <button className="btn btn-success btn-order fw-bold" onClick={handleCheckOut}>Tạo đơn hàng</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {scanning &&
                <div className='out-video'>
                    <div className='scan-barcode'>
                        <div className='d-flex header-scan'>
                            <h3>Đang quét mã vạch ...</h3>
                            <i className="fas fa-window-close btn btn-danger close-video" onClick={closeScan}></i>
                        </div>
                        <br />
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={640}
                            height={480}
                            className='video-scanner'
                        />
                    </div>
                </div>}
        </div >
    );
}

export default CreateOrder;
