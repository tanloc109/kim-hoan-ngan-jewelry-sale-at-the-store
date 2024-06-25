import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Gold.css";
import config from "../config/config";
import numeral from 'numeral';


function Gold() {
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);

  const [postToUpdate, setPostToUpdate] = useState(null);
  const [goldIdSearch, setGoldIdSearch] = useState("");

  const [tenVang, setTenVang] = useState("");
  const [giaBan, setGiaBan] = useState(0);
  const [giaMua, setgiaMua] = useState(0);
  //------------------------------------------
  const [postToIdUpdate, setPostToIdUpdate] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [updatedPriceSell, setUpdatedPriceSell] = useState("");
  const [updatedPriceBuy, setUpdatedPriceBuy] = useState("");
  const token = localStorage.getItem("token");
  //-------------------------------------------------------------
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [goldNameUpdate, setGoldNameUpdate] = useState("");
  const [goldSellUpdate, setGoldSellUpdate] = useState("");
  const [goldBuyUpdate, setGoldBuyUpdate] = useState("");



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
  const handleDelete = async (roleId) => {
    try {
      await axios.delete(`${config.API_ROOT}/api/GoldTypes/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const response = await axios.get(`${config.API_ROOT}/api/GoldTypes`,
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
      console.error('Xảy ra lỗi khi xóa vai trò!', error);
    }
  };
  //-------------------------------------------

  const handleSearch = async () => {
    try {
      const res = await fetch(`${config.API_ROOT}/api/GoldTypes/get-gold-type-by-name/${goldIdSearch}`,
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
  //------------------------------------------------------------
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${config.API_ROOT}/api/GoldTypes/${postToIdUpdate}`,
        {
          goldName: updatedName || goldNameUpdate,
          buyPrice: updatedPriceBuy || goldBuyUpdate,
          sellPrice: updatedPriceSell || goldSellUpdate,
          status: "active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the specific post in the posts state
      const updatedPosts = posts.map((post) => {
        if (post.goldId === postToIdUpdate) {
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
    closeModalUpdate();

  };

  //------------------------------------------

  useEffect(() => {

    fetch(`${config.API_ROOT}/api/GoldTypes`,
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
  }, [addSuccess, updateSuccess]);

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `${config.API_ROOT}/api/GoldTypes`,
        {
          goldName: tenVang,
          buyPrice: giaBan,
          sellPrice: giaMua,
          status: "active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      closeModal();
      setTenVang("");
      setGiaBan(0);
      setgiaMua(0);

      console.log("Gold created successfully:", response.data);
      setAddSuccess(true);
    } catch (error) {
      console.error("There was an error adding gold!", error);
    }
  };
  const showAddForm = () => {
    setShowModal(true);
  };
  const showAddFormUpdate = () => {
    setShowModalUpdate(true);
  };

 
  const handleEditClick = (post) => {
    setGoldNameUpdate(post.goldName);
    setGoldBuyUpdate(post.buyPrice);
    setGoldSellUpdate(post.sellPrice);
    setPostToIdUpdate(post.goldId);
    handlePostClick(post.goldId);

  };
  const handlePostClick = (post) => {
    showAddFormUpdate();
    setPostToUpdate(post);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const closeModalUpdate = () => {
    setShowModalUpdate(false);
  };
  //-------------------------------------------------------------
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
  //----------------------------------------------------------------
  useEffect(() => {
    handleSearchCustomer()
  }, [goldIdSearch])

  const handleSearchCustomer = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}/api/GoldTypes/get-gold-type-by-name/${goldIdSearch}`, {
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

      <div className="gold">
        <div className={`alert alert-success position-fixed  notify-item-add-success ${addSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Add Gold success
        </div>
        <div className={`alert alert-success position-fixed  notify-item-delete-success ${deleteSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Delete Gold success
        </div>
        <div className={`alert alert-success position-fixed  notify-item-update-success ${updateSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Update Gold success
        </div>
        <div className="title">
          <p>Loại Vàng</p>
        </div>
        <div className="tagResult">
          <div className="tagResultGold">
            <div className="tagChild">
              <i className="fas fa-coins"></i>
            </div>
            <h3>Loại vàng hiện có</h3>
            <p>{postCount} loại vàng</p>
          </div>
        </div>

        <div className="goldDetail">
          <p>Quản lý loại vàng</p>
          <div className="search">
            <input

              type="text"
              name="goldId"
              value={goldIdSearch}
              onChange={(e) => setGoldIdSearch(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <button className="addGold" onClick={showAddForm}>
            <i className="fas fa-plus"></i>
            <p>Tạo Loại Vàng Mới</p>
          </button>

          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã Vàng</th>
                <th>Tên Vàng</th>
                <th>Giá Mua</th>
                <th>Giá Bán</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((post, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{post.goldId}</td>
                  <td>{post.goldName}</td>
                  <td>{numeral(post.buyPrice).format("0,0")} VND</td>
                  <td>{numeral(post.sellPrice).format("0,0")} VND</td>

                  <td>
                    <i className="btn btn-danger fas fa-trash-alt delete" onClick={() => handleDelete(post.goldId)}></i>
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
      <div className={`modal-gold ${showModal ? "open" : ""}`}>
        <div className="modal-gold-child">
          <div className="modal-gold-close" onClick={closeModal}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-gold-headerr">
            <p>Thêm Vàng Mới</p>
          </header>
          <div className="modal-gold-body ">
            <label htmlFor="code" className="modal-gold-label">
              Mã Vàng
            </label>
            <input id="code" type="text" className="modal-gold-input" />
            <label htmlFor="name" className="modal-gold-label">
              Tên Vàng
            </label>
            <input
              id="name"
              type="text"
              className="modal-gold-input"
              name="tenVang"
              value={tenVang}
              onChange={(e) => setTenVang(e.target.value)}
            />
            <label htmlFor="priceSell" className="modal-gold-label">
              Giá Bán
            </label>
            <input
              id="priceSell"
              type="text"
              className="modal-gold-input"
              name="giaBan"
              value={giaBan}
              onChange={(e) => setGiaBan(e.target.value)}
            />
            <label htmlFor="priceBuy" className="modal-gold-label">
              Giá Mua
            </label>
            <input
              id="priceBuy"
              type="text"
              className="modal-gold-input"
              name="giaMua"
              value={giaMua}
              onChange={(e) => setgiaMua(e.target.value)}
            />

            <button id="create-gold" onClick={handleCreate}>
              Tạo
            </button>
          </div>
        </div>
      </div>
      <div className={`modal-gold-update ${showModalUpdate ? "open" : ""}`}>
        <div className="modal-gold-child-update">
          <div className="modal-gold-close-update" onClick={closeModalUpdate}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-gold-headerr-update">
            <p>Cập Nhật Thông Tin Loại Vàng</p>
          </header>
          <div className="modal-gold-body-update ">
            <label htmlFor="name" className="modal-gold-label-update">
              Tên Vàng
            </label>
            <input
              id="name"
              type="text"
              className="modal-gold-input-update"
              name="updatedName"
              value={updatedName || goldNameUpdate}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
            <label htmlFor="priceSell" className="modal-gold-label-update">
              Giá Bán
            </label>
            <input
              id="priceSell"
              type="text"
              className="modal-gold-input-update"
              name="updatedPriceSell"
              value={updatedPriceSell || goldSellUpdate}
              onChange={(e) => setUpdatedPriceSell(e.target.value)}
            />
            <label htmlFor="priceBuy" className="modal-gold-label-update">
              Giá Mua
            </label>
            <input
              id="priceBuy"
              type="text"
              className="modal-gold-input-update"
              name="updatedPriceBuy"
              value={updatedPriceBuy || goldBuyUpdate}
              onChange={(e) => setUpdatedPriceBuy(e.target.value)}
            />

            <button id="create-gold-update" onClick={handleUpdate}>
              Cập Nhật
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Gold;
