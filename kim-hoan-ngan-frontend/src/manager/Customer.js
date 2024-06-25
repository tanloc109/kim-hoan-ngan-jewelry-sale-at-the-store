import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Customer.css";
import config from "../config/config";

function Customer() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [postToUpdate, setPostToUpdate] = useState(null);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const [tenKhachHang, setTenKhachHang] = useState("");
  const [sdtKhachHang, setSdtKhachHang] = useState("");
  const [emailKhachHang, setEmailKhachHang] = useState("");

  const [idKhachHangSearch, setIdKhachHangSearch] = useState("");

  const token = localStorage.getItem("token");

  //---------------------------------------------------------------

  const [updatedName, setUpdatedName] = useState("");
  const [updatedPhone, setUpdatedPhone] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");

  const [postToIdUpdate, setPostToIdUpdate] = useState("");
  //-------------------------------------------------------------
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")

  //------------------------------------------------------------
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);


  useEffect(() => {
    setTimeout(() => {
      setAddSuccess(false)
    }, 3000)
  }, [addSuccess])

  useEffect(() => {
    setTimeout(() => {
      setDeleteSuccess(false)
    }, 3000)
  }, [deleteSuccess])

  useEffect(() => {
    setTimeout(() => {
      setUpdateSuccess(false)
    }, 3000)
  }, [updateSuccess])
  //------------------------------------------------------------------
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
  const handleSearch = async () => {
    try {
      const res = await fetch(`${config.API_ROOT}/api/Customer/get-customers-by-phone-number?phone=${idKhachHangSearch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const posts = await res.json();
      setPosts(posts);
      setPostCount(posts.length);
    } catch (error) {
      console.error("Có lỗi khi tìm vàng!", error);
    }
  };
  useEffect(() => {
    handleSearchCustomer()
  }, [idKhachHangSearch])

  const handleSearchCustomer = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}/api/Customer/get-customers-by-phone-number?phone=${idKhachHangSearch}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(response.data)
    } catch (error) {
      console.error('There was an error fetching the customer list!', error);
    }


  }

  const handleDelete = async (customerId) => {
    try {
      await axios.delete(`${config.API_ROOT}/api/Customer/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const response = await axios.get(`${config.API_ROOT}/api/Customer`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setPosts(response.data);
      setPostCount(response.data.length);
      setDeleteSuccess(true);
    } catch (error) {
      console.error('Xảy ra lỗi khi xóa khách hàng!', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${config.API_ROOT}/api/Customer/${postToIdUpdate}`,
        {
          customerName: updatedName || customerName,
          phoneNumber: updatedPhone || customerPhone,
          email: updatedEmail || customerEmail,
          status: "active",
        }
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the specific post in the posts state
      const updatedPosts = posts.map((post) => {
        if (post.categoryId === postToIdUpdate) {
          return response.data;
        } else {
          return post;
        }
      });
      setPosts(updatedPosts);

      setUpdateSuccess(true);
    } catch (error) {
      console.error("There was an error updating the category!", error);
    }
    setEmailKhachHang("");
    setTenKhachHang("");
    setSdtKhachHang("")
    closeModalUpdate();

  };

  const handleEditClick = (post) => {
    showAddFormUpdate();
    setCustomerName(post.customerName);
    setCustomerPhone(post.phoneNumber);
    setCustomerEmail(post.email);
    setPostToIdUpdate(post.customerId);
    handlePostClick(post.customerId);
  };
  const handlePostClick = (post) => {
    showAddFormUpdate();
    setPostToUpdate(post);
  };
  //---------------------------------------------------------------

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Customer`,
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
  }, [addSuccess || updateSuccess]);

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `${config.API_ROOT}/api/Customer`,
        {
          customerName: tenKhachHang,
          phoneNumber: sdtKhachHang,
          email: emailKhachHang,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      closeModal();
      setTenKhachHang("");
      setSdtKhachHang("");
      setEmailKhachHang("");

      console.log("Gold created successfully:", response.data);
      setAddSuccess(true);
    } catch (error) {
      console.error("There was an error adding gold!", error);
    }
  };
  const showAddFormUpdate = () => {
    setShowModalUpdate(true);
  };
 
  const closeModalUpdate = () => {
    setShowModalUpdate(false);
  };

  const showAddForm = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div className="col-10">
      <div className="customer">
        <div className={`alert alert-success position-fixed  notify-item-add-success ${addSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Add customer success
        </div>
        <div className={`alert alert-success position-fixed  notify-item-delete-success ${deleteSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Delete customer success
        </div>
        <div className={`alert alert-success position-fixed  notify-item-update-success ${updateSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Update customer success
        </div>
        <div className="title">
          <p>Quản Lý Khách Hàng</p>
        </div>
        <div className="tagResult">
          <div className="tagResultCustomer">
            <div className="tagChild">
              <i className="fas fa-users"></i>
            </div>
            <h3>Số khách hàng</h3>
            <p>{postCount} Khách hàng</p>
          </div>
        </div>
        <div className="customerDetail">
          <p>Danh sách khách hàng</p>
          <div className="search">
            <input type="text"
              name="idKhachHangSearch"
              value={idKhachHangSearch}
              onChange={(e) => setIdKhachHangSearch(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
          </div>
          <button className="addCustomer js-add-customer" onClick={showAddForm}>
            <i className="fas fa-plus"></i>
            <p className="addCusP">Tạo Mới Khách Hàng</p>
          </button>
          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã Khách Hàng</th>
                <th>Tên Khách Hàng</th>
                <th>Số Điện Thoại</th>
                <th>Email Khách Hàng</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((post, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{post.customerId}</td>
                  <td>{post.customerName}</td>
                  <td>{post.phoneNumber}</td>
                  <td>{post.email}</td>
                  <td>
                    <i className="btn btn-danger fas fa-trash-alt delete" onClick={() => handleDelete(post.customerId)}></i>
                    <i
                      className="btn btn-primary fas fa-edit update ms-2"
                      onClick={() => handleEditClick(post)}
                    ></i>
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

      <div className={`modal ${showModal ? "open" : ""}`}>
        <div className="modal-child">
          <div className="modal-close" onClick={closeModal}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-headerr">
            <p>Tạo Khách Hàng Mới</p>
          </header>
          <div className="modal-body ">
            <label htmlFor="name" className="modal-label">
              Tên Khách Hàng
            </label>
            <input
              id="name"
              type="text"
              className="modal-input"
              name="tenKhachHang"
              value={tenKhachHang}
              onChange={(e) => setTenKhachHang(e.target.value)}
            />
            <label htmlFor="phone" className="modal-label">
              Số Điện Thoại
            </label>
            <input
              id="phone"
              type="text"
              className="modal-input"
              name="sdtKhachHang"
              value={sdtKhachHang}
              onChange={(e) => setSdtKhachHang(e.target.value)}
            />
            <label htmlFor="email" className="modal-label">
              Email
            </label>
            <input
              id="email"
              type="text"
              className="modal-input"
              name="emailKhachHang"
              value={emailKhachHang}
              onChange={(e) => setEmailKhachHang(e.target.value)}
            />

            <button id="create-cus" onClick={handleCreate}>
              Tạo
            </button>
          </div>
        </div>
      </div>

      <div className={`modal-update ${showModalUpdate ? "open" : ""}`}>
        <div className="modal-child-update">
          <div className="modal-close-update" onClick={closeModalUpdate}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-headerr-update">
            <p>Cập Nhật Thông Tin Khách Hàng</p>
          </header>
          <div className="modal-body-update ">
            <label htmlFor="name" className="modal-label-update">
              Tên Khách Hàng
            </label>
            <input
              id="name"
              type="text"
              className="modal-input-update"
              name="updatedName"
              value={updatedName || customerName} 
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <label htmlFor="phone" className="modal-label-update">
              Số Điện Thoại
            </label>
            <input
              id="phone"
              type="text"
              className="modal-input-update"
              name="updatedPhone"
              value={updatedPhone || customerPhone}
              onChange={(e) => setUpdatedPhone(e.target.value)}
            />
            <label htmlFor="email" className="modal-label-update">
              Email
            </label>
            <input
              id="email"
              type="text"
              className="modal-input-update"
              name="updatedEmail"
              value={updatedEmail || customerEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
            />

            <button id="create-cus-update" onClick={handleUpdate}>
              Cập Nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customer;
