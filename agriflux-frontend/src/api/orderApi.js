import axiosInstance from '../utils/axiosInstance';

export const placeOrder = (data) =>
    axiosInstance.post('/orders/place', data);

export const getMyOrders = () =>
    axiosInstance.get('/orders/my-orders');

export const getOrderById = (id) =>
    axiosInstance.get(`/orders/${id}`);

export const cancelOrder = (id) =>
    axiosInstance.put(`/orders/${id}/cancel`);