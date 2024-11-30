import React, { useState, useEffect } from "react";
import "./AddStonesToProduct.css";
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import config from "../config/config";
import numeral from "numeral";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
function AddStonesToProduct() {
    const token = localStorage.getItem("token");
    const [editingPost, setEditingPost] = useState([]);
    const [showAddStone, setShowAddStone] = useState(false);
    const [showButtonAdd, setShowButtonAdd] = useState(true);
    const [posts, setPost] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [idStoneToDetach, setIdStoneToDetach] = useState("");
    const [categories, setCategories] = useState([]);
    const [reloadStone, setReloadStone] = useState("");
    const [detechStone, setDetechStone] = useState("");
    const [golds, setGolds] = useState([]);
    const [duplicate, setDuplicate] = useState("");
    const { productId } = useParams();
    const [addStoneSuccess, setAddStoneSuccess] = useState(false);


    const navigate = useNavigate();

    const handleDelete = async (id) => {
        try {
            await axios.put(
                `${config.API_ROOT}/api/Stones/detach-stone?id=${id}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setDetechStone(true)
            setReloadStone(id)
        } catch (error) {
            console.error("Error deleting stone:", error);
            console.error("There was an error adding stone!", error);
            setDuplicate(error.response?.data || "Error occurred");
            setTimeout(() => {
                setDuplicate(null);
            }, 3000);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const rawValue = value.replace(/,/g, '');
        const formattedValue = numeral(rawValue).format('0,0');
        formik.setFieldValue(name, rawValue);
        setFormattedInputValue(formattedValue);
    };

    const [formattedInputValue, setFormattedInputValue] = useState('');

    const backToProduct = () => {
        navigate(`/manager/product`)
    };

    const checkbuttonAdd = () => {
        setShowAddStone(true);
        setShowButtonAdd(false);
        console.log("mot" + posts.productCode);
    };

    useEffect(() => {
        setTimeout(() => {
            setUpdateSuccess(false);
        }, 3000);
    }, [updateSuccess]);
    useEffect(() => {
        setTimeout(() => {
            setAddStoneSuccess(false);
        }, 3000);
    }, [addStoneSuccess]);
    useEffect(() => {
        setTimeout(() => {
            setDetechStone(false);
        }, 3000);
    }, [detechStone]);
    const checkbuttonCancel = () => {
        setShowAddStone(false);
        setShowButtonAdd(true);
    };

    useEffect(() => {
        fetch(`${config.API_ROOT}/api/GoldTypes`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((golds) => {
                setGolds(golds);
            })
            .catch((error) => console.error("Error fetching gold types:", error));
    }, []);

    useEffect(() => {
        fetch(`${config.API_ROOT}/api/Category`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((categories) => {
                setCategories(categories);
            })
            .catch((error) => console.error("Error fetching categories:", error));
    }, []);

    useEffect(() => {
        fetch(`${config.API_ROOT}/api/Product/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((posts) => {
                setEditingPost(posts);
                setPost(posts);
            })
            .catch((error) => console.error("Error fetching product:", error));
    }, [showButtonAdd, idStoneToDetach, reloadStone]);

    const formik = useFormik({
        initialValues: {
            code: "",
            tenDa: "",
            loaiDa: "",
            giaDa: null,
            mauDa: "",
            daChinh: "",
            idProduct: ""
        },
        validationSchema: Yup.object({
            code: Yup.string()
                .length(5, 'Mã đá phải chứa 5 ký tự')
                .matches(/^D\d{4}$/, 'Mã đá phải bắt đầu bằng D và theo sau là 4 chữ số')
                .required('Mã đá là bắt buộc'),
            tenDa: Yup.string()
                .min(3, 'Tên đá phải dài ít nhất 3 ký tự')
                .max(30, 'Tên đá không được dài quá 30 ký tự')
                .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ]*$/, 'Tên đá không được chứa ký tự đặc biệt hoặc số')
                .required('Tên đá là bắt buộc'),
            giaDa: Yup.number()
                .min(0, 'Giá đá tối thiểu là 0 VND')
                .max(100000000, 'Giá đá tối đa là 100,000,000 VND')
                .required('Giá mua là bắt buộc'),
            mauDa: Yup.string()
                .min(2, 'Màu đá phải dài ít nhất 2 ký tự')
                .max(20, 'Màu đá không được dài quá 20 ký tự')
                .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ]*$/, 'Màu đá không được chứa ký tự đặc biệt hoặc số')
                .required('Màu đá là bắt buộc'),
        }),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (values) => {
            handleCreate(values);
        },
    });

    const handleCreate = async (values) => {
        try {
            const response = await axios.post(
                `${config.API_ROOT}/api/Stones`,
                {
                    stoneCode: values.code,
                    productCode: posts.productCode,
                    name: values.tenDa,
                    price: values.giaDa,
                    color: values.mauDa,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                formik.resetForm();
                console.log("Stone created successfully:", response.data);
            }
            setFormattedInputValue('');
            checkbuttonCancel();
            setAddStoneSuccess(true)
        } catch (error) {
            console.error("There was an error adding stone!", error);
            setDuplicate(error.response?.data || "Error occurred");
            setTimeout(() => {
                setDuplicate(null);
            }, 3000);
        }
    };

    const formikUpdate = useFormik({
        initialValues: {
            productCode: '',
            productName: '',
            description: '',
            size: '',
            image: null,
            quantity: '',
            categoryId: '',
            goldId: '',
            goldWeight: '',
            wage: '',
            price: '',
            warrantyPeriod: ''
        },
        validationSchema: Yup.object({
            productCode: Yup.string()
                .length(9, "Mã sản phẩm phải chứa 9 ký tự")
                .matches(/^KHN\d{6}$/, 'Mã sản phẩm phải bắt đầu với "KHN" và gồm 6 số sau')
                .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ\-]*$/, 'Mã sản phẩm không được chứa ký tự đặc biệt')
                .required('Mã sản phẩm là bắt buộc'),
            productName: Yup.string()
                .min(3, 'Tên sản phẩm phải dài ít nhất 3 ký tự')
                .max(30, 'Tên sản phẩm tối đa 30 ký tự')
                .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ\-]*$/, 'Tên sản phẩm không được chứa ký tự đặc biệt')
                .required('Tên sản phẩm là bắt buộc'),
            description: Yup.string()
                .min(3, 'Mô tả phải dài ít nhất 3 ký tự')
                .max(30, 'Mô tả tối đa 30 ký tự')
                .matches(/^[a-zA-Z0-9\sÀ-Ỹà-ỹ\-]*$/, 'Mô tả không được chứa ký tự đặc biệt')
                .required('Mô tả là bắt buộc'),
            size: Yup.string()
                .min(1, 'Kích cỡ phải từ 1 đến 10 ký tự')
                .max(10, 'Kích cỡ phải từ 1 đến 10 ký tự')
                .required('Kích cỡ là bắt buộc'),
            quantity: Yup.number()
                .min(0, 'Số lượng tối thiểu là 0')
                .max(1000, 'Số lượng tối đa là 1000')
                .required('Số lượng là bắt buộc'),
            categoryId: Yup.string()
                .required('Danh mục là bắt buộc'),
            goldId: Yup.string()
                .required('Loại vàng là bắt buộc'),
            goldWeight: Yup.number()
                .min(0.1, 'Khối lượng vàng phải từ 0.1 đến 20')
                .max(20, 'Khối lượng vàng phải từ 0.1 đến 20')
                .required('Khối lượng vàng là bắt buộc'),
            wage: Yup.number()
                .min(0, 'Tiền công tối thiểu 0 VND')
                .max(10000000, 'Tiền công tối đa 10.000.000 VND')
                .required('Tiền công là bắt buộc'),
            price: Yup.number()
                .min(0, 'Giá sản phẩm phải từ 0 đến 300,000,000 VND')
                .max(300000000, 'Giá sản phẩm tối đa 300,000,000 VND')
                .required('Giá sản phẩm là bắt buộc'),
            warrantyPeriod: Yup.number()
                .min(3, 'Thời hạn bảo hành tối thiểu 3 tháng')
                .max(36, 'Thời hạn bảo hành tối đa 36 tháng')
                .required('Thời hạn bảo hành là bắt buộc'),
        }),
        onSubmit: (values) => {
            console.log('Form data', values);
            handleUpdateSubmit(values);
        }
    });

    const handleUpdateSubmit = async (values) => {
        const data2 = new FormData();
        data2.append('categoryId', values.categoryId);
        data2.append('goldId', values.goldId);
        data2.append('productName', values.productName);
        data2.append('description', values.description);
        data2.append('image', values.image);
        data2.append('quantity', values.quantity);
        data2.append('goldWeight', parseFloat(values.goldWeight));
        data2.append('wage', values.wage);
        data2.append('size', values.size);
        data2.append('warrantyPeriod', values.warrantyPeriod);
        data2.append('price', values.price);
        data2.append('productCode', values.productCode);
        data2.append('status', "active");

        try {
            const response = await axios.put(
                `${config.API_ROOT}/api/Product/UpdateProductNormal/${productId}`,
                data2,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Update response:", response);
            setUpdateSuccess(true);
        } catch (error) {
            console.error('Error updating product:', error);
            setDuplicate(error.response?.data || "Error occurred");

            setTimeout(() => {
                setDuplicate("");
            }, 3000);
        }
    };

    useEffect(() => {
        if (editingPost) {
            console.log("Editing Post:", editingPost);
            formikUpdate.setValues({
                productName: editingPost.productName,
                description: editingPost.description,
                size: editingPost.size,
                image: editingPost.image,
                quantity: editingPost.quantity,
                categoryId: editingPost.categories?.categoryId,
                goldId: editingPost.goldTypes?.goldId,
                goldWeight: editingPost.goldWeight,
                wage: editingPost.wage,
                price: editingPost.price,
                warrantyPeriod: editingPost.warrantyPeriod,
                productCode: editingPost.productCode
            });
        }
    }, [editingPost]);

    return (
        <div className="col-10">
            {duplicate && (
                <div className="alert alert-danger position-fixed top-8 end-0 m-3 duplicateCss">
                    {duplicate}
                </div>

            )}
            <div className={`alert alert-success position-fixed  notify-item-update-success align-items-center updatePrass ${updateSuccess ? "open" : ""}`}>
                <i className="fas fa-check-circle me-2"></i>
                Cập nhật sản phẩm thành công
            </div>
            <div className={`alert alert-success position-fixed  notify-item-update-success align-items-center updatePrass ${updateSuccess ? "open" : ""}`}>
                <i className="fas fa-check-circle me-2"></i>
                Cập nhật sản phẩm thành công
            </div>
            <div className={`alert alert-success position-fixed  notify-item-update-success align-items-center updatePrass ${addStoneSuccess ? "open" : ""}`}>
                <i className="fas fa-check-circle me-2"></i>
                Thêm đá thành công
            </div>
            <div className={`alert alert-success position-fixed  notify-item-update-success align-items-center updatePrass ${detechStone ? "open" : ""}`}>
                <i className="fas fa-check-circle me-2"></i>
                Tách đá thành công
            </div>
            <div className="addStoneToProduct">
                <div className="title title-gold-a">
                    <p>Chi Tiết Sản Phẩm</p>
                </div>
                <div className="addStoneDetail">
                    <form onSubmit={formikUpdate.handleSubmit}>
                        <p className="tieuDeDetail">Thông tin sản phẩm chi tiết</p>

                        <div className="d-flex">
                            <button className="btn-back btnxx" onClick={backToProduct}>Trở về trang sản phẩm</button>
                            <button className="btn-donee ms-2 btnxx" type="submit">Hoàn Tất</button>
                        </div>
                        <div className="modal-product-form formAddStone">
                            <div className="modal-product-left">
                                <div className="d-flex">
                                    <label htmlFor="productCode" className="modal-product-label">Mã Sản Phẩm</label>
                                    <input
                                        type="text"
                                        id="productCode"
                                        className="modal-product-input"
                                        name="productCode"
                                        value={formikUpdate.values.productCode}
                                        onChange={formikUpdate.handleChange}
                                        onBlur={formikUpdate.handleBlur}
                                    />
                                </div>
                                {formikUpdate.touched.productCode && formikUpdate.errors.productCode ? (
                                    <span className="error lui">{formikUpdate.errors.productCode}</span>
                                ) : null}
                                <div className="d-flex">
                                    <label htmlFor="productName" className="modal-product-label">Tên Sản Phẩm</label>
                                    <input
                                        type="text"
                                        id="productName"
                                        className="modal-product-input"
                                        name="productName"
                                        value={formikUpdate.values.productName}
                                        onChange={formikUpdate.handleChange}
                                        onBlur={formikUpdate.handleBlur} />
                                </div>
                                {formikUpdate.touched.productName && formikUpdate.errors.productName ? (
                                    <span className="error lui">{formikUpdate.errors.productName}</span>
                                ) : null}
                                <div className="d-flex">
                                    <label htmlFor="description" className="modal-product-label">Mô Tả</label>
                                    <input
                                        type="text"
                                        id="description"
                                        className="modal-product-input"
                                        name="description"
                                        value={formikUpdate.values.description}
                                        onChange={formikUpdate.handleChange}
                                        onBlur={formikUpdate.handleBlur} />
                                </div>
                                {formikUpdate.touched.description && formikUpdate.errors.description ? (
                                    <span className="error lui">{formikUpdate.errors.description}</span>
                                ) : null}
                                <div className="d-flex cpn rrlt">
                                    <label htmlFor="categoryId" className="modal-product-label ">Danh Mục
                                        <div className="combobox comboboxDm comboboxDmm">
                                            <select
                                                id="categoryId"
                                                name="categoryId"
                                                value={formikUpdate.values.categoryId}
                                                onChange={formikUpdate.handleChange}
                                                onBlur={formikUpdate.handleBlur}
                                                className="modal-product-select"
                                            >
                                                <option value="" defaultValue disabled>Danh Mục</option>
                                                {categories.map((category, index) => (
                                                    <option key={index} value={category.categoryId}>{category.name}</option>
                                                ))}
                                            </select>

                                        </div>
                                    </label>
                                    <label htmlFor="goldId" className="modal-product-label goldTypee goldBenAdd">Loại Vàng</label>
                                    <div className="combobox comboboxGold comboboxGoldBenAdd">
                                        <select
                                            id="goldId"
                                            name="goldId"
                                            value={formikUpdate.values.goldId}
                                            onChange={formikUpdate.handleChange}
                                            onBlur={formikUpdate.handleBlur}
                                            className="modal-product-select"
                                        >
                                            <option value="" defaultValue disabled>Loại Vàng</option>
                                            {golds.map((gold, index) => (
                                                <option key={index} value={gold.goldId}>{gold.goldName}</option>
                                            ))}
                                        </select>

                                    </div>
                                </div>
                                <div className="d-flex">
                                    {formikUpdate.touched.categoryId && formikUpdate.errors.categoryId ? (
                                        <span className="error luicbbdm">{formikUpdate.errors.categoryId}</span>
                                    ) : null}
                                    {formikUpdate.touched.goldId && formikUpdate.errors.goldId ? (
                                        <span className="error luicbbv">{formikUpdate.errors.goldId}</span>
                                    ) : null}
                                </div>
                                <div className="d-flex">
                                    <label htmlFor="goldWeight" className="modal-product-label">Trọng Lượng Vàng</label>
                                    <input
                                        type="number"
                                        id="goldWeight"
                                        name="goldWeight"
                                        value={formikUpdate.values.goldWeight}
                                        onChange={formikUpdate.handleChange}
                                        onBlur={formikUpdate.handleBlur}
                                        className="modal-product-input" />
                                </div>
                                {formikUpdate.touched.goldWeight && formikUpdate.errors.goldWeight ? (
                                    <span className="error lui">{formikUpdate.errors.goldWeight}</span>
                                ) : null}
                                <div className="d-flex">
                                    <label htmlFor="image" className="modal-product-label">Ảnh</label>
                                    <input
                                        type="file"
                                        className="modal-product-image-input"
                                        id="image"
                                        name="image"
                                        onChange={(event) => {
                                            formikUpdate.setFieldValue('image', event.currentTarget.files[0]);
                                        }}
                                        onBlur={formikUpdate.handleBlur} />
                                </div>
                                {formikUpdate.touched.description && formikUpdate.errors.description ? (
                                    <span className="error lui">{formikUpdate.errors.description}</span>
                                ) : null}

                            </div>
                            <div className="modal-product-right">
                                <div className="d-flex">
                                    <label htmlFor="size" className="modal-product-label">Kích Cỡ</label>
                                    <input
                                        type="text"
                                        id="size"
                                        name="size"
                                        value={formikUpdate.values.size}
                                        onChange={formikUpdate.handleChange}
                                        onBlur={formikUpdate.handleBlur}
                                        className="modal-product-input" />
                                </div>
                                {formikUpdate.touched.size && formikUpdate.errors.size ? (
                                    <span className="error lui">{formikUpdate.errors.size}</span>
                                ) : null}
                                <div className="d-flex">
                                    <label htmlFor="quantity" className="modal-product-label">Số Lượng</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        className="modal-product-input"
                                        name="quantity"
                                        value={formikUpdate.values.quantity}
                                        onChange={formikUpdate.handleChange}
                                        onBlur={formikUpdate.handleBlur} />
                                </div>
                                {formikUpdate.touched.quantity && formikUpdate.errors.quantity ? (
                                    <span className="error lui">{formikUpdate.errors.quantity}</span>
                                ) : null}
                                <div className="d-flex">
                                    <label htmlFor="wage" className="modal-product-label">Tiền Công</label>
                                    <input
                                        type="number"
                                        id="wage"
                                        className="modal-product-input"
                                        name="wage"
                                        value={formikUpdate.values.wage}
                                        onChange={formikUpdate.handleChange}
                                        onBlur={formikUpdate.handleBlur}
                                        step="10000" />
                                </div>
                                {formikUpdate.touched.wage && formikUpdate.errors.wage ? (
                                    <span className="error lui">{formikUpdate.errors.wage}</span>
                                ) : null}
                                <div className="d-flex">
                                    <label htmlFor="price" className="modal-product-label">Giá Sản Phẩm</label>
                                    <input
                                        type="number"
                                        id="price"
                                        className="modal-product-input"
                                        name="price"
                                        value={formikUpdate.values.price}
                                        onChange={formikUpdate.handleChange}
                                        onBlur={formikUpdate.handleBlur}
                                        step="10000" />
                                </div>
                                {formikUpdate.touched.price && formikUpdate.errors.price ? (
                                    <span className="error lui">{formikUpdate.errors.price}</span>
                                ) : null}
                                <div className="d-flex">
                                    <label htmlFor="warrantyPeriod" className="modal-product-label">Thời Hạn Bảo Hành</label>
                                    <input
                                        type="number"
                                        id="warrantyPeriod"
                                        className="modal-product-input"
                                        name="warrantyPeriod"
                                        value={formikUpdate.values.warrantyPeriod}
                                        onChange={formikUpdate.handleChange}
                                        onBlur={formikUpdate.handleBlur} />
                                </div>
                                {formikUpdate.touched.warrantyPeriod && formikUpdate.errors.warrantyPeriod ? (
                                    <span className="error lui">{formikUpdate.errors.warrantyPeriod}</span>
                                ) : null}
                                {showButtonAdd && (
                                    <div className="btn muonthemda" onClick={() => checkbuttonAdd(true)}>Thêm đá vào sản phẩm</div>
                                )}
                            </div>
                        </div>

                    </form>
                </div>
                {showAddStone && (
                    <div className="addStoneShow">
                        <form onSubmit={formik.handleSubmit} className="inputAdd">
                            <div className="modal-stone-body">
                                <label htmlFor="code" className="modal-stone-label">Mã Đá</label>
                                <input
                                    id="code"
                                    type="text"
                                    className="modal-stone-input"
                                    name="code"
                                    value={formik.values.code}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Ví dụ: Dxxxx"

                                />
                                {formik.touched.code && formik.errors.code ? (
                                    <span className="error">{formik.errors.code}</span>
                                ) : null}

                                <label htmlFor="name" className="modal-stone-label">Tên Đá</label>
                                <input
                                    id="name"
                                    type="text"
                                    className="modal-stone-input"
                                    name="tenDa"
                                    value={formik.values.tenDa}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Ví dụ: Đá Sa Phia"

                                />
                                {formik.touched.tenDa && formik.errors.tenDa ? (
                                    <span className="error">{formik.errors.tenDa}</span>
                                ) : null}

                                <div className="priceDaContainer">
                                    <label htmlFor="price" className="modal-stone-label priceDa">Giá Đá</label>

                                    <input
                                        type="text"
                                        id="price"
                                        name="giaDa"
                                        className="modal-stone-input"
                                        value={formattedInputValue}
                                        onChange={handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Ví dụ: 1,200,000"

                                    />
                                    {formik.touched.giaDa && formik.errors.giaDa ? (
                                        <span className="error">{formik.errors.giaDa}</span>
                                    ) : null}
                                </div>

                                <label htmlFor="color" className="modal-stone-label">Màu Đá</label>
                                <input
                                    id="color"
                                    type="text"
                                    className="modal-stone-input"
                                    name="mauDa"
                                    value={formik.values.mauDa}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Ví dụ: Đỏ"

                                />
                                {formik.touched.mauDa && formik.errors.mauDa ? (
                                    <span className="error mb-2">{formik.errors.mauDa}</span>
                                ) : null}


                                <div>
                                    <button className="huy" onClick={checkbuttonCancel}>Hủy</button>

                                    <button className="them" type="submit" >Thêm</button>
                                </div>
                            </div>
                        </form>
                    </div>


                )}
                {posts.stones?.length > 0 &&
                    <div className="detailStone">
                        <div className="tableStoneDetail">
                            <h6 className="mt-4">Danh sách đá chi tiết</h6>
                            <table >
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Mã Đá</th>
                                        <th>Tên Đá</th>
                                        <th>Màu Sắc</th>
                                        <th>Giá</th>
                                        <th>Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {posts.stones?.map((stone, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{stone.stoneCode}</td>
                                            <td>{stone.name}</td>
                                            <td>{stone.color}</td>
                                            <td>{numeral(stone.price).format("0,0")} VND</td>
                                            <td><i
                                                className="btn btn-danger fas fa-trash-alt delete"
                                                onClick={() => handleDelete(stone.stoneId)}
                                            ></i></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
            </div>
        </div >
    )
}

export default AddStonesToProduct;