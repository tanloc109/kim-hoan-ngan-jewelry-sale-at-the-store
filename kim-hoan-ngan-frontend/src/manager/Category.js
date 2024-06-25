import React, { useState, useEffect } from "react";
import "./Category.css";
import axios from "axios";
import config from "../config/config";

function Category() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0)
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [goldIdSearch, setGoldIdSearch] = useState("");
  const [postToNameUpdate, setPostToNameUpdate] = useState("");
  const token = localStorage.getItem("token");



  const [tenDanhMuc, setTenDanhMuc] = useState("")


  // useEffect(() => {
  //   console.log(postToNameUpdate.name);
  //   if (postToNameUpdate) {
  //     setUpdatedName(postToNameUpdate.name);
  //   }
  // }, [postToNameUpdate]);
  const [updatedName, setUpdatedName] = useState("");
  const [postToIdUpdate, setPostToIdUpdate] = useState("");

//-------------------------------------------------------------
const [addSuccess, setAddSuccess] = useState(false);
const [deleteSuccess, setDeleteSuccess] = useState(false);
const [updateSuccess, setUpdateSuccess] = useState(false);

const [nameDanhMuc, setNameDanhMuc] = useState("")

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
      const res = await fetch(`${config.API_ROOT}/api/Category/get-categories-by-name/${goldIdSearch}`,
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
  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`${config.API_ROOT}/api/Category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // Cập nhật lại danh sách các vai trò sau khi xóa thành công
      const response = await axios.get(`${config.API_ROOT}/api/Category`,
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
      console.error('Xảy ra lỗi khi xóa danh mục!', error);
    }
  };
  //-------------------------------------------------------------
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${config.API_ROOT}/api/Category/${postToIdUpdate}`,
        {
          name: updatedName,
          status: "active"
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

  const handleEditClick = (post) => {
    showAddFormUpdate();
    setPostToIdUpdate(post.categoryId);
    setNameDanhMuc(post.name);
    handlePostClick(post.categoryId)
  };
  const handlePostClick = (post) => {
    showAddFormUpdate();
  };

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Category`,
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

  //
  const handleCreate = async () => {
    console.log(tenDanhMuc);
    try {
      const response = await axios.post(`${config.API_ROOT}/api/Category`, {
        name: tenDanhMuc,
        status: "active"
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      closeModal();
      setTenDanhMuc("");


      console.log('Gold created successfully:', response.data);
      setAddSuccess(true);
    } catch (error) {
      console.error('There was an error adding gold!', error);
    }
  };
  const showAddForm = () => {
    setShowModal(true);
  }
  const closeModal = () => {
    setShowModal(false);

  }

  const showAddFormUpdate = () => {
    setShowModalUpdate(true);
  };
  // const handlePostClick = (post) => {
  //   showAddFormUpdate();
  //   setPostToUpdate(post);
  // }


  const closeModalUpdate = () => {
    setShowModalUpdate(false);
  };

 //----------------------------------------------------------------
 useEffect(() => {
  handleSearchCustomer()
}, [goldIdSearch])

const handleSearchCustomer = async () => {
  try {
    const response = await axios.get(`${config.API_ROOT}/api/Category/get-categories-by-name/${goldIdSearch}`, {
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
      <div className="category">
      <div className={`alert alert-success position-fixed  notify-item-add-success ${addSuccess ? "open" : ""}`}>
        <i className="fas fa-check-circle me-2"></i>
          Add category success
        </div>
        <div className={`alert alert-success position-fixed  notify-item-delete-success ${deleteSuccess ? "open" : ""}`}>
        <i className="fas fa-check-circle me-2"></i>
          Delete category success
        </div>
        <div className={`alert alert-success position-fixed  notify-item-update-success ${updateSuccess ? "open" : ""}`}>
        <i className="fas fa-check-circle me-2"></i>
          Update category success
        </div>
        <div className="title">
          <p>Danh Mục</p>
        </div>
        <div className="tagResult">
          <div className="tagResultCategory">
            <div className="tagChild">
              <i className="fas fa-mortar-pestle"></i>
            </div>
            <h3>Danh mục hiện có</h3>
            <p>{postCount} Danh mục</p>
          </div>
        </div>

        <div className="categoryDetail">
          <p>Quản lý danh mục</p>
          <div className="search">
            <input type="text"
              name="goldId"
              value={goldIdSearch}
              onChange={(e) => setGoldIdSearch(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
          </div>
          <button className="addCategory" onClick={showAddForm}>
            <i className="fas fa-plus"></i>
            <p>Tạo Danh Mục</p>
          </button>

          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã Danh Mục</th>
                <th>Tên Danh Mục</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>

              {currentItems.map((post, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{post.categoryId}</td>
                  <td>{post.name}</td>
                  <td>
                    <i className="btn btn-danger fas fa-trash-alt delete" onClick={() => handleDelete(post.categoryId)}></i>
                    <i className="btn btn-primary fas fa-edit update ms-2" onClick={() => handleEditClick(post)}></i>
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

      <div className={`modal-category ${showModal ? 'open' : ''}`}>
        <div className="modal-child-category">
          <div className="modal-category-close" onClick={closeModal}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-cagetory-headerr">
            <p>Tạo Danh Mục mới</p>
          </header>
          <div className="modal-category-body">
            <label htmlFor="name-category" className="model-category-label">
              Tên Danh Mục
            </label>
            <input id="name-category" type="text" className="modal-category-input" name="tenDanhMuc" value={tenDanhMuc} onChange={(e) => setTenDanhMuc(e.target.value)} />
            <button id="create-category" onClick={handleCreate}>Tạo</button>
          </div>
        </div>
      </div>

      <div className={`modal-category-update ${showModalUpdate ? 'open' : ''}`}>
        <div className="modal-child-category-update">
          <div className="modal-category-close-update" onClick={closeModalUpdate}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-cagetory-headerr-update">
            <p>Cập Nhật Thông Tin Danh Mục</p>
          </header>
          <div className="modal-category-body-update">
            <label htmlFor="name-category" className="model-category-label-update">
              Tên Danh Mục
            </label>
            <input id="name-category" type="text" className="modal-category-input-update" name="updatedName" value={updatedName || nameDanhMuc} onChange={(e) => setUpdatedName(e.target.value)} />
            <button id="create-category-update" onClick={handleUpdate}>Cập Nhật</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Category;
