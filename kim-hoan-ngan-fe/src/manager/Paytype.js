import React, { useMemo, useState, useEffect } from "react";
import "./Paytype.css";
import config from "../config/config";
import axios from "axios";

// import formatDateTime from "./formatDatetime"
import numeral from 'numeral';

function Paytype() {
  const [posts, setPosts] = useState([]);
  const [donCk, setDonCk] = useState([]);
  const [donTm, setDonTm] = useState([]);
  const [donAll, setDonAll] = useState([]);
  const token = localStorage.getItem("token")

  const [donPriceTm, setPriceDonTm] = useState([]);
  const [donPriceCk, setPriceDonCk] = useState([]);

  //-------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [goldIdSearch, setGoldIdSearch] = useState("");
  const [showImgg, setShowImgg] = useState("");

  const [showDetail, setShowDetail] = useState(false);
  const [checkType, setCheckType] = useState(false);
  const [showwDetailImg, setShowDetailImg] = useState(false);

  const [detail, setDetail] = useState({})

  const [option, setOption] = useState('');
  const [checkOption, setCheckOption] = useState("all");
  const [selectedOption, setSelectedOption] = useState('all');
  const [selectedPaymentType, setSelectedPaymentType] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  // Hàm xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Tính toán vị trí bắt đầu và kết thúc của dữ liệu hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = posts.slice(indexOfFirstItem, indexOfLastItem);

  // Hiển thị số trang
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const sortedItems = useMemo(() => {
    let sortableItems = [...currentItems];
    if (sortConfig.key !== '') {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [currentItems, sortConfig]);
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  const fetchPayments = async () => {
    var url;
    try {
      if (selectedOption === 'all') {
        url = `${config.API_ROOT}/api/Payments`;
      } else {
        url = `${config.API_ROOT}/api/Payments/GetPaymentByOption/option?option=${selectedOption}`;

      }

      console.log('Fetching payments with URL:', url); // Log URL for debugging

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDonTm(response.data.length);
      setDonCk(response.data.length);
      response.data.forEach(item => {

        cash += item.cash;
        bank += item.bankTransfer;

      });
      setPriceDonCk(bank);
      setPriceDonTm(cash);
      setPosts(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error('There was an error when fetching payment data:', error);
    }
  };


  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handlePaymentTypeChange = (type) => {
    setSelectedPaymentType(type);
  };


  useEffect(() => {
    fetchPayments();
  }, [selectedOption, selectedPaymentType]);





  var cash = 0;
  var bank = 0;
  const checkPaytypeByOption = async (selectedOption) => {
    try {
      let url = `${config.API_ROOT}/api/Payments`;
      if (selectedOption !== "all") {
        url = `${config.API_ROOT}/api/Payments/GetPaymentByOption/option?option=${selectedOption}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      setDonTm(response.data.length);
      setDonCk(response.data.length);
      response.data.forEach(item => {

        cash += item.cash;
        bank += item.bankTransfer;

      });
      setPriceDonCk(bank);
      setPriceDonTm(cash);

      setPosts(response.data);

      setCurrentPage(1);
    } catch (error) {
      console.error('There was an error when fetching payment data:', error);
    }
  };
  const checkTypePay = async (selectedOption) => {
    try {
      let url = `${config.API_ROOT}/api/Payments`;
      if (selectedOption !== "all") {
        url = `${config.API_ROOT}/api/Payments/get-payments-by-payment-type/${selectedOption}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      setDonTm(response.data.length);
      setDonCk(response.data.length);
      response.data.forEach(item => {

        cash += item.cash;
        bank += item.bankTransfer;

      });
      setPriceDonCk(bank);
      setPriceDonTm(cash);

      setPosts(response.data);

      setCurrentPage(1);
    } catch (error) {
      console.error('There was an error when fetching payment data:', error);
    }
  };
  // const handleOptionChange = (selectedOption) => {
  //   checkPaytypeByOption(selectedOption);
  //   setCheckOption(selectedOption)
  // };
  const checkCashOrBank = (optionn) => {
    checkTypePay(optionn);
  }

  const showDetailImg = (img) => {
    setShowDetailImg(true);
    setShowImgg(img);

  }
  //---------------------------
  const showDetailForm = (x) => {
    setShowDetail(true);
    setDetail(x);
    if (x.paymentType === "Tiền mặt") {
      setCheckType(false);
    } else {
      if (x.paymentType === "Chuyển khoản") {
        setCheckType(true);
      }
    }
  };
  const closeModalDetail = () => {
    setShowDetail(false)
  }

  //--------------------------------------------
  const formatDateTime = (dateTimeString) => {
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

      return `${hours}:${minutes} ${day}/${month}/${year}`;
    } catch (error) {
      return 'Invalid date';
    }
  };

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-total-price-of-payment-type/cash`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setPriceDonTm(posts);


      });
  }, []);

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-total-price-of-payment-type/bank-transfer`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setPriceDonCk(posts);


      });
  }, []);

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Payments`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setPosts(posts);


      });
  }, []);


  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-number-of-orders-by-payment-type/cash`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setDonTm(posts);


      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-number-of-orders-by-payment-type/bank-transfer`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setDonCk(posts);


      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-number-of-orders-by-payment-type/both`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setDonAll(posts);


      });
  }, []);


  useEffect(() => {
    handleSearchCustomer()
  }, [goldIdSearch])

  const handleSearchCustomer = async () => {
    var url;
    try {
      let url = `${config.API_ROOT}/api/Payments`;
      if (goldIdSearch !== "") {
        console.log(goldIdSearch);
        url = `${config.API_ROOT}/api/Payments/SearchPaymentByPaymentCodeOrOrderCode?searchText=${goldIdSearch}`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('There was an error fetching the customer list!', error);
    }
    console.log(goldIdSearch);

  }
  return (
    <div className="col-10">
      <div className="payType">
        <div className="title">
          <p>Giao Dịch</p>
        </div>
        <div className="tagResultt">
          <div className="tagResultTransfer">
            <div className="tagChild">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <h3>Tiền mặt</h3>
            <h2>{donTm} Giao dịch</h2>
            <p>{numeral(donPriceTm).format("0,0")} VND</p>
          </div>
          <div className="tagResultCash">
            <div className="tagChild">
              <i className="fas fa-qrcode ax"></i>
            </div>
            <h3>Chuyển khoản</h3>
            <h2>{donCk} Giao dịch</h2>
            <p>{numeral(donPriceCk).format("0,0")} VND</p>
          </div>


        </div>
        <div className="detailPay">
          <p>Danh Sách Thanh Toán</p>
          <div className="search">
            <input
              type="text"
              name="goldId"
              value={goldIdSearch}
              onChange={(e) => setGoldIdSearch(e.target.value)}
              placeholder="Tìm Kiếm"
            />
          </div>
          <div className="choose-type-paytype d-flex">
            <div className="btn btn-success btn-all" type="radio" name="option" id="all" onClick={() => handleOptionChange('all')}>Tất cả</div>
            <div className="ms-2 btn btn-success btn-today" type="radio" name="option" id="today" onClick={() => handleOptionChange('today')}>Hôm nay</div>
            <div className="ms-2 btn btn-success btn-thisWeek" type="radio" name="option" id="this-week" onClick={() => handleOptionChange('this-week')}>Tuần này</div>
            <div className="ms-2 btn btn-success btn-thisMonth" type="radio" name="option" id="this-month" onClick={() => handleOptionChange('this-month')}>Tháng này</div>
            <div className="ms-2 btn btn-success btn-thisYear" type="radio" name="option" id="this-year" onClick={() => handleOptionChange('this-year')}>Năm nay</div>
          </div>
          <table className="tablePaytype">
            <thead>
              <tr>
                <th onClick={() => requestSort('paymentCode')}>
                  Mã Thanh Toán {sortConfig.key === 'paymentCode' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('orderCode')}>
                  Mã Đơn Hàng {sortConfig.key === 'orderCode' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('paymentTime')}>
                  Thời Gian {sortConfig.key === 'paymentTime' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('paymentType')}>
                  Phương Thức Thanh Toán {sortConfig.key === 'paymentType' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => requestSort('cash')}>
                  Tổng Tiền {sortConfig.key === 'cash' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </th>



                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan="6">Chưa có bất kỳ đơn hàng nào</td>
                </tr>
              ) : (
                sortedItems.map((post, index) => (
                  <tr key={index}>
                    <td>{post.paymentCode}</td>
                    <td>{post.orders?.orderCode}</td>
                    <td>{formatDateTime(post.paymentTime)}</td>
                    <td>{post.paymentType}</td>
                    <td>{numeral((post.cash) + (post.bankTransfer)).format("0,0")} VND</td>
                    <td>
                      <button className="btn btn-info fas fa-eye eyeDetail" onClick={() => showDetailForm(post)}></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination-l">
            {currentPage > 1 && (
              <button className="btn btn-primary" onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </button>
            )}
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`btn btn-primary ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            {currentPage < totalPages && (
              <button className="btn btn-primary" onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={`modal-detail ${showDetail ? "open" : ""}`}>
        <div className="modal-detail-childd">
          <div className="modal-detail-headerr">
            <div className="btnClPaydt" onClick={closeModalDetail}>
              <i className="fas fa-times-circle"></i>
            </div>
            <p className="ee">Thông Tin Chi Tiết Giao Dịch</p>
          </div>
          <div className="table-container">
            <table className="tablexxx" >
              <thead>
                <tr>
                  <td className="tieuDe">Mã thanh toán </td>
                  <td>{detail.paymentCode}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="tieuDe">Thời gian</td>
                  <td>{formatDateTime(detail.paymentTime)}</td>
                </tr>
                <tr>
                  <td className="tieuDe">Phương thức thanh toán</td>
                  <td>{detail.paymentType}</td>
                </tr>
                {checkType ? (
                  <>
                    <tr>
                      <td className="tieuDe">Số tiền chuyển khoản</td>
                      <td>{numeral(detail.bankTransfer).format("0,0")} VND</td>
                    </tr>
                    <tr>
                      <td className="tieuDe">Mã chuyển khoản</td>
                      <td>{detail.transactionId}</td>
                    </tr>
                    <tr>
                      <td className="tieuDe">Ảnh giao dịch</td>
                      <td onClick={() => showDetailImg(detail.image)} ><img className="paytype-img-detail img-hover" src={detail.image} alt={detail.transactionId} /></td>
                    </tr>
                  </>
                ) : (<><tr>
                  <td className="tieuDe">Số tiền mặt</td>
                  <td>{numeral(detail.cash).format("0,0")} VND</td>
                </tr></>)}
              </tbody>
            </table>

          </div>
        </div>


      </div>
      <div className={`modal-detail-img ${showwDetailImg ? "open" : ""}`}>
        <div className="modal-product-close" onClick={() => setShowDetailImg(false)}>
          <i className="fas fa-times-circle"></i>
        </div>
        <div className="product-img">
          <img className="product-img" src={showImgg} alt="{post.productName}" />
        </div>
      </div>
    </div>
  );
}
export default Paytype;
