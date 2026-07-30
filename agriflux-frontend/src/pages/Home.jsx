import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { getFeaturedProducts, getAllCategories }
    from '../api/productApi';
import { addToCart } from '../api/cartApi';
import { setCart } from '../redux/cartSlice';
import useTranslation from '../utils/useTranslation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import {
    fadeInUp, fadeInLeft, fadeInRight,
    staggerContainer, staggerItem,
    scaleIn, bounceIn
} from '../utils/animations';
import {
    ShoppingCart, ArrowRight,
    Truck, Shield, Headphones, Leaf
} from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { isLoggedIn } = useSelector(
            (state) => state.auth);

    const [featured, setFeatured] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Typing animation for hero title
    const [displayText, setDisplayText] = useState('');
    const fullText = t('home.heroTitle');

    useEffect(() => {
        let index = 0;
        setDisplayText('');
        const timer = setInterval(() => {
            if (index < fullText.length) {
                setDisplayText(fullText.slice(0, index + 1));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 50);
        return () => clearInterval(timer);
    }, [fullText]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [featRes, catRes] = await Promise.all([
                getFeaturedProducts(),
                getAllCategories()
            ]);
            setFeatured(featRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        if (!isLoggedIn) {
            toast.error('Please login to add items!');
            navigate('/login');
            return;
        }
        try {
            const res = await addToCart({
                productId, quantity: 1 });
            dispatch(setCart(res.data));
            toast.success('Added to cart! 🛒');
        } catch {
            toast.error('Failed to add to cart');
        }
    };

    const categoryEmoji = {
        'Seeds': '🌱', 'Fertilizers': '🧪',
        'Tools': '🔧', 'Pesticides': '🛡️',
        'Irrigation': '💧', 'default': '🌾'
    };

    return (
        <div className="min-h-screen bg-gray-50
                        overflow-x-hidden">
            <Navbar />

            {/* ── HERO SECTION ─────────────────────── */}
            <section className="bg-gradient-to-br
                                from-green-600 via-green-700
                                to-emerald-800 text-white
                                py-20 px-4 relative
                                overflow-hidden">

                {/* Animated Background Circles */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-10 right-10
                               w-96 h-96 bg-white rounded-full
                               opacity-10"/>

                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.05, 0.15, 0.05]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -bottom-20 -left-20
                               w-80 h-80 bg-yellow-300
                               rounded-full opacity-10"/>

                <div className="max-w-7xl mx-auto relative
                                z-10">
                    <div className="grid grid-cols-1
                                    md:grid-cols-2 gap-12
                                    items-center">

                        {/* Left Content */}
                        <motion.div
                            variants={fadeInLeft}
                            initial="hidden"
                            animate="visible">

                            <motion.div
                                variants={bounceIn}
                                initial="hidden"
                                animate="visible"
                                className="inline-flex items-center
                                           gap-2 bg-green-500
                                           bg-opacity-30 px-4 py-2
                                           rounded-full mb-6">
                                <Leaf size={16} />
                                <span className="text-sm
                                                 font-medium">
                                    #1 Agriculture Platform
                                    in India
                                </span>
                            </motion.div>

                            {/* Typing Animation Title */}
                            <h1 className="text-4xl md:text-6xl
                                           font-bold leading-tight
                                           mb-6">
                                {displayText}
                                <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity
                                    }}
                                    className="inline-block
                                               w-1 h-14 bg-white
                                               ml-1 align-middle"/>
                            </h1>

                            <motion.p
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                className="text-green-100 text-lg
                                           md:text-xl leading-relaxed
                                           mb-8 max-w-lg">
                                {t('home.heroSubtitle')}
                            </motion.p>

                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-wrap gap-4">

                                <motion.div
                                    variants={staggerItem}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}>
                                    <Link to="/products"
                                          className="bg-white
                                                     text-green-700
                                                     font-bold px-8
                                                     py-4 rounded-2xl
                                                     hover:bg-green-50
                                                     transition-all
                                                     text-lg flex
                                                     items-center
                                                     gap-2 shadow-lg">
                                        <ShoppingCart size={22} />
                                        {t('home.shopNow')}
                                    </Link>
                                </motion.div>

                                <motion.div
                                    variants={staggerItem}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}>
                                    <Link to="/weather"
                                          className="border-2
                                                     border-white
                                                     text-white
                                                     font-bold px-8
                                                     py-4 rounded-2xl
                                                     hover:bg-white
                                                     hover:text-green-700
                                                     transition-all
                                                     text-lg flex
                                                     items-center
                                                     gap-2">
                                        🌦️ {t('home.checkWeather')}
                                    </Link>
                                </motion.div>
                            </motion.div>

                            {/* Animated Stats */}
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="flex gap-8 mt-12">
                                {[
                                    { num: '10K+',
                                      label: 'Farmers' },
                                    { num: '500+',
                                      label: 'Products' },
                                    { num: '28',
                                      label: 'States' },
                                ].map((stat) => (
                                    <motion.div
                                        key={stat.label}
                                        variants={staggerItem}>
                                        <p className="text-3xl
                                                      font-bold">
                                            {stat.num}
                                        </p>
                                        <p className="text-green-200
                                                      text-sm">
                                            {stat.label}
                                        </p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right — Floating Illustration */}
                        <motion.div
                            variants={fadeInRight}
                            initial="hidden"
                            animate="visible"
                            className="hidden md:flex
                                       justify-center">
                            <div className="relative">
                                {/* Rotating ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 20,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="w-80 h-80
                                               border-4
                                               border-dashed
                                               border-green-400
                                               border-opacity-30
                                               rounded-full
                                               absolute"/>

                                {/* Main circle */}
                                <div className="w-80 h-80
                                                bg-green-500
                                                bg-opacity-20
                                                rounded-full
                                                flex items-center
                                                justify-center">
                                    <motion.span
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            rotate: [0, 5, -5, 0]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="text-9xl">
                                        🌾
                                    </motion.span>
                                </div>

                                {/* Floating cards */}
                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute -top-4
                                               -right-4 bg-white
                                               text-gray-800
                                               rounded-2xl p-3
                                               shadow-xl">
                                    <p className="font-bold
                                                  text-green-600">
                                        ✅ Organic
                                    </p>
                                    <p className="text-sm
                                                  text-gray-500">
                                        Certified
                                    </p>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [10, -10, 10] }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute
                                               -bottom-4 -left-4
                                               bg-white text-gray-800
                                               rounded-2xl p-3
                                               shadow-xl">
                                    <p className="font-bold
                                                  text-orange-600">
                                        🚚 Fast
                                    </p>
                                    <p className="text-sm
                                                  text-gray-500">
                                        Pan India
                                    </p>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [-5, 15, -5] }}
                                    transition={{
                                        duration: 3.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute top-1/2
                                               -left-16 bg-white
                                               text-gray-800
                                               rounded-2xl p-3
                                               shadow-xl">
                                    <p className="font-bold
                                                  text-blue-600">
                                        💳 COD
                                    </p>
                                    <p className="text-sm
                                                  text-gray-500">
                                        Available
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── WHY CHOOSE US ─────────────────────── */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-3xl font-bold
                                   text-center text-gray-800
                                   mb-12">
                        {t('home.whyUs')} 🌟
                    </motion.h2>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1
                                   md:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Leaf size={32}
                                      className="text-green-600"/>,
                                title: 'Quality Products',
                                desc: 'Certified organic products',
                                bg: 'bg-green-50',
                                color: 'text-green-600'
                            },
                            {
                                icon: <Truck size={32}
                                      className="text-blue-600"/>,
                                title: 'Fast Delivery',
                                desc: 'Delivery across all 28 states',
                                bg: 'bg-blue-50',
                                color: 'text-blue-600'
                            },
                            {
                                icon: <Shield size={32}
                                      className="text-purple-600"/>,
                                title: 'Secure Payment',
                                desc: 'Multiple payment options',
                                bg: 'bg-purple-50',
                                color: 'text-purple-600'
                            },
                            {
                                icon: <Headphones size={32}
                                      className="text-orange-600"/>,
                                title: '24/7 Support',
                                desc: 'Expert farming assistance',
                                bg: 'bg-orange-50',
                                color: 'text-orange-600'
                            },
                        ].map((item) => (
                            <motion.div
                                key={item.title}
                                variants={staggerItem}
                                whileHover={{
                                    y: -10,
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                                }}
                                className={`${item.bg} rounded-2xl
                                            p-6 text-center
                                            cursor-pointer
                                            transition-shadow`}>
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                    className="flex justify-center
                                               mb-4">
                                    <div className="bg-white p-4
                                                    rounded-xl
                                                    shadow-sm">
                                        {item.icon}
                                    </div>
                                </motion.div>
                                <h3 className="font-bold text-lg
                                               text-gray-800 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500
                                              text-sm">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CATEGORIES ────────────────────────── */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex justify-between
                                   items-center mb-10">
                        <h2 className="text-3xl font-bold
                                       text-gray-800">
                            {t('home.categories')} 🗂️
                        </h2>
                        <Link to="/products"
                              className="flex items-center gap-2
                                         text-green-600 font-bold
                                         hover:underline">
                            View All
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2
                                   md:grid-cols-5 gap-4">
                        {loading
                            ? [...Array(5)].map((_, i) => (
                                <div key={i}
                                     className="bg-white rounded-2xl
                                                p-6 animate-pulse
                                                h-32"/>
                            ))
                            : categories.map((cat) => (
                                <motion.div
                                    key={cat.id}
                                    variants={staggerItem}
                                    whileHover={{
                                        scale: 1.05,
                                        y: -5
                                    }}
                                    whileTap={{ scale: 0.95 }}>
                                    <Link
                                        to={`/products?category=${cat.id}`}
                                        className="bg-white
                                                   rounded-2xl p-6
                                                   text-center
                                                   hover:shadow-xl
                                                   border-2
                                                   border-transparent
                                                   hover:border-green-300
                                                   transition-all
                                                   block group">
                                        <motion.span
                                            animate={{
                                                rotate: [0, 10,
                                                        -10, 0]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: Math.random() * 2
                                            }}
                                            className="text-5xl mb-3
                                                       block">
                                            {categoryEmoji[cat.name]
                                             || categoryEmoji.default}
                                        </motion.span>
                                        <p className="font-bold
                                                      text-gray-800">
                                            {cat.name}
                                        </p>
                                        <p className="text-green-600
                                                      text-sm mt-1">
                                            {cat.productCount} items
                                        </p>
                                    </Link>
                                </motion.div>
                            ))
                        }
                    </motion.div>
                </div>
            </section>

            {/* ── FEATURED PRODUCTS ─────────────────── */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex justify-between
                                   items-center mb-10">
                        <h2 className="text-3xl font-bold
                                       text-gray-800">
                            {t('home.featured')} ⭐
                        </h2>
                        <Link to="/products"
                              className="flex items-center gap-2
                                         text-green-600 font-bold
                                         hover:underline">
                            View All
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1
                                   md:grid-cols-4 gap-6">
                        {loading
                            ? [...Array(4)].map((_, i) => (
                                <div key={i}
                                     className="bg-gray-100
                                                rounded-2xl
                                                animate-pulse
                                                h-72"/>
                            ))
                            : featured.slice(0, 8)
                                      .map((product) => (
                                <motion.div
                                    key={product.id}
                                    variants={staggerItem}
                                    whileHover={{
                                        y: -8,
                                        boxShadow:
                                          "0 25px 50px rgba(0,0,0,0.15)"
                                    }}
                                    className="bg-white rounded-2xl
                                               border-2 border-gray-100
                                               overflow-hidden group
                                               cursor-pointer">

                                    {/* Image */}
                                    <div className="bg-gradient-to-br
                                                    from-green-50
                                                    to-emerald-50
                                                    h-48 flex
                                                    items-center
                                                    justify-center
                                                    relative
                                                    overflow-hidden">
                                        {product.imageUrl ? (
                                            <motion.img
                                                whileHover={{
                                                    scale: 1.1
                                                }}
                                                transition={{
                                                    duration: 0.3
                                                }}
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="h-40
                                                           w-full
                                                           object-cover"
                                            />
                                        ) : (
                                            <motion.span
                                                whileHover={{
                                                    scale: 1.2,
                                                    rotate: 10
                                                }}
                                                className="text-7xl">
                                                🌱
                                            </motion.span>
                                        )}

                                        {product.discountPercentage
                                            > 0 && (
                                            <motion.span
                                                initial={{
                                                    scale: 0
                                                }}
                                                animate={{
                                                    scale: 1
                                                }}
                                                className="absolute
                                                           top-3 left-3
                                                           bg-red-500
                                                           text-white
                                                           text-xs
                                                           font-bold
                                                           px-2 py-1
                                                           rounded-lg">
                                                {Math.round(
                                                    product
                                                    .discountPercentage
                                                )}% OFF
                                            </motion.span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <span className="text-xs
                                                         text-green-600
                                                         font-medium
                                                         bg-green-50
                                                         px-2 py-1
                                                         rounded-lg">
                                            {product.categoryName}
                                        </span>

                                        <h3 className="font-bold
                                                       text-gray-800
                                                       mt-2 mb-1
                                                       text-lg
                                                       line-clamp-1">
                                            {product.name}
                                        </h3>

                                        <div className="flex
                                                        items-center
                                                        justify-between
                                                        mb-3">
                                            <div>
                                                <span className="text-2xl
                                                                 font-bold
                                                                 text-green-600">
                                                    ₹{product.price}
                                                </span>
                                                {product.originalPrice
                                                    && (
                                                    <span className="text-gray-400
                                                                     line-through
                                                                     ml-2
                                                                     text-sm">
                                                        ₹{product
                                                           .originalPrice}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs
                                                             text-gray-500">
                                                {product.unit}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.02
                                                }}
                                                whileTap={{
                                                    scale: 0.95
                                                }}
                                                onClick={() =>
                                                    handleAddToCart(
                                                        product.id)}
                                                className="flex-1
                                                           bg-green-600
                                                           hover:bg-green-700
                                                           text-white
                                                           font-bold
                                                           py-2.5
                                                           rounded-xl
                                                           text-sm
                                                           transition-colors
                                                           flex items-center
                                                           justify-center
                                                           gap-1">
                                                <ShoppingCart
                                                    size={16}/>
                                                {t('products.addToCart')}
                                            </motion.button>

                                            <motion.div
                                                whileHover={{
                                                    scale: 1.05
                                                }}
                                                whileTap={{
                                                    scale: 0.95
                                                }}>
                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="bg-gray-100
                                                               hover:bg-gray-200
                                                               text-gray-700
                                                               font-bold
                                                               py-2.5
                                                               px-3
                                                               rounded-xl
                                                               text-sm
                                                               transition-colors
                                                               block">
                                                    👁️
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        }
                    </motion.div>
                </div>
            </section>

            {/* ── WEATHER BANNER ────────────────────── */}
            <motion.section
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="py-16 px-4 bg-gradient-to-r
                           from-blue-600 to-cyan-600
                           text-white overflow-hidden
                           relative">

                <motion.div
                    animate={{ x: [-100, 100, -100] }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-0 left-0 w-full
                               h-full opacity-10">
                    <div className="flex gap-20 text-6xl
                                    whitespace-nowrap">
                        ☀️ 🌧️ ⛅ 🌩️ 🌈 ☁️ 🌤️ 🌦️
                        ☀️ 🌧️ ⛅ 🌩️ 🌈 ☁️ 🌤️ 🌦️
                    </div>
                </motion.div>

                <div className="max-w-7xl mx-auto text-center
                                relative z-10">
                    <motion.span
                        animate={{
                            rotate: [0, 20, -20, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}
                        className="text-6xl block mb-4">
                        🌦️
                    </motion.span>

                    <h2 className="text-3xl font-bold mb-4">
                        Check Weather Before Farming
                    </h2>
                    <p className="text-blue-100 text-lg mb-8
                                  max-w-2xl mx-auto">
                        Get real-time weather + AI farming advice
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        <Link to="/weather"
                              className="bg-white text-blue-600
                                         font-bold px-8 py-4
                                         rounded-2xl hover:bg-blue-50
                                         transition-all text-lg
                                         inline-flex items-center
                                         gap-2">
                            🌾 {t('home.checkWeather')}
                            <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            {/* ── AGRIBOT BANNER ────────────────────── */}
            <section className="py-16 px-4 bg-gray-900
                                text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1
                                    md:grid-cols-2 gap-12
                                    items-center">

                        <motion.div
                            variants={fadeInLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold
                                           mb-4">
                                🤖 Meet AgriBot
                            </h2>
                            <p className="text-gray-300 text-lg
                                          leading-relaxed mb-6">
                                AI farming assistant available
                                24/7 in Hindi and English
                            </p>
                            <motion.ul
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="space-y-3 mb-8">
                                {[
                                    '✅ Crop disease diagnosis',
                                    '✅ Fertilizer recommendations',
                                    '✅ Weather-based advice',
                                    '✅ Hindi & English support',
                                ].map((item) => (
                                    <motion.li
                                        key={item}
                                        variants={staggerItem}
                                        className="text-gray-300
                                                   flex items-center
                                                   gap-2">
                                        {item}
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </motion.div>

                        {/* Animated Chat Preview */}
                        <motion.div
                            variants={fadeInRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="bg-gray-800 rounded-3xl p-6">
                            <AnimatePresence>
                                <div className="space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0,
                                                   x: -30 }}
                                        animate={{ opacity: 1,
                                                   x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex gap-3">
                                        <span className="text-2xl">
                                            🤖
                                        </span>
                                        <div className="bg-gray-700
                                                        rounded-2xl
                                                        rounded-tl-none
                                                        p-4 text-gray-200
                                                        text-sm
                                                        max-w-xs">
                                            Hello! I am AgriBot.
                                            How can I help you?
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0,
                                                   x: 30 }}
                                        animate={{ opacity: 1,
                                                   x: 0 }}
                                        transition={{ delay: 1.2 }}
                                        className="flex gap-3
                                                   justify-end">
                                        <div className="bg-green-600
                                                        rounded-2xl
                                                        rounded-tr-none
                                                        p-4 text-white
                                                        text-sm
                                                        max-w-xs">
                                            My tomatoes have
                                            yellow leaves 🍅
                                        </div>
                                        <span className="text-2xl">
                                            👨‍🌾
                                        </span>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0,
                                                   x: -30 }}
                                        animate={{ opacity: 1,
                                                   x: 0 }}
                                        transition={{ delay: 2.0 }}
                                        className="flex gap-3">
                                        <span className="text-2xl">
                                            🤖
                                        </span>
                                        <div className="bg-gray-700
                                                        rounded-2xl
                                                        rounded-tl-none
                                                        p-4 text-gray-200
                                                        text-sm
                                                        max-w-xs">
                                            Yellow leaves indicate
                                            nitrogen deficiency.
                                            Apply NPK fertilizer! 🌿
                                        </div>
                                    </motion.div>

                                    {/* Typing indicator */}
                                    <motion.div
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: 3
                                        }}
                                        className="flex gap-3">
                                        <span className="text-2xl">
                                            🤖
                                        </span>
                                        <div className="bg-gray-700
                                                        rounded-2xl
                                                        rounded-tl-none
                                                        p-3 flex gap-1
                                                        items-center">
                                            <span className="w-2 h-2
                                                             bg-gray-400
                                                             rounded-full
                                                             animate-bounce"/>
                                            <span className="w-2 h-2
                                                             bg-gray-400
                                                             rounded-full
                                                             animate-bounce
                                                             delay-100"/>
                                            <span className="w-2 h-2
                                                             bg-gray-400
                                                             rounded-full
                                                             animate-bounce
                                                             delay-200"/>
                                        </div>
                                    </motion.div>
                                </div>
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;