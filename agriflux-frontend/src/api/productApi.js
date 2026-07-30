import axiosInstance from '../utils/axiosInstance';

export const getAllProducts = () =>
    axiosInstance.get('/products');

export const getProductById = (id) =>
    axiosInstance.get(`/products/${id}`);

export const searchProducts = (keyword) =>
    axiosInstance.get(`/products/search?keyword=${keyword}`);

export const getProductsByCategory = (categoryId) =>
    axiosInstance.get(`/products/category/${categoryId}`);

export const getFeaturedProducts = () =>
    axiosInstance.get('/products/featured');

export const getAllCategories = () =>
    axiosInstance.get('/categories');