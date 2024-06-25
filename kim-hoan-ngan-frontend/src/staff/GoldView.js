import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GoldView.css'
import numeral from 'numeral';
import config from '../config/config'
import formatDateTime from '../lib/formatDatetime';

function GoldView() {

    const [goldPrices, setGoldPrices] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get(`${config.API_ROOT}/api/GoldTypes`,
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

    return (
        <div className="container-fluid bang-gia-vang">
            <div className="row d-flex">
                <div className="col-1"></div>
                <div className="col-2">
                    <h3 className="title-h3-3">GIÁ VÀNG</h3>
                    <div className="info">
                        <h5 className="fw-bold">ĐƠN VỊ TÍNH VND/CHỈ</h5>
                        <h5 className="fw-bold">{formatDateTime(goldPrices[0]?.updateTime)}</h5>
                    </div>
                </div>
                <div className="col-1"></div>
                <div className="col-8 table-price-l">
                    <div className="gold-price-table">
                        <table className="table-l">
                            <thead>
                                <tr>
                                    <th>Loại vàng</th>
                                    <th>Giá mua</th>
                                    <th>Giá bán</th>
                                </tr>
                            </thead>
                            <tbody>
                                {goldPrices.map((gold, index) => (
                                    <tr key={index}>
                                        <td>{gold.goldName}</td>
                                        <td>{numeral(gold.buyPrice).format('0,0')} VND</td>
                                        <td>{numeral(gold.sellPrice).format('0,0')} VND</td>
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
