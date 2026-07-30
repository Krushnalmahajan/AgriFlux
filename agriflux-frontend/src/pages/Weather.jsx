import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    getWeatherByCity, getWeatherForecast
} from '../api/weatherApi';
import useTranslation from '../utils/useTranslation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import {
    fadeInUp, staggerContainer, staggerItem
} from '../utils/animations';
import {
    Search, Wind, Droplets,
    Thermometer, Eye, MapPin
} from 'lucide-react';

const Weather = () => {
    const { t } = useTranslation();
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    const popularCities = [
        'Pune', 'Mumbai', 'Delhi', 'Bangalore',
        'Hyderabad', 'Chennai', 'Jaipur', 'Lucknow',
        'Nagpur', 'Bhopal'
    ];

    const handleSearch = async (searchCity) => {
        const cityName = searchCity || city;
        if (!cityName.trim()) {
            toast.error('Please enter a city name');
            return;
        }
        setLoading(true);
        try {
            const res = await getWeatherForecast(cityName);
            setWeather(res.data);
            setCity(cityName);
        } catch {
            toast.error(
                'City not found. Please check the name.');
        } finally {
            setLoading(false);
        }
    };

    const getWeatherEmoji = (description) => {
        if (!description) return '🌤️';
        const d = description.toLowerCase();
        if (d.includes('thunder')) return '⛈️';
        if (d.includes('rain')) return '🌧️';
        if (d.includes('drizzle')) return '🌦️';
        if (d.includes('snow')) return '❄️';
        if (d.includes('fog') || d.includes('mist'))
            return '🌫️';
        if (d.includes('cloud')) return '⛅';
        if (d.includes('clear')) return '☀️';
        return '🌤️';
    };

    const getBgColor = (description) => {
        if (!description) return 'from-blue-500 to-blue-700';
        const d = description.toLowerCase();
        if (d.includes('thunder'))
            return 'from-gray-700 to-gray-900';
        if (d.includes('rain') || d.includes('drizzle'))
            return 'from-blue-600 to-blue-800';
        if (d.includes('cloud'))
            return 'from-blue-400 to-blue-600';
        if (d.includes('clear'))
            return 'from-orange-400 to-yellow-500';
        return 'from-blue-500 to-blue-700';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Header */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600
                           to-blue-800 text-white py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-3">
                        ⛅ {t('weather.title')}
                    </h1>
                    <p className="text-blue-100 text-lg mb-8">
                        Plan your farming activities with
                        accurate weather data
                    </p>

                    {/* Search Bar */}
                    <div className="flex gap-3 max-w-lg
                                    mx-auto">
                        <input
                            type="text"
                            value={city}
                            onChange={(e) =>
                                setCity(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter'
                                && handleSearch()}
                            placeholder={t('weather.searchCity')}
                            className="flex-1 px-5 py-4
                                       rounded-2xl text-gray-800
                                       text-lg outline-none
                                       shadow-lg"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSearch()}
                            disabled={loading}
                            className="bg-white text-blue-700
                                       px-6 py-4 rounded-2xl
                                       font-bold shadow-lg
                                       hover:bg-blue-50
                                       transition-colors
                                       flex items-center gap-2">
                            <Search size={20}/>
                            {loading ? '...'
                                : t('weather.search')}
                        </motion.button>
                    </div>

                    {/* Popular Cities */}
                    <div className="flex flex-wrap justify-center
                                    gap-2 mt-5">
                        {popularCities.map((c) => (
                            <motion.button
                                key={c}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSearch(c)}
                                className="bg-white/20
                                           hover:bg-white/30
                                           text-white px-4 py-2
                                           rounded-full text-sm
                                           transition-colors
                                           backdrop-blur-sm">
                                📍 {c}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.section>

            <div className="max-w-4xl mx-auto px-4 py-8">

                {loading && (
                    <div className="text-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                            className="w-16 h-16 border-4
                                       border-blue-500
                                       border-t-transparent
                                       rounded-full mx-auto mb-4"/>
                        <p className="text-gray-500 text-lg">
                            Fetching weather data...
                        </p>
                    </div>
                )}

                {!loading && !weather && (
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="text-center py-20">
                        <div className="text-8xl mb-6">🌍</div>
                        <h2 className="text-2xl font-bold
                                       text-gray-600 mb-3">
                            Search for your city
                        </h2>
                        <p className="text-gray-400">
                            Enter a city name or click on
                            popular cities above
                        </p>
                    </motion.div>
                )}

                {!loading && weather && (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6">

                        {/* Main Weather Card */}
                        <motion.div
                            variants={fadeInUp}
                            className={`bg-gradient-to-br
                                ${getBgColor(weather.description)}
                                rounded-3xl p-8 text-white
                                shadow-xl`}>
                            <div className="flex justify-between
                                            items-start">
                                <div>
                                    <div className="flex
                                                    items-center
                                                    gap-2 mb-2">
                                        <MapPin size={18}/>
                                        <span className="text-lg
                                                          font-medium
                                                          opacity-90">
                                            {weather.city},
                                            {weather.country}
                                        </span>
                                    </div>
                                    <div className="text-8xl
                                                    font-bold mb-2">
                                        {Math.round(
                                            weather.temperature
                                        )}°C
                                    </div>
                                    <p className="text-xl
                                                  opacity-90
                                                  capitalize">
                                        {weather.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-8xl">
                                        {getWeatherEmoji(
                                            weather.description)}
                                    </div>
                                    {weather.iconUrl && (
                                        <img
                                            src={weather.iconUrl}
                                            alt="weather"
                                            className="w-16 h-16
                                                       mx-auto"/>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Stats Row */}
                        <motion.div
                            variants={staggerItem}
                            className="grid grid-cols-2
                                       md:grid-cols-4 gap-4">
                            {[
                                {
                                    icon: <Thermometer
                                            size={24}
                                            className="text-orange-500"/>,
                                    label: t('weather.feelsLike'),
                                    value: `${Math.round(
                                        weather.feelsLike)}°C`,
                                    bg: 'bg-orange-50'
                                },
                                {
                                    icon: <Droplets
                                            size={24}
                                            className="text-blue-500"/>,
                                    label: t('weather.humidity'),
                                    value: `${Math.round(
                                        weather.humidity)}%`,
                                    bg: 'bg-blue-50'
                                },
                                {
                                    icon: <Wind
                                            size={24}
                                            className="text-teal-500"/>,
                                    label: t('weather.wind'),
                                    value: `${Math.round(
                                        weather.windSpeed)} m/s`,
                                    bg: 'bg-teal-50'
                                },
                                {
                                    icon: <Eye
                                            size={24}
                                            className="text-purple-500"/>,
                                    label: 'Condition',
                                    value: weather.description
                                        ?.split(' ')
                                        .map(w => w[0]
                                            .toUpperCase()
                                            + w.slice(1))
                                        .join(' '),
                                    bg: 'bg-purple-50'
                                },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.03 }}
                                    className={`${stat.bg}
                                        rounded-2xl p-4
                                        flex flex-col
                                        items-center gap-2
                                        text-center
                                        border border-white`}>
                                    {stat.icon}
                                    <p className="text-gray-500
                                                  text-sm">
                                        {stat.label}
                                    </p>
                                    <p className="font-bold
                                                  text-gray-800
                                                  text-lg">
                                        {stat.value}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Farming Advice Card */}
                        {weather.farmingAdvice && (
                            <motion.div
                                variants={staggerItem}
                                className="bg-green-50
                                           border-2
                                           border-green-200
                                           rounded-2xl p-6">
                                <h3 className="font-bold
                                               text-green-800
                                               text-xl mb-3
                                               flex items-center
                                               gap-2">
                                    🌾 {t('weather.farmingAdvice')}
                                </h3>
                                <p className="text-green-700
                                              text-lg leading-relaxed">
                                    {weather.farmingAdvice}
                                </p>
                            </motion.div>
                        )}

                        {/* 5 Day Forecast */}
                        {weather.forecast?.length > 0 && (
                            <motion.div
                                variants={staggerItem}
                                className="bg-white rounded-2xl
                                           border-2 border-gray-100
                                           p-6">
                                <h3 className="font-bold
                                               text-gray-800
                                               text-xl mb-4">
                                    📅 {t('weather.forecast')}
                                </h3>
                                <div className="grid
                                    grid-cols-2
                                    md:grid-cols-5 gap-3">
                                    {weather.forecast.map(
                                        (day, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{
                                                scale: 1.05
                                            }}
                                            className="bg-blue-50
                                                       rounded-xl
                                                       p-3
                                                       text-center">
                                            <p className="text-xs
                                                          text-gray-500
                                                          mb-1">
                                                {day.date
                                                    ?.split(' ')[0]}
                                            </p>
                                            <div className="text-2xl
                                                            my-1">
                                                {getWeatherEmoji(
                                                    day.description)}
                                            </div>
                                            {day.iconUrl && (
                                                <img
                                                    src={day.iconUrl}
                                                    alt="forecast"
                                                    className="w-8 h-8 mx-auto"/>
                                            )}
                                            <p className="font-bold
                                                          text-blue-800
                                                          text-sm">
                                                {Math.round(
                                                    day.maxTemp)}°
                                            </p>
                                            <p className="text-blue-400
                                                          text-xs">
                                                {Math.round(
                                                    day.minTemp)}°
                                            </p>
                                            <p className="text-xs
                                                          text-gray-500
                                                          mt-1
                                                          capitalize">
                                                {day.description}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Weather;