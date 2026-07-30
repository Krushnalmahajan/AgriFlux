import axiosInstance from '../utils/axiosInstance';

export const getWeatherByCity = (city) =>
    axiosInstance.get(`/weather?city=${city}`);

export const getWeatherForecast = (city) =>
    axiosInstance.get(`/weather/forecast?city=${city}`);