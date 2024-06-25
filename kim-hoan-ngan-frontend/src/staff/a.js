import React, { useState } from 'react';
import config from '../config/config';

const PaymentForm = () => {
    const [formData, setFormData] = useState({
        orderId: '',
        paymentType: '',
        cash: '',
        bankTransfer: '',
        transactionId: '',
        image: null
    });

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
        data.append('orderId', formData.orderId);
        data.append('paymentType', formData.paymentType);
        data.append('cash', formData.cash || 0);
        data.append('bankTransfer', formData.bankTransfer || 0);
        data.append('transactionId', formData.transactionId || '');
        data.append('image', formData.image);
        data.append('status', 'Đã thanh toán');

        try {
            const response = await fetch('${config.API_ROOT}/api/Payments', {
                method: 'POST',
                body: data
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);
            // Handle success (e.g., show a success message, clear the form, etc.)
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="orderId">Order ID:</label>
                <input
                    type="number"
                    id="orderId"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="paymentType">Payment Type:</label>
                <input
                    type="text"
                    id="paymentType"
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="cash">Cash:</label>
                <input
                    type="number"
                    id="cash"
                    name="cash"
                    value={formData.cash}
                    onChange={handleChange}
                    step="0.01"
                />
            </div>
            <div>
                <label htmlFor="bankTransfer">Bank Transfer:</label>
                <input
                    type="number"
                    id="bankTransfer"
                    name="bankTransfer"
                    value={formData.bankTransfer}
                    onChange={handleChange}
                    step="0.01"
                />
            </div>
            <div>
                <label htmlFor="transactionId">Transaction ID:</label>
                <input
                    type="text"
                    id="transactionId"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="image">Upload Image:</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                />
            </div>
            <button type="submit">Submit Payment</button>
        </form>
    );
};

export default PaymentForm;