import axiosInstance from '../utils/axiosInstance';

export const getMyAddresses = () =>
    axiosInstance.get('/addresses');

export const addAddress = (data) =>
    axiosInstance.post('/addresses', data);

export const deleteAddress = (id) =>
    axiosInstance.delete(`/addresses/${id}`);