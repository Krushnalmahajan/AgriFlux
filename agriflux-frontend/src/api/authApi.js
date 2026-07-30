import axiosInstance from '../utils/axiosInstance';

export const registerUser = (data) =>
    axiosInstance.post('/auth/register', data);

export const loginUser = (data) =>
    axiosInstance.post('/auth/login', data);