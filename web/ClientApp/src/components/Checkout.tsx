import React, { useState, useContext, useEffect } from 'react';
import styles from './Stylesheets/checkoutform.module.css';
import { useHistory } from 'react-router-dom';
import { CartItemDto } from './types'
import axios from 'axios';

const CheckoutForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [cardCVC, setCardCVC] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('01');
    const [expiryYear, setExpiryYear] = useState('2015');
    const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOrderSuccessful, setOrderSuccessful] = useState(false);
    const [orderId, setOrderId] = useState<number | null>(null);
    const [orderTotalCost, setOrderTotalCost] = useState<number | null>(null);
    const [orderFailureMessage, setOrderFailureMessage] = useState('');

    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
    };

    const handleFullNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFullName(e.target.value);
    };

    const handleEmailChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePaymentMethodChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setPaymentMethod(e.target.value);
    };

    const handleCardNumberChange = (e:React.ChangeEvent<HTMLInputElement> ) => {
        setCardNumber(e.target.value);
    };

    const handleCardCVCChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setCardCVC(e.target.value);
    };

    const handleExpiryMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setExpiryMonth(e.target.value);
    };

    const handleExpiryYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setExpiryYear(e.target.value);
    };

    const history = useHistory();

    useEffect(() => {
        if (isOrderSuccessful && orderId !== null) {
            history.push(`/order-success/${orderId}`);
        }
    }, [isOrderSuccessful, orderId, history]);

    useEffect(() => {
        // Define an async function
        const fetchCartItems = async () => {
            try {
                // Start by setting isLoading to true
                setIsLoading(true);

                // Fetch the data from the API
                const response = await fetch('/api/cart', axiosConfig);

                // If the response is not ok, throw an error
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }

                // Parse the JSON data
                const data = await response.json();

                // Set the cart items in state
                setCartItems(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        // Call the async function
        fetchCartItems();
    }, []);

    const totalCost = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const orderDto = {
            CardNumber: cardNumber,
        };

        try {
            const response = await axios.post('/api/order', orderDto, axiosConfig);

            if (response.status === 201) {
                setOrderSuccessful(true);
                setOrderId(response.data.orderId);
                console.log('Order created');
            } else {
                setOrderFailureMessage('Order failed, please try again later.');
            }
        } catch (error) {
            console.error('Error during axios operation', error);
            setOrderFailureMessage('Order failed, please try again later.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <h4>Cart Summary</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Product Image</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map(item => (
                            <tr key={item.cartId}>
                                <td><img src={item.product.imageUrl} alt={item.product.productName} style={{ width: '100px', height: '100px' }} /></td>
                                <td>{item.product.productName}</td>
                                <td>{item.quantity}</td>
                                <td>{item.totalPrice}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2}><b>Total Cost</b></td>
                            <td><b>{totalCost}</b></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <h4>Account</h4>
                    <div className={`${styles['input-group']} ${styles['input-group-icon']}`}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={handleFullNameChange}
                        />
                        <div className={styles['input-icon']}>
                            <i className="fa fa-user"></i>
                        </div>
                    </div>
                    <div className={`${styles['input-group']} ${styles['input-group-icon']}`}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <div className={styles['input-icon']}>
                            <i className="fa fa-envelope"></i>
                        </div>
                    </div>
                </div>
                <div className={styles.row}>
                    <h4>Payment Details</h4>
                    <div className={styles['input-group']}>
                        <input
                            type="radio"
                            id="payment-method-card"
                            name="payment-method"
                            value="card"
                            checked={true}
                            onChange={handlePaymentMethodChange}
                        />
                        <label htmlFor="payment-method-card">
                            <span>
                                <i className="fa fa-cc-visa"></i> Credit Card
                            </span>
                        </label>
                    </div>
                    <div className={`${styles['input-group']} ${styles['input-group-icon']}`}>
                        <input
                            type="text"
                            placeholder="Card Number"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                        />
                        <div className={styles['input-icon']}>
                            <i className="fa fa-credit-card"></i>
                        </div>
                    </div>
                    <div className={styles['col-half']}>
                        <div className={`${styles['input-group']} ${styles['input-group-icon']}`}>
                            <input
                                type="text"
                                placeholder="Card CVC"
                                value={cardCVC}
                                onChange={handleCardCVCChange}
                            />
                            <div className={styles['input-icon']}>
                                <i className="fa fa-user"></i>
                            </div>
                        </div>
                    </div>
                    <div className={styles['col-half']}>
                        <div className={styles['input-group']}>
                            <select value={expiryMonth} onChange={handleExpiryMonthChange}>
                                <option value="01">01 Jan</option>
                                <option value="02">02 Jan</option>
                            </select>
                            <select value={expiryYear} onChange={handleExpiryYearChange}>
                                <option value="2015">2015</option>
                                <option value="2016">2016</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <div>
                            <button type="submit" className={styles['input-group']}>
                                Submit Order
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {orderFailureMessage && <div className={styles.error}>{orderFailureMessage}</div>}
        </div>
    );
}

export default CheckoutForm;