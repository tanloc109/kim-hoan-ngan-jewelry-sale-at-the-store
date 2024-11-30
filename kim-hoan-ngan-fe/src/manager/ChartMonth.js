import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import config from "../config/config";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function formatDateTime(dateTimeString) {
    const options = {
        month: '2-digit', day: '2-digit'
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateTimeString));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

const ChartMonth = () => {
    const [weekRevenue, setWeekRevenue] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.API_ROOT}/api/Dashboard/orders-and-revenue-to-current-day`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data;
                setWeekRevenue(data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu', error);
            }
        };

        fetchData();
    }, [token]);

    const data = {
        labels: weekRevenue.map(entry => formatDateTime(entry.date)),
        datasets: [
            {
                label: 'Doanh thu hàng ngày',
                data: weekRevenue.map(entry => entry.totalRevenue),
                borderColor: 'rgb(255,97,131)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
                yAxisID: 'y1',
            },
            {
                label: 'Số đơn hàng',
                data: weekRevenue.map(entry => entry.totalOrders),
                borderColor: 'rgb(54,162,235)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                yAxisID: 'y2',
            },
        ],
    };

    const options = {
        scales: {
            y1: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Doanh thu hàng ngày (VND)'
                },
                ticks: {
                    callback: function (value) {
                        return formatCurrency(value);
                    }
                }
            },
            y2: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Số đơn hàng'
                },
                grid: {
                    drawOnChartArea: false, // Chỉ hiển thị lưới cho y1
                },
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.dataset.label || '';
                        const value = context.raw;
                        return label + ': ' + (context.datasetIndex === 0 ? formatCurrency(value) : value);
                    }
                }
            },
            datalabels: {
                display: false
            }
        }
    };

    return (
        <div>
            <Line data={data} options={options} />
            <h5 className="text-center mt-3 fw-bold chart-title">Biểu đồ doanh thu cửa hàng trong tháng này</h5>
        </div>
    );
};

export default ChartMonth;
