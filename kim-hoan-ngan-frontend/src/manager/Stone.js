import React, { useState, useEffect } from "react";
import axios from "axios";
import numeral from 'numeral';

import "./Stone.css";
import config from "../config/config";
function Stone() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState(null);
  const [goldIdSearch, setGoldIdSearch] = useState("");
  const [tenDa, setTenDa] = useState("");
  const [loaiDa, setLoaiDa] = useState("");
  const [giaDa, setGiaDa] = useState(0);
  const [mauDa, setMauDa] = useState("");
  const [daChinh, setDaChinh] = useState("");
  const [idProduct, setIdProduct] = useState("");


  const [postToIdUpdate, setPostToIdUpdate] = useState("");
  const [tenDaUpdate, setTenDaUpdate] = useState("");
  const [loaiDaUpdate, setLoaiDaUpdate] = useState("");
  const [giaDaUpdate, setGiaDaUpdate] = useState(0);
  const [mauDaUpdate, setMauDaUpdate] = useState("");
  const [daChinhUpdate, setDaChinhUpdate] = useState("");
  const [idProductUpdate, setIdProductUpdate] = useState("");

  const token = localStorage.getItem("token");
  //-------------------------------------------------------------
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [stoneName, setStoneName] = useState("");
  const [stoneType, setStoneType] = useState("");
  const [stonePrice, setStonePrice] = useState("");
  const [stoneColor, setStoneColor] = useState("");
  const [stoneProductId, setStoneProductid] = useState("");
  const [stoneIsPrimary, setStoneIsPrimary] = useState("");




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

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${config.API_ROOT}/api/Stones/${postToIdUpdate}`,
        {
          productId: stoneProductId,
          name: tenDaUpdate,
          type: loaiDaUpdate,
          price: giaDaUpdate,
          color: mauDaUpdate,
          status: "active",
          isPrimary: stoneIsPrimary,
        },
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
    closeModalUpdate();
  };
  const handleSearch = async () => {
    try {
      const res = await fetch(`${config.API_ROOT}/api/Stones/get-stones-by-name${goldIdSearch}`,
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
  const handleDelete = async (roleId) => {
    try {
      await axios.delete(
        `${config.API_ROOT}/api/Stones/${roleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const response = await axios.get(
        `${config.API_ROOT}/api/Stones`,
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
      console.error("Xảy ra lỗi khi xóa vai trò!", error);
    }
  };

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Stones`,
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

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `${config.API_ROOT}/api/Stones`,
        {
          productId: idProduct,
          name: tenDa,
          type: loaiDa,
          price: giaDa,
          color: mauDa,
          isPrimary: daChinh,
          // status: "active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTenDa("");
      setGiaDa(0);
      setLoaiDa(0);
      setMauDa("");

      console.log("Stone created successfully:", response.data);
      setAddSuccess(true);
    } catch (error) {
      console.error("There was an error adding stone!", error);
      closeModal();
    }
  };
  const showAddFormUpdate = () => {
    setShowModalUpdate(true);
  };
  const handlePostClick = (post) => {
    showAddFormUpdate();
    setPostToUpdate(post);
  };

  const handleEditClick = (post) => {
    showAddFormUpdate();
    setStoneName(post.name);
    setStoneType(post.type);
    setStoneColor(post.price);
    setStonePrice(post.price);
    setStoneProductid(post.productId);
    setStoneIsPrimary(post.isPrimary);
    setPostToIdUpdate(post);
    handlePostClick(post.stoneId);
  };
  const showAddForm = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const closeModalUpdate = () => {
    setShowModalUpdate(false);
  };
  //----------------------------------------------------------------
  useEffect(() => {
    handleSearchCustomer()
  }, [goldIdSearch])

  const handleSearchCustomer = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}/api/Stones/get-stones-by-name${goldIdSearch}`, {
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
      <div className="stone">
        <div className={`alert alert-success position-fixed  notify-item-add-success ${addSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Add stone success
        </div>
        <div className={`alert alert-success position-fixed  notify-item-delete-success ${deleteSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Delete stone success
        </div>
        <div className={`alert alert-success position-fixed  notify-item-update-success ${updateSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Update stone success
        </div>
        <div className="title">
          <p>Đá Quý</p>
        </div>
        <div className="tagResult">
          <div className="tagResultStone">
            <div className="tagChild">
              <i className="far fa-gem"></i>
            </div>
            <h3>Đá hiện có</h3>
            <p>{postCount} loại đá</p>
          </div>
        </div>

        <div className="stoneDetail">
          <p>Quản lý đá</p>
          <div className="search">
            <input type="text"
              name="goldId"
              value={goldIdSearch}
              onChange={(e) => setGoldIdSearch(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
          </div>
          <button className="addStone" onClick={showAddForm}>
            <i className="fas fa-plus"></i>
            <p>Thêm Đá Mới</p>
          </button>

          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã Đá</th>
                <th>Tên Đá</th>
                <th>Loại Đá</th>
                <th>Màu Đá</th>
                <th>Giá</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((post, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{post.stoneId}</td>
                  <td>{post.name}</td>
                  <td>{post.type}</td>
                  <td>{post.color}</td>
                  <td>{numeral(post.price).format("0,0")} VND</td>
                  <td>
                    <i
                      className="btn btn-danger fas fa-trash-alt delete"
                      onClick={() => handleDelete(post.stoneId)}
                    ></i>
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
      <div className={`modal-stone ${showModal ? "open" : ""}`}>
        <div className="modal-stone-child">
          <div className="modal-stone-close" onClick={closeModal}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-stone-headerr">
            <p>Thêm Đá Mới</p>
          </header>
          <div className="modal-stone-body ">
            <label htmlFor="name" className="modal-stone-label">
              Tên Đá
            </label>
            <input
              id="name"
              type="text"
              className="modal-stone-input"
              name="tenDa"
              value={tenDa}
              onChange={(e) => setTenDa(e.target.value)}
            />
            <label htmlFor="type" className="modal-stone-label">
              Loại Đá
            </label>
            <input
              id="type"
              type="text"
              className="modal-stone-input"
              name="loaiDa"
              value={loaiDa}
              onChange={(e) => setLoaiDa(e.target.value)}
            />
            <label htmlFor="price" className="modal-stone-label">
              Giá
            </label>
            <input
              id="price"
              type="text"
              className="modal-stone-input"
              name="giaDa"
              value={giaDa}
              onChange={(e) => setGiaDa(e.target.value)}
            />
            <label htmlFor="color" className="modal-stone-label">
              Màu Đá
            </label>
            <input
              id="color"
              type="text"
              className="modal-stone-input"
              name="mauDa"
              value={mauDa}
              onChange={(e) => setMauDa(e.target.value)}
            />

            <label htmlFor="isPrimary" className="modal-stone-label">
              Đá Chính
            </label>
            <input
              id="isPrimary"
              type="text"
              className="modal-stone-input"
              name="daChinh"
              value={daChinh}
              onChange={(e) => setDaChinh(e.target.value)}
            />
            <label htmlFor="idProduct" className="modal-stone-label">
              Id Product
            </label>
            <input
              id="idProduct"
              type="text"
              className="modal-stone-input"
              name="idProduct"
              value={idProduct}
              onChange={(e) => setIdProduct(e.target.value)}
            />

            <button id="create-stone" onClick={handleCreate}>
              Tạo
            </button>
          </div>
        </div>
      </div>

      <div className={`modal-stone-update ${showModalUpdate ? "open" : ""}`}>
        <div className="modal-stone-child-update">
          <div className="modal-stone-close-update" onClick={closeModalUpdate}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-stone-headerr-update">
            <p>Cập Nhật Thông Tin Loại Đá</p>
          </header>
          <div className="modal-stone-body-update ">
            <label htmlFor="name" className="modal-stone-label-update">
              Tên Đá
            </label>
            <input
              id="name"
              type="text"
              className="modal-stone-input-update"
              name="tenDaUpdate"
              value={tenDaUpdate || stoneName}
              onChange={(e) => setTenDaUpdate(e.target.value)}
            />
            <label htmlFor="type" className="modal-stone-label-update">
              Loại Đá
            </label>
            <input
              id="type"
              type="text"
              className="modal-stone-input-update"
              name="loaiDaUpdate"
              value={loaiDaUpdate || stoneType}
              onChange={(e) => setLoaiDaUpdate(e.target.value)}
            />
            <label htmlFor="price" className="modal-stone-label-update">
              Giá
            </label>
            <input
              id="price"
              type="text"
              className="modal-stone-input-update"
              name="giaDa"
              value={giaDaUpdate || stonePrice}
              onChange={(e) => setGiaDaUpdate(e.target.value)}
            />
            <label htmlFor="color" className="modal-stone-label-update">
              Màu Đá
            </label>
            <input
              id="color"
              type="text"
              className="modal-stone-input-update"
              name="mauDa"
              value={mauDaUpdate || stoneColor}
              onChange={(e) => setMauDaUpdate(e.target.value)}
            />
            <label htmlFor="primary" className="modal-stone-label-update">
              Đá Chính
            </label>
            <input
              id="primary"
              type="text"
              className="modal-stone-input-update"
              name="daChinh"
              value={daChinhUpdate || stoneIsPrimary}
              onChange={(e) => setStoneIsPrimary(e.target.value)}
            />
            <label htmlFor="idProduct" className="modal-stone-label-update">
              Id Sản Phẩm
            </label>
            <input
              id="idProduct"
              type="text"
              className="modal-stone-input-update"
              name="idSanPham"
              value={idProductUpdate || stoneProductId}
              onChange={(e) => setIdProductUpdate(e.target.value)}
            />

            <button id="create-stone-update" onClick={handleUpdate}>
              Cập Nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Stone;
