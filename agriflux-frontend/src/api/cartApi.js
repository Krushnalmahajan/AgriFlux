import axiosInstance from '../utils/axiosInstance';

export const getCart = () =>
    axiosInstance.get('/cart');

export const addToCart = (data) =>
    axiosInstance.post('/cart/add', data);

export const updateCartItem = (cartItemId, quantity) =>
    axiosInstance.put(`/cart/update/${cartItemId}?quantity=${quantity}`);

export const removeFromCart = (cartItemId) =>
    axiosInstance.delete(`/cart/remove/${cartItemId}`);

export const clearCart = () =>
    axiosInstance.delete('/cart/clear');