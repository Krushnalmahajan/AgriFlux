import axiosInstance from '../utils/axiosInstance';

export const createPaymentOrder = (orderId) =>
    axiosInstance.post('/payment/create-order', { orderId });

export const verifyPayment = (data) =>
    axiosInstance.post('/payment/verify', data);