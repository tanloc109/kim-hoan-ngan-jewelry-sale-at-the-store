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

function formatMonth(monthNumber) {
    return `Tháng ${monthNumber}`;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

const ChartYear = () => {
    const [yearlyData, setYearlyData] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.API_ROOT}/api/Dashboard/orders-and-revenue-to-current-month`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = response.data;
                setYearlyData(data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu', error);
            }
        };

        fetchData();
    }, [token]);

    const data = {
        labels: yearlyData.map(entry => formatMonth(entry.month)),
        datasets: [
            {
                label: 'Tổng doanh thu',
                data: yearlyData.map(entry => entry.totalRevenue),
                borderColor: 'rgb(255,97,131)',
                backgroundColor: 'rgba(255, 97, 131, 0.2)',
                fill: true,
                yAxisID: 'y1',
            },
            {
                label: 'Tổng số đơn hàng',
                data: yearlyData.map(entry => entry.totalOrders),
                borderColor: 'rgb(54,162,235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
                    text: 'Tổng doanh thu (VND)'
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
                    text: 'Tổng số đơn hàng'
                },
                grid: {
                    drawOnChartArea: false,
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
            <h5 className="text-center mt-3 fw-bold chart-title">Biểu đồ doanh thu cửa hàng theo từng tháng trong năm</h5>
        </div>
    );
};

export default ChartYear;
