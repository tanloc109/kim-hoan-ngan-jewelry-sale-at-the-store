import React, { useState, useEffect } from "react";
import "./Warranty.css";
import config from "../config/config";
import numeral from 'numeral';
import formatDateTime from "./formatDatetime"
import axios from "axios";

function Warranty() {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0)
  const [ends, setEnds] = useState([]);
  const [warrantyId, setWarrantyId] = useState("");

  //-------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const token = localStorage.getItem('token');

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
    fetch(`${config.API_ROOT}/api/Warranty`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((posts) => {
        setPosts(posts);
        setPostCount(posts.length);

      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Warranty/GetOutOfDateWarranty`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((ends) => {
        setPosts(ends);
        setPostCount(ends.length);

      });
  }, []);

  //----------------------------------------------------------------
 useEffect(() => {
  handleSearchCustomer()
}, [warrantyId])

const handleSearchCustomer = async () => {
  try {
    const response = await axios.get(`${config.API_ROOT}/api/Warranty/get-warranties-by-id${warrantyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setPosts(response.data)
  } catch (error) {
    console.error('There was an error fetching the customer list!', error);
  }


}
//------------------------------------------------------------------
  return (
    <div className="col-10">
      <div className="warranty">
        <div className="title">
          <p>Báo Cáo Phiếu Bảo Hành</p>
        </div>
        <div className="tagResult">
          <div className="tagResultOut">
            <div className="tagChild">
              <i className="fas fa-expand-arrows-alt"></i>
            </div>
            <h3>Phiếu bảo hành còn hạn</h3>
            <p>30 Phiếu</p>

          </div>

          <div className="tagResulHave">
            <div className="tagChild">
              <i className="fas fa-times-circle"></i>
            </div>
            <h3>Phiếu bảo hành hết hạn</h3>
            <p>2 Phiếu</p>
          </div>

        </div>

        <div className="warrantyDetail">
          <p>Danh sách phiếu bảo hành</p>
          <div className="search">
            <input type="text"
              name="warrantyId"
              value={warrantyId}
              onChange={(e) => setWarrantyId(e.target.value)} />
            <button>Search</button>

          </div>

          <table className="table-warranty">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã Phiếu Bảo Hành</th>
                <th>Mã Đơn Hàng</th>
                <th>Tên Khách Hàng</th>
                <th>Số Điện Thoại</th>
                <th>Email Khách Hàng</th>
                <th>Mã Sản Phẩm</th>
                <th>Tên Sản Phẩm</th>
                <th>Loại Vàng</th>
                <th>Trọng Lượng Vàng</th>
                <th>Tiền Công</th>
                <th>Tổng Tiền</th>
                <th>Ngày Mua</th>
                <th>Ngày Hết Hạn</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((post, index) => (

                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{post?.warrantyId}</td>
                  <td>{post?.orderDetails?.orders.orderId}</td>
                  <td>{post?.customers?.customerName}</td>
                  <td>{post?.customers?.phoneNumber}</td>
                  <td>{post?.customers?.email}</td>
                  <td>{post?.orderDetails?.productId}</td>
                  <td>{post?.orderDetails?.products.productName}</td>
                  <td>{post?.orderDetails?.products.goldTypes.goldName}</td>
                  <td>{numeral(post?.orderDetails?.products.wage).format("0,0")} VND</td>
                  <td>{numeral(post?.orderDetails?.products?.wage).format("0,0")} VND</td>
                  <td>{numeral(post?.orderDetails?.products?.price).format("0,0")} VND</td>
                  <td>{formatDateTime(post?.startDate)}</td>
                  <td>{formatDateTime(post?.endDate)}</td>
                  <td>
                    <div className="btn-group">
                      <i className="btn btn-danger fas fa-trash-alt delete"></i>
                      {/* <i className="btn btn-primary fas fa-edit update"></i> */}
                    </div>
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

        {/* <div className="warrantyOut">
            <p>Phiếu bảo hành hết hạn</p>
            <table className="table">
            <thead>
              <tr>
              <th>STT</th>
                <th>Mã Phiếu Bảo Hành</th>
                <th>Tên Khách Hàng</th>
                <th>Sản Phẩm</th>
                <th>Ngày Mua</th>
                <th>Ngày Hết Hạn</th>
              </tr>
            </thead>
            <tbody>
            {ends?.map((end,index) => (
              
              <tr>
                <td>{index+1}</td>
                <td>{end?.warrantyId}</td>
                <td>{end?.customerId}</td>
                <td>{end?.x}</td>
                <td>{end?.startDate}</td>
                <td>{end?.endDate}</td>
              </tr>
            ))}
            
              
            </tbody>
          </table>

        </div> */}
      </div>
    </div>
  );
}
export default Warranty;
