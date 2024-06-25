import React, { useState, useEffect } from "react";
import axios from "axios";
import formatDateTime from "./formatDatetime"
import "./Revenue.css";
import config from "../config/config";
import numeral from 'numeral';

function Revenue() {
  const [today, setToday] = useState([]);
  const [week, setWeek] = useState([]);
  const [month, setMonth] = useState([]);
  const [year, setYear] = useState([]);
  const [xs, setXs] = useState([]);
  const [postCountToday, setPostCountToday] = useState(0);
  const [postCountWeek, setPostCountWeek] = useState(0);
  const [postCountYear, setPostCountYear] = useState(0);
  const [postCountMonth, setPostCountMonth] = useState(0);

  const [priceYear, setPriceYear] = useState([]);
  const [priceMonth, setPriceMonth] = useState([]);
  const [priceWeek, setPriceWeek] = useState([]);
  const [priceDay, setPriceDay] = useState([]);

  const [selectedOption, setSelectedOption] = useState("");
  const token = localStorage.getItem("token");


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
  const currentItems = xs.slice(indexOfFirstItem, indexOfLastItem);

  // Hiển thị số trang
  const totalPages = Math.ceil(xs.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  //--------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      const todayResponse = await fetch(
        `${config.API_ROOT}/api/Orders/get-orders/today`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const todayData = await todayResponse.json();
      setToday(todayData);
      setPostCountToday(todayData.length);
      const weekResponse = await fetch(
        `${config.API_ROOT}/api/Orders/get-orders/this-week`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const weekData = await weekResponse.json();
      setWeek(weekData);
      setPostCountWeek(weekData.length);

      const monthResponse = await fetch(
        `${config.API_ROOT}/api/Orders/get-orders/this-month`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const monthData = await monthResponse.json();
      setMonth(monthData);
      setPostCountMonth(monthData.length);

      const yearResponse = await fetch(
        `${config.API_ROOT}/api/Orders/get-orders/this-year`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const yearData = await yearResponse.json();
      setYear(yearData);
      setPostCountYear(yearData.length);
    };

    fetchData();
  }, []);
  var xxx;
  const check = (selectedOption) => {
    setSelectedOption(selectedOption);
    switch (selectedOption) {
      case "option1":
        setXs(today);
        break;
      case "option2":
        setXs(week);
        break;
      case "option3":
        setXs(month);
        break;
      case "option4":
        setXs(year);
        break;
      default:
        setXs([]);
    }
  };
  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`${config.API_ROOT}/api/Orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      let response;
      if (selectedOption === "option1") {
        response = await axios.get(`${config.API_ROOT}/api/Orders/get-orders/today`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPostCountToday(response.data.length);
      } else if (selectedOption === "option2") {
        response = await axios.get(`${config.API_ROOT}/api/Orders/get-orders/this-week`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPostCountWeek(response.data.length);
      } else if (selectedOption === "option3") {
        response = await axios.get(`${config.API_ROOT}/api/Orders/get-orders/this-month`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPostCountMonth(response.data.length);
      } else if (selectedOption === "option4") {
        response = await axios.get(`${config.API_ROOT}/api/Orders/get-orders/this-year`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPostCountYear(response.data.length);
      }

      if (response && response.data) {
        setXs(response.data);
      } else {
        console.error("No data received from server");
      }
      console.log("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      console.error("Xảy ra lỗi khi xóa vai trò!", error);
    }
  };

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-total-price-of-orders/this-year`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((xxxx) => {
        setPriceYear(xxxx);
      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-total-price-of-orders/this-month`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((eee) => {
        setPriceMonth(eee);
      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-total-price-of-orders/this-week`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((qqq) => {
        setPriceWeek(qqq);
      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Orders/get-total-price-of-orders/today`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((zzz) => {
        setPriceDay(zzz);
      });
  }, []);
  var total = 0;
  return (
    <div className="col-10 ">
      <div className="revenue">
        <div className="title">
          <p>Doanh Thu</p>
        </div>
        <div className="tagResult">
          <div className="tagResultToday">
            <div className="tagChild">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <h3>Hôm nay</h3>
            <h2>{postCountToday} Đơn Hàng</h2>
            <p>{numeral(priceDay).format("0,0")} VND</p>
          </div>
          <div className="tagResultWeek">
            <div className="tagChild">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <h3>Tuần này</h3>
            <h2>{postCountWeek} Đơn Hàng</h2>
            <p>{numeral(priceWeek).format("0,0")} VND</p>
          </div>
          <div className="tagResultMonth">
            <div className="tagChild">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <h3> Tháng này</h3>
            <h2>{postCountMonth} Đơn Hàng</h2>
            <p>{numeral(priceMonth).format("0,0")} VND</p>
          </div>
          <div className="tagResultYear">
            <div className="tagChild">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <h3> Năm này</h3>
            <h2>{postCountYear} Đơn Hàng</h2>
            <p>{numeral(priceYear).format("0,0")} VND</p>
          </div>
        </div>
        <div className="detailOrder">
          <p>Danh sách đơn hàng</p>
          <div className="combobox">
            <select onChange={(e) => check(e.target.value)}>
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
                <th>Mã Đơn Hàng</th>
                <th>Thời Gian</th>
                <th>Khách Hàng</th>
                <th>Số Điện Thoại</th>
                <th>Email Khách Hàng</th>
                <th>Người Tạo Đơn</th>
                <th>Người Thanh Toán</th>
                <th>Người Lấy Hàng</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((x, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{x.orderId}</td>
                  <td>{formatDateTime(x.orderDate)}</td>
                  <td>{x.customers.customerName}</td>
                  <td>{x.customers.phoneNumber}</td>
                  <td>{x.customers.email}</td>
                  <td>{x.users.fullName}</td>
                  <td>{x.cashierId}</td>
                  <td>{x.servicerId}</td>
                  <td>{numeral(x.total).format("0,0")} VND</td>
                  <td>{x.status}</td>
                  <td>
                    <i
                      className="btn btn-danger fas fa-trash-alt delete"
                      onClick={() => handleDelete(x.orderId)}
                    ></i>
                    {/* <i className="btn btn-primary fas fa-edit update"></i> */}
                  </td>
                </tr>
              ))}
              {/* <tr>
                <td colSpan={9}>Total:</td>
                <td>{xs.reduce((total, x) => total + x.total, 0)}</td>
              </tr>  */}
            </tbody>
          </table>
          <div className="pagination pagination-l">
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

export default Revenue;
