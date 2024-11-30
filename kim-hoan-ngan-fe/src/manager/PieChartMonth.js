// src/components/PieChart.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import config from '../config/config';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChartToday = () => {
    const token = localStorage.getItem('token');
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Categories',
                data: [],
                backgroundColor: ['#FF6384', // Màu đỏ
                    '#36A2EB', // Màu xanh dương
                    '#FFCE56', // Màu vàng
                    '#4BC0C0', // Màu xanh ngọc
                    '#9966FF', // Màu tím
                ],
            },
        ],
    });

    useEffect(() => {
        fetch(`${config.API_ROOT}/api/Category/get-percentages-category/this-month`, {
            method: 'GET',
            headers: {
                'accept': 'text/plain',
                'Authorization': `${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                const labels = data.map(item => item.categoryName);
                const datasetData = data.map(item => item.percentage);

                setData({
                    labels,
                    datasets: [
                        {
                            label: 'Tỉ lệ (%):',
                            data: datasetData,
                            backgroundColor: ['#FF6384', // Màu đỏ
                                '#36A2EB', // Màu xanh dương
                                '#FFCE56', // Màu vàng
                                '#4BC0C0', // Màu xanh ngọc
                                '#9966FF', // Màu tím
                            ],
                        },
                    ],
                });
            });
    }, []);

    const options = {
        plugins: {
            datalabels: {
                formatter: (value, context) => {
                    return value.toFixed(2) + '%';
                },
                color: '#fff',
                font: {
                    weight: 'bold',
                },
            },
        },
    };

    return (
        <div>
            <Pie data={data} options={options} />
            <h6 className='text-center'>Tỉ lệ doanh thu theo loại sản phẩm trong tháng này</h6>
        </div>
    );
};

export default PieChartToday;
