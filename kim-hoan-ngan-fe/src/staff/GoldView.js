import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GoldView.css'
import numeral from 'numeral';
import config from '../config/config'

function GoldView() {

    const [goldPrices, setGoldPrices] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get(`${config.API_ROOT}/materials`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
                setGoldPrices(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the gold prices!', error);
            });
    }, []);


    const formatDateTime = (dateTimeString) => {
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateTimeString));
    };

    return (
        <div className="container-fluid bang-gia-vang">
            <div className="row d-flex">
                <div className="table-price-l">
                    <div className=''><h6 className='don-vi-tinh'>***ĐƠN VỊ TÍNH VND/CHỈ</h6></div>
                    <div className="gold-price-table">
                        <table className="table-l">
                            <thead>
                                <tr>
                                    <th>Mã Loại vàng</th>
                                    <th>Tên Loại vàng</th>
                                    <th>Giá mua</th>
                                    <th>Giá bán</th>
                                    {/* <th>Thời gian cập nhật</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {goldPrices.map((gold, index) => (
                                    <tr key={index}>
                                        <td>{gold.id}</td>
                                        <td>{gold.name}</td>
                                        <td>{numeral(gold.buyPrice).format('0,0')} VND</td>
                                        <td>{numeral(gold.sellPrice).format('0,0')} VND</td>
                                        {/* <td>{formatDateTime(gold.updateTime)}</td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default GoldView;
