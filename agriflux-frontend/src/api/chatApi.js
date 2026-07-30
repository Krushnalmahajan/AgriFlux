import axiosInstance from '../utils/axiosInstance';

export const sendMessage = (data) =>
    axiosInstance.post('/chatbot/chat', data);