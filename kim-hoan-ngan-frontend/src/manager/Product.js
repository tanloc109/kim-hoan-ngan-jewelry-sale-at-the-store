import React, { useState, useEffect } from "react";
import numeral from "numeral";
import axios from "axios";
import "./Product.css";
import config from "../config/config";
function Product() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [golds, setGolds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showUpdateModal, setShowUpdateModel] = useState(false);
  const token = localStorage.getItem("token");
  const [updatedProduct, setUpdatedProduct] = useState({});
  //--------------------------------------------
  const updateAllPrice = async () => {
    try {
      const response = await axios.put(
        `${config.API_ROOT}/api/Product/UpdateTickALL`, {
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      );
      console.log("Gold created successfully:", response.data);
    } catch (error) {
      console.error("There was an error adding gold!", error);
    }
    closeModal();
  }
  //-----------------------------------------------------
  const updateOne = async (productIdd) => {
    try {
      const response = await axios.put(
        `${config.API_ROOT}/api/Product/UpdateTickOne/${productIdd}`, {
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      );
      console.log("Gold created successfully:", response.data);
    } catch (error) {
      console.error("There was an error adding gold!", error);
    }
    closeModal();
  }

  const updateProduct = async (product) => {
    showUpdateForm();
    setUpdatedProduct(product)
  }
  //-------------------------------------------------------

  //Add product
  const [formData, setFormData] = useState({
    categoryId: "",
    goldId: "",
    productName: "",
    description: "abc",
    image: null,
    quantity: 0,
    goldWeight: 0.0,
    wage: 0,
    size: "",
    warrantyPeriod: 12, //cho input
    price: 4500000,
    status: "active"
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('categoryId', formData.categoryId);
    data.append('goldId', formData.goldId);
    data.append('productName', formData.productName);
    data.append('description', formData.description);
    data.append('image', formData.image);
    data.append('quantity', formData.quantity);
    data.append('goldWeight', formData.goldWeight);
    data.append('wage', formData.wage);
    data.append('size', formData.size);
    data.append('warrantyPeriod', formData.warrantyPeriod);


    console.log(formData);

    try {
      const response = await fetch(`${config.API_ROOT}/api/Product`, {
        method: 'POST',
        body: data
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      closeModal();
      const result = await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const data2 = new FormData();
    data2.append('categoryId', formData.categoryId);
    data2.append('goldId', formData.goldId);
    data2.append('productName', formData.productName);
    data2.append('description', formData.description);
    data2.append('image', formData.image);
    data2.append('quantity', formData.quantity);
    data2.append('goldWeight', formData.goldWeight);
    data2.append('wage', formData.wage);
    data2.append('size', formData.size);
    data2.append('warrantyPeriod', formData.warrantyPeriod);
    data2.append('price', formData.price);
    data2.append('status', formData.status);

    console.log(formData);

    try {
      const response = await fetch(`${config.API_ROOT}/api/Product/UpdateProductNormal/${updatedProduct.productId}`, {
        method: 'PUT',
        body: data2
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      closeModal();
      const result = await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  //-------------------------------------------------------
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
  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `${config.API_ROOT}/api/Product/${productId}`
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const response = await axios.get(
        `${config.API_ROOT}/api/Product?pageNumber=1&pageSize=1000`
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setPosts(response.data);
      setPostCount(response.data.length);
    } catch (error) {
      console.error("Xảy ra lỗi khi xóa vai trò!", error);
    }
  };

  useEffect(() => {
    fetch(
      `${config.API_ROOT}/api/Product?pageNumber=1&pageSize=1000`
      , {
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
    fetch(`${config.API_ROOT}/api/GoldTypes`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((golds) => {
        setGolds(golds);
      });
  }, []);
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Category`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((categories) => {
        setCategories(categories);
      });
  }, []);
  const showAddForm = () => {
    setShowModal(true);
  };
  const showUpdateForm = () => {
    setShowUpdateModel(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const closeUpdateModalll = () => {
    setShowUpdateModel(false);
  };


  var namePrimary;
  var priceStone = 0;
  var name;

  var size;
  return (
    <div className="col-10">
      <div className="product">
        <div className="title">
          <p>Quản Lý Sản Phẩm</p>
        </div>
        <div className="tagResult">
          <div className="tagResultToday">
            <div className="tagChild">
              <i className="fas fa-expand-arrows-alt"></i>
            </div>
            <h3>Sản phẩm hiện có</h3>
            <p>{postCount} sản phẩm</p>
          </div>
          <div className="tagResultWeek">
            <div className="tagChild">
              <i className="fas fa-times-circle"></i>
            </div>
            <h3>Sản phẩm hết hàng</h3>
            <p>2 Sản phẩm</p>
          </div>
          <div className="detailProduct">
            <p>Danh sách sản phẩm</p>
            <button className="addProduct" onClick={showAddForm}>
              <i className="fas fa-plus"></i>
              <p>Tạo mới sản phẩm</p>
            </button>
            <button className="updatePrice" onClick={updateAllPrice}>
              <i className="fas fa-wrench"></i>
              <p>Cập nhật giá tất cả sản phẩm theo giá vàng hiện tại</p>
            </button>

            <table className="tablee">
              <thead>
                <tr>

                  <th>STT</th>
                  <th>Mã Sản Phẩm</th>
                  <th>Tên Sản Phẩm</th>
                  <th>Ảnh</th>
                  <th>Số Lượng</th>
                  <th>Kích Cỡ</th>
                  <th>Danh Mục</th>
                  <th>Loại Vàng</th>
                  <th>Khối Lượng Vàng</th>
                  <th>Loại Đá Chính</th>
                  <th>Số Đá</th>
                  <th>Tổng Tiền Đá</th>
                  <th>Tiền Công</th>
                  <th>Thành Tiền</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((post, index) => (
                  <tr key={index}>

                    <td>{index + 1}</td>
                    <td>{post.productId}</td>
                    <td>{post.productName}</td>
                    {/* <td>{post.image}</td> */}
                    <td></td>
                    <td>{post.quantity}</td>
                    <td>{post.size}</td>
                    <td>{post.categories.name}</td>
                    <td>{post.goldTypes.goldName}</td>
                    <td>{post.goldWeight}</td>
                    {post.stones.map((stone) => {
                      if (stone.isPrimary) {
                        namePrimary = stone.name;
                      }
                      priceStone += stone.price;
                    })}
                    <td>{namePrimary}</td>
                    <td>{post.stones.length}</td>
                    <td>{numeral(priceStone).format("0,0")} VND</td>
                    <td>{numeral(post.wage).format("0,0")} VND</td>
                    <td>{numeral(post.price).format("0,0")} VND</td>

                    <td>
                      <div className="btn-group">
                        <i
                          className="btn btn-danger fas fa-trash-alt delete"
                          onClick={() => handleDelete(post.productId)}
                        ></i>
                        <i
                          className="btn btn-primary fas fa-edit update"
                          onClick={() => updateProduct(post)}
                        ></i>
                        <i className="btn btn-warning fas fa-pen-fancy update" onClick={() => updateOne(post.productId)}></i>
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
        </div>
      </div>
      <div className={`modal-product ${showModal ? "open" : ""}`}>
        <div className="modal-product-child">
          <div className="modal-product-close" onClick={closeModal}>
            <i className="fas fa-times-circle"></i>
          </div>
          <form onSubmit={handleSubmit}>
            <header className="modal-product-headerr">
              <p>Tạo Sản Phẩm Mới</p>
            </header>
            <div>
              <div className="modal-product-body ">
                <div className="modal-product-body-left">
                  <label htmlFor="product-name" className="modal-product-label">
                    Tên Sản Phẩm
                  </label>
                  <input
                    type="text"
                    id="productName"
                    className="modal-product-input"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="product-image" className="modal-product-label">
                    Ảnh
                  </label>
                  <div className="modal-product-image-upload">
                    <input
                      type="file"
                      className="modal-product-image-input"
                      id="image"
                      name="image"
                      onChange={handleFileChange}
                    />
                  </div>
                  <label
                    htmlFor="product-quantity"
                    className="modal-product-label y"
                  >
                    Số Lượng
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    className="modal-product-input"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    step="1"
                  />
                </div>
                <div className="modal-product-body-right">
                  <label
                    htmlFor="product-gold-type"
                    className="modal-product-label"
                  >
                    Loại Vàng
                  </label>

                  <div className="combobox create-combobox-product">
                    <select
                      id="goldId"
                      name="goldId"
                      value={formData.goldId}
                      onChange={handleChange}
                      className="ms-2"
                    >
                      <option value="" defaultValue disabled>
                        Loại Vàng
                      </option>
                      {golds.map((gold, index) => (
                        <option key={index} value={gold.goldId}>{gold.goldName}</option>
                      ))}
                    </select>
                  </div>

                  <label
                    htmlFor="product-gold-weight"
                    className="modal-product-label xx"
                  >
                    Khối Lượng Vàng
                  </label>
                  <input
                    type="number"
                    id="goldWeight"
                    name="goldWeight"
                    value={formData.goldWeight}
                    onChange={handleChange}
                    className="modal-product-input"
                    step="0.1"
                  />
                  <label htmlFor="product-size" className="modal-product-label">
                    Kích Cỡ
                  </label>
                  <input
                    type="number"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="modal-product-input"
                    step="0.5"
                  />
                </div>
              </div>
              <div className="modal-product-body">
                <div className="modal-product-body-left">
                  <label
                    htmlFor="product-category"
                    className="modal-product-label x"
                  >
                    Danh Mục
                  </label>
                  <div className="combobox create-combobox-cagetory">
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="ms-2"
                    >
                      <option value="" defaultValue disabled>
                        Danh Mục
                      </option>
                      {categories.map((cagetory, index) => (
                        <option key={index} value={cagetory.categoryId}>{cagetory.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-product-body-right">
                  <label
                    htmlFor="product-labor-cost"
                    className="modal-product-label x"
                  >
                    Tiền Công
                  </label>
                  <input
                    type="number"
                    id="wage"
                    className="modal-product-input"
                    name="wage"
                    value={formData.wage}
                    onChange={handleChange}
                    step="10000"
                  />
                </div>
              </div>
              <button
                id="create-pro"
                className="modal-product-button"
                type="submit"
              >
                Tạo
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={`modal-update-product ${showUpdateModal ? "open" : ""}`}>
        <div className="modal-update-product-child">
          <div
            className="modal-update-product-close"
            onClick={closeUpdateModalll}
          >
            <i className="fas fa-times-circle"></i>
          </div>
          <form onSubmit={handleUpdateSubmit}>
            <header className="modal-update-product-headerr">
              <p>Cập Nhật Thông Tin Sản Phẩm</p>
            </header>
            <div className="modal-update-product-body ">
              <div className="modal-product-body ">
                <div className="modal-product-body-left">
                  <label htmlFor="product-name" className="modal-product-label">
                    Tên Sản Phẩm
                  </label>
                  <input type="text" id="productName" className="modal-product-input" name="productName"
                    value={formData.productName || updatedProduct.productName} onChange={handleChange} required />
                  <label htmlFor="product-image" className="modal-product-label">
                    Ảnh
                  </label>
                  <div className="modal-product-image-upload">
                    <input type="file" className="modal-product-image-input" id="image" name="image"
                      onChange={handleFileChange} />
                  </div>
                  <label
                    htmlFor="product-quantity"
                    className="modal-product-label y"
                  >
                    Số Lượng
                  </label>
                  <input type="number" id="quantity" className="modal-product-input" name="quantity"
                    value={formData.quantity || updatedProduct.quantiy} onChange={handleChange} step="1" />
                </div>
                <div className="modal-product-body-right">
                  <label
                    htmlFor="product-gold-type"
                    className="modal-product-label"
                  >
                    Loại Vàng
                  </label>

                  <div className="combobox update-combobox-gold-product">
                    <select id="goldId" name="goldId" value={formData.goldId || updatedProduct.goldId} onChange={handleChange} className="ms-2">
                      <option value="" defaultValue disabled>
                        Loại Vàng
                      </option>
                      {golds.map((gold, index) => (
                        <option key={index} value={gold.goldId}>{gold.goldName}</option>
                      ))}
                    </select>
                  </div>

                  <label
                    htmlFor="product-gold-weight"
                    className="modal-product-label xx"
                  >
                    Khối Lượng Vàng
                  </label>
                  <input type="number" id="goldWeight" name="goldWeight" value={formData.goldWeight || updatedProduct.goldWeight}
                    onChange={handleChange} className="modal-product-input" step="0.1" />
                  <label htmlFor="product-size" className="modal-product-label">
                    Kích Cỡ
                  </label>
                  <input type="number" id="size" name="size" value={formData.size || updatedProduct.size} onChange={handleChange}
                    className="modal-product-input" step="0.5" />
                </div>
              </div>
              <div className="modal-product-body">
                <div className="modal-product-body-left">
                  <label
                    htmlFor="product-category"
                    className="modal-product-label x"
                  >
                    Danh Mục
                  </label>
                  <div className="combobox create-combobox-cagetory">
                    <select id="categoryId" name="categoryId" value={formData.categoryId || updatedProduct.categoryId} onChange={handleChange}
                      className="ms-2">
                      <option value="" defaultValue disabled>
                        Danh Mục
                      </option>
                      {categories.map((cagetory, index) => (
                        <option key={index} value={cagetory.categoryId}>{cagetory.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-product-body-right">
                  <label
                    htmlFor="product-labor-cost"
                    className="modal-product-label x"
                  >
                    Tiền Công
                  </label>
                  <input type="number" id="wage" className="modal-product-input" name="wage" value={formData.wage || updatedProduct.wage}
                    onChange={handleChange} step="10000" />
                </div>
              </div>
              <button id="create-pro" className="modal-product-button" type="submit">
                Cập Nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Product;
