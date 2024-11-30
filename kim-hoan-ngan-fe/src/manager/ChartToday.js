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
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
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

const ChartToday = () => {
    const [weekRevenue, setWeekRevenue] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.API_ROOT}/api/Dashboard/daily-revenue-last-7-days`, {
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
                data: weekRevenue.map(entry => entry.dailyRevenue),
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
            datalabels: {
                color: 'rgb(25,135,84)',
                formatter: (value, context) => {
                    const datasetIndex = context.datasetIndex;
                    if (datasetIndex === 0) {
                        return formatCurrency(value);
                    }
                    return value;
                },
                anchor: 'end',
                align: 'end',
            }
        }
    };

    return (
        <div>
            <Line data={data} options={options} />
            <h6 className="text-center mt-3 fw-bold">Biểu đồ doanh thu cửa hàng 7 ngày gần nhất</h6>
        </div>
    );
};

export default ChartToday;
