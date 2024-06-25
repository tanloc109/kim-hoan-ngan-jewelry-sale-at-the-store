import React, { useState, useEffect } from "react";
import "./Users.css";
import axios from "axios";
import config from "../config/config";
import formatDateTime from "./formatDatetime"

function Users() {
  const [showModal, setShowModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [users, setUser] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [showModalUpdate, setShowModalUpdate] = useState(false);

  const [maNguoiDung, setMaNguoiDung] = useState("");
  const [sdtNguoiDung, setSdtNguoiDung] = useState("");
  const [tenNguoiDung, setTenNguoiDung] = useState("");
  const [emailNguoiDung, setEmailNguoiDung] = useState("");
  const [dcNguoiDung, setDcNguoiDung] = useState("");
  const [nsNguoiDung, setNsNguoiDung] = useState("");
  const [vaiTroNguoiDung, setVaiTroNguoiDung] = useState("");
  const [passNguoiDung, setPassNguoiDung] = useState("");
  const [statusNguoiDung, setStatusNguoiDung] = useState("");

  const [nameUserSearch, setNameUserSearch] = useState("");
  const token = localStorage.getItem("token");
  //-------------------------------------------------------------
  const [addSuccess, setAddSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [idUserUpdate, setIdUserUpdate] = useState("");
  const [nameUserUpdate, setNameUserUpdate] = useState("");
  const [passUserUpdate, setPassUserUpdate] = useState("");
  const [addressUserUpdate, setAddressUserUpdate] = useState("");
  const [phoneUserUpdate, setPhoneUserUpdate] = useState("");
  const [emailUserUpdate, setEmailUserUpdate] = useState("");
  const [dobUserUpdate, setDobUserUpdate] = useState("");
  const [roleIdUpdate, setRoleIdUpdate] = useState("");


  const [nameUser, setNameUser] = useState("");
  const [passUser, setPassUser] = useState("");
  const [addressUser, setAddressUser] = useState("");
  const [phoneUser, setPhoneUser] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [dobUser, setDobUser] = useState("");
  const [roleId, setRoleId] = useState("");

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
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  // Hiển thị số trang
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  //--------------------------------------------
  //-------------------------------------------

  const handleSearch = async () => {
    try {
      const res = await fetch(`${config.API_ROOT}/api/Users/get-users-by-fullname/${nameUserSearch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const users = await res.json();
      setUser(users);
      setUsersCount(users.length);
    } catch (error) {
      console.error("Có lỗi khi tìm vàng!", error);
    }
  };
  //------------------------------------------------------------


  const handleDelete = async (userName) => {
    try {
      await axios.delete(`${config.API_ROOT}/api/Users/${userName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const response = await axios.get(`${config.API_ROOT}/api/Users/GetALL`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUser(response.data);
      setUsersCount(response.data.length);
      console.log("cook");
      setDeleteSuccess(true);
    } catch (error) {
      console.error('Xảy ra lỗi khi xóa vai trò!', error);
    }
    console.log("jeheh" + userName);
  };
  //----------------------------------
  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${config.API_ROOT}/api/Users/${idUserUpdate}`,
        {
          fullName: nameUserUpdate,
          password: passUserUpdate,
          address: addressUserUpdate,
          phone: phoneUserUpdate,
          email: emailUserUpdate,
          dob: dobUserUpdate,
          level: 0,
          status: "active",
          roleId: roleIdUpdate
        }
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the specific post in the posts state
      // const updatedRoles = roles.map((roles) => {
      //   if (roles.categoryId === roleToIdUpdate) {
      //     return response.data;
      //   } else {
      //     return roles;
      //   }
      // });
      // setRoles(updatedRoles);
      // setUpdateSuccess(true);
    } catch (error) {
      console.error("There was an error updating the role!", error);
    }
    closeModalUpdate();
    console.log(phoneUser);
    console.log(phoneUserUpdate);
  };

  const handleEditClick = (user) => {
    showAddFormUpdate();
    setNameUser(user.fullName) 
    setPassUser(user.password) 
    setAddressUser(user.address)
    setPhoneUser(user.phone)
    setEmailUser(user.email)
    setDobUser(user.dob) 
    setRoleId(user.roleId)

    setIdUserUpdate(user.userName);

  };
  //--------------------------------
  //create us

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `${config.API_ROOT}/api/Users`,
        {
          userName: maNguoiDung,
          fullName: tenNguoiDung,
          password: passNguoiDung,
          address: dcNguoiDung,
          phone: sdtNguoiDung,
          email: emailNguoiDung,
          dob: nsNguoiDung,
          level: 0,
          status: "active",
          roleId: vaiTroNguoiDung

        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMaNguoiDung("");
      setTenNguoiDung("");
      setEmailNguoiDung("");
      setDcNguoiDung("");
      setSdtNguoiDung("");
      setNsNguoiDung("");
      setPassNguoiDung("");
      setVaiTroNguoiDung("");
      setStatusNguoiDung("");

      console.log("User created successfully:", response.data);
      setAddSuccess(true);
    } catch (error) {
      console.error("There was an error adding user!", error);
    }
    closeModal();
    console.log(nsNguoiDung);
    console.log(maNguoiDung);
    console.log(passNguoiDung);
    console.log(dcNguoiDung);
    console.log(nsNguoiDung);
    console.log(sdtNguoiDung);
    console.log(emailNguoiDung);
    console.log(statusNguoiDung);
    console.log("vtnd" + vaiTroNguoiDung);
    console.log(tenNguoiDung);


  };

  //--------------------------------
  //udate us

  const closeModalUpdate = () => {
    setShowModalUpdate(false);
  };

  const showAddFormUpdate = () => {
    setShowModalUpdate(true);
  };

  //-----------------------------------------------
  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Users/GetALL`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((users) => {
        setUser(users);
        setUsersCount(users.length);
      });
  }, []);

  useEffect(() => {
    fetch(`${config.API_ROOT}/api/Roles`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((res) => res.json())
      .then((roles) => {
        setRoles(roles);
      });
  }, []);
  const showAddForm = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  //----------------------------------------------------------------
  useEffect(() => {
    handleSearchCustomer()
  }, [nameUserSearch])

  const handleSearchCustomer = async () => {
    try {
      const response = await axios.get(`${config.API_ROOT}/api/Users/get-users-by-fullname/${nameUserSearch}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data)
    } catch (error) {
      console.error('There was an error fetching the customer list!', error);
    }


  }
  //------------------------------------------------------------------
  return (
    <div className="col-10">
      <div className="users">
        <div className={`alert alert-success position-fixed  notify-item-add-success ${addSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Add user success
        </div>
        <div className={`alert alert-success position-fixed  notify-item-delete-success ${deleteSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Delete user success
        </div>
        <div className={`alert alert-success position-fixed  notify-item-update-success ${updateSuccess ? "open" : ""}`}>
          <i className="fas fa-check-circle me-2"></i>
          Update user success
        </div>
        <div className="title">
          <p>Quản Lý Người Dùng</p>
        </div>

        <div className="tagResult">
          <div className="tagResultCustomer">
            <div className="tagChild">
              <i className="fas fa-users"></i>
            </div>
            <h3>Số Người Dùng</h3>
            <p>{usersCount} Người Dùng</p>
          </div>
        </div>
        <div className="usersDetail">
          <p className="titlee">Danh sách Người Dùng</p>
          <div className="search">
            <input type="text"
              name="nameUserSearch"
              value={nameUserSearch}
              onChange={(e) => setNameUserSearch(e.target.value)} />
            <button onClick={handleSearch}>Search</button>
          </div>
          <button className="addUsers" onClick={showAddForm}>
            <i className="fas fa-plus"></i>
            <p>Tạo Mới Người Dùng</p>
          </button>
          <table className="table tableUser ">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã Người Dùng</th>
                <th>Tên Người Dùng</th>
                <th>Số Điện Thoại</th>
                <th>Email Người Dùng</th>
                <th>Địa Chỉ</th>
                <th>Ngày Sinh</th>
                <th>Vai Trò</th>
                <th>Mật Khẩu</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.userName}</td>
                  <td>{user.fullName}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{formatDateTime(user.dob)}</td>

                  <td>{user.roles.roleName}</td>
                  <td>{user.password}</td>
                  <td>
                    <div className="btn-group">
                      <i className="btn btn-danger fas fa-trash-alt delete" onClick={() => handleDelete(user.userName)}></i>
                      <i
                        className="btn btn-primary fas fa-edit update ms-2"
                        onClick={() => handleEditClick(user)}
                      ></i>
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
      /**--------------------------------------------------------------- */
      <div className={`modal-user ${showModal ? "open" : ""}`}>
        <div className="modal-user-child">
          <div className="modal-user-close" onClick={closeModal}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-user-headerr">
            <p>Tạo Người Dùng Mới</p>
          </header>
          <div>
            <div className="modal-user-body ">
              <div className="modal-user-body-left">
                <label htmlFor="user-name" className="modal-user-label">
                  Tên Người Dùng
                </label>
                <input
                  id="user-name"
                  type="text"
                  className="modal-user-input"
                  name="tenNguoiDung"
                  value={tenNguoiDung}
                  onChange={(e) => setTenNguoiDung(e.target.value)}
                />

                <label htmlFor="user-phone" className="modal-user-label">
                  Số Điện Thoại
                </label>
                <input
                  id="user-phone"
                  type="text"
                  className="modal-user-input"
                  name="sdtNguoiDung"
                  value={sdtNguoiDung}
                  onChange={(e) => setSdtNguoiDung(e.target.value)}
                />

                <label htmlFor="user-email" className="modal-user-label">
                  Email
                </label>
                <input
                  id="user-email"
                  type="text"
                  className="modal-user-input"
                  name="emailNguoiDung"
                  value={emailNguoiDung}
                  onChange={(e) => setEmailNguoiDung(e.target.value)}
                />

                <label htmlFor="user-address" className="modal-user-label">
                  Địa Chỉ
                </label>
                <input
                  id="user-address"
                  type="text"
                  className="modal-user-input"
                  name="dcNguoiDung"
                  value={dcNguoiDung}
                  onChange={(e) => setDcNguoiDung(e.target.value)}
                />


              </div>

              <div className="modal-user-body-right">
                <label htmlFor="user-id" className="modal-user-label">
                  Mã Người Dùng
                </label>
                <input
                  id="user-id"
                  type="text"
                  className="modal-user-input "
                  name="maNguoiDung"
                  value={maNguoiDung}
                  onChange={(e) => setMaNguoiDung(e.target.value)}
                />
                <label htmlFor="user-gold-type" className="modal-user-label">
                  Vai Trò
                </label>
                <div className="combobox create-combobox-user cc">
                  <select
                    name="vaiTroNguoiDung"
                    value={vaiTroNguoiDung}
                    onChange={(e) => setVaiTroNguoiDung(e.target.value)}
                  >
                    <option value="" defaultValue disabled>
                      Vai Trò
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.roleId}>{role.roleName}</option>
                    ))}
                  </select>
                </div>

                <label htmlFor="user-pass" className="modal-user-label xx">
                  Mật Khẩu
                </label>
                <input
                  id="user-pass"
                  type="text"
                  className="modal-user-input yy"
                  name="passNguoiDung"
                  value={passNguoiDung}
                  onChange={(e) => setPassNguoiDung(e.target.value)}
                />
                <label htmlFor="user-dob" className="modal-user-label">
                  Ngày Sinh
                </label>
                <input
                  id="user-dob"
                  type="date"
                  className="modal-user-input"
                  name="nsNguoiDung"
                  value={nsNguoiDung}
                  onChange={(e) => setNsNguoiDung(e.target.value)}
                />
              </div>
            </div>

            <button
              id="create-user"
              className="modal-user-button"
              onClick={handleCreate}
            >
              Tạo
            </button>
          </div>
        </div>
      </div>
      /*------------------------------------------------------- */
      <div className={`modal-user-update ${showModalUpdate ? "open" : ""}`}>
        <div className="modal-user-child-update">
          <div className="modal-user-close-update" onClick={closeModalUpdate}>
            <i className="fas fa-times-circle"></i>
          </div>
          <header className="modal-user-headerr-update">
            <p>Sửa Đổi Người Dùng</p>
          </header>
          <div>
            <div className="modal-user-body-update ">
              <div className="modal-user-body-left-update">
                <label htmlFor="user-name-update" className="modal-user-label-update">
                  Tên Người Dùng
                </label>
                <input
                  id="user-name-update"
                  type="text"
                  className="modal-user-inpu-updatet"
                  name="nameUserUpdate"
                  value={nameUserUpdate || nameUser}
                  onChange={(e) => setNameUserUpdate(e.target.value)}
                />

                <label
                  htmlFor="user-phone-update"
                  className="modal-user-label-update"
                >
                  Số Điện Thoại
                </label>
                <input
                  id="user-phone-update"
                  type="text"
                  className="modal-user-inpu-updatet"
                  name="phoneUserUpdate"
                  value={phoneUserUpdate || phoneUser}
                  onChange={(e) => setPhoneUserUpdate(e.target.value)}
                />

                <label
                  htmlFor="user-email-update"
                  className="modal-user-label-update"
                >
                  Email
                </label>
                <input
                  id="user-email-update"
                  type="text"
                  className="modal-user-inpu-updatet"
                  name="emailUserUpdate"
                  value={emailUserUpdate || emailUser}
                  onChange={(e) => setEmailUserUpdate(e.target.value)}
                />

                <label
                  htmlFor="user-address-update"
                  className="modal-user-label-update"
                >
                  Địa Chỉ
                </label>
                <input
                  id="user-address-update"
                  type="text"
                  className="modal-user-inpu-updatet"
                  name="addressUserUpdate"
                  value={addressUserUpdate || addressUser}
                  onChange={(e) => setAddressUserUpdate(e.target.value)}
                />


              </div>

              <div className="modal-user-body-right-update">

                <label
                  htmlFor="user-role-update"
                  className="modal-user-label-update"
                >
                  Vai Trò
                </label>
                <div className="combobox create-combobox-user-update cc">
                  <select
                    name="roleIdUpdate"
                    value={roleIdUpdate || roleId}
                    onChange={(e) => setRoleIdUpdate(e.target.value)}
                  >
                    <option value="" defaultValue disabled>
                      Vai Trò
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.roleId}>{role.roleName}</option>
                    ))}
                  </select>
                </div>

                <label
                  htmlFor="user-pass-update"
                  className="modal-user-label-update xx"
                >
                  Mật Khẩu
                </label>
                <input
                  id="user-pass-update"
                  type="text"
                  className="modal-user-inpu-updatet"
                  name="passUserUpdate"
                  value={passUserUpdate || passUser}
                  onChange={(e) => setPassUserUpdate(e.target.value)}
                />
                <label
                  htmlFor="user-dob-update"
                  className="modal-user-label-update"
                >
                  Ngày Sinh
                </label>
                <input
                  id="user-dob-update"
                  type="date"
                  className="modal-user-inpu-updatet"
                  name="dobUserUpdate"
                  value={dobUserUpdate || dobUser}
                  onChange={(e) => setDobUserUpdate(e.target.value)}
                />
              </div>
            </div>

            <button
              id="create-user-update"
              className="modal-user-button-update"
              onClick={handleUpdate}
            >
              Cập Nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
