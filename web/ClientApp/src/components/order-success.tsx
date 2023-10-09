import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Stylesheets/groupform.module.css';

const OrderSuccessPage = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [orderDetails, setOrderDetails] = useState<{ totalCost: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/order/${orderId}`, axiosConfig);
                if (response.status === 200) {
                    setOrderDetails(response.data);
                } else {
                    setError('Failed to fetch order details');
                }
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError('Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.orderSuccess}>Order Success!</h2>
            <p>Your order number is {orderId}.</p>
            {orderDetails && <p className={styles.totalCost}>Total Cost: ${orderDetails.totalCost}</p>}
        </div>
    );
};

export default OrderSuccessPage;