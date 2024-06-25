import React, { useState, useEffect } from "react";
import "./Paytype.css";
import config from "../config/config";
import formatDateTime from "./formatDatetime"
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
  //--------------------------------------------

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
  return (
    <div className="col-10">
      <div className="payType">
        <div className="title">
          <p>Thanh Toán Tiền</p>
        </div>
        <div className="tagResultt">
          <div className="tagResultTransfer">
            <div className="tagChild">
              <i className="fas fa-qrcode"></i>
            </div>
            <h3>Chuyển khoản</h3>
            <h2>{donCk} Đơn Hàng</h2>
            <p>{numeral(donPriceCk).format("0,0")} VND</p>
          </div>
          <div className="tagResultCash">
            <div className="tagChild">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <h3>Tiền mặt</h3>
            <h2>{donTm} Đơn Hàng</h2>
            <p>{numeral(donPriceTm).format("0,0")} VND</p>
          </div>

          <div className="tagResultTotal">
            <div className="tagChild">
              <i className="fas fa-list"></i>
            </div>
            <h3>Thanh Toán Kết Hợp</h3>
            <h2>{donAll} Đơn Hàng</h2>
          </div>
        </div>
        <div className="detailPay">
          <p>Danh Sách Thanh Toán</p>
          <div className="combobox">
            <select>
              <option value="" defaultValue disabled>
                Thời gian
              </option>
              <option value="option1">Hôm nay</option>
              <option value="option2">Tuần qua</option>
              <option value="option3">Tháng qua</option>
              <option value="option4">Năm qua</option>
            </select>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã Thanh Toán</th>
                <th>Mã Đơn Hàng</th>
                <th>Thời Gian</th>
                <th>Phương Thức Thanh Toán</th>
                <th>Mã Chuyển Khoản</th>
                <th>Chuyển Khoản</th>
                <th>Tiền Mặt</th>
                <th>Tổng Tiền</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>

              {currentItems.map((post, index) => (

                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{post.paymentId}</td>
                  <td>{post.orderId}</td>
                  <td>{formatDateTime(post.paymentTime)}</td>
                  <td>{post.paymentType}</td>
                  <td>{post.transactionId}</td>
                  <td>{numeral(post.bankTransfer).format("0,0")} VND</td>
                  <td>{numeral(post.cash).format("0,0")} VND</td>
                  <td>{numeral((post.cash) + (post.bankTransfer)).format("0,0")} VND</td>
                  <td>
                    <i className="btn btn-danger fas fa-trash-alt delete"></i>
                    {/* <i className="btn btn-primary fas fa-edit update"></i> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-l">
            {currentPage > 1 && (
              <button className="btn btn-primary" onClick={() => handlePageChange(currentPage - 1)}>
                Back
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
    </div>
  );
}
export default Paytype;
