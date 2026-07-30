import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getProductById } from '../api/productApi';
import { addToCart } from '../api/cartApi';
import { setCart } from '../redux/cartSlice';
import useTranslation from '../utils/useTranslation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import {
    fadeInLeft, fadeInRight,
    staggerContainer, staggerItem
} from '../utils/animations';
import {
    ShoppingCart, ArrowLeft,
    Package, Tag, Layers,
    CheckCircle, XCircle, Star
} from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { isLoggedIn } = useSelector(
            (state) => state.auth);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await getProductById(id);
            setProduct(res.data);
        } catch {
            toast.error('Product not found');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            toast.error('Please login first!');
            navigate('/login');
            return;
        }
        setAddingToCart(true);
        try {
            const res = await addToCart({
                productId: product.id,
                quantity
            });
            dispatch(setCart(res.data));
            toast.success(
                `${quantity} × ${product.name} added! 🛒`);
        } catch (error) {
            toast.error(
                error.response?.data?.error
                || 'Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4
                                py-12">
                    <div className="grid grid-cols-1
                                    md:grid-cols-2 gap-12">
                        <div className="bg-gray-200 rounded-3xl
                                        h-96 animate-pulse"/>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i}
                                     className="bg-gray-200
                                                rounded-xl h-10
                                                animate-pulse"/>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: -5 }}
                    onClick={() => navigate('/products')}
                    className="flex items-center gap-2
                               text-gray-600 hover:text-green-600
                               font-medium mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    {t('common.back')} to Products
                </motion.button>

                <div className="grid grid-cols-1 md:grid-cols-2
                                gap-12">

                    {/* ── LEFT — Product Image ──────── */}
                    <motion.div
                        variants={fadeInLeft}
                        initial="hidden"
                        animate="visible">

                        <div className="bg-gradient-to-br
                                        from-green-50
                                        to-emerald-100
                                        rounded-3xl p-8
                                        flex items-center
                                        justify-center
                                        h-96 relative
                                        overflow-hidden
                                        shadow-inner">

                            {/* Animated background */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 30,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute inset-0
                                           border-4 border-dashed
                                           border-green-200
                                           rounded-3xl m-4"/>

                            {product.imageUrl ? (
                                <motion.img
                                    initial={{ scale: 0.8,
                                               opacity: 0 }}
                                    animate={{ scale: 1,
                                               opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-80
                                               object-contain
                                               relative z-10
                                               drop-shadow-xl"/>
                            ) : (
                                <motion.span
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 3, -3, 0]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity
                                    }}
                                    className="text-9xl
                                               relative z-10">
                                    🌱
                                </motion.span>
                            )}

                            {/* Discount badge */}
                            {product.discountPercentage > 0 && (
                                <motion.div
                                    initial={{ scale: 0,
                                               rotate: -20 }}
                                    animate={{ scale: 1,
                                               rotate: -12 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300
                                    }}
                                    className="absolute top-4
                                               right-4 bg-red-500
                                               text-white font-bold
                                               px-4 py-2 rounded-2xl
                                               shadow-lg z-20">
                                    {Math.round(
                                        product.discountPercentage
                                    )}% OFF!
                                </motion.div>
                            )}
                        </div>

                        {/* Trust badges */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-3 gap-3
                                       mt-4">
                            {[
                                { icon: '🌿',
                                  text: 'Organic\nCertified' },
                                { icon: '🚚',
                                  text: 'Fast\nDelivery' },
                                { icon: '💯',
                                  text: 'Quality\nGuaranteed' },
                            ].map((badge) => (
                                <motion.div
                                    key={badge.text}
                                    variants={staggerItem}
                                    whileHover={{ y: -3 }}
                                    className="bg-white rounded-2xl
                                               p-3 text-center
                                               border-2
                                               border-gray-100
                                               shadow-sm">
                                    <span className="text-2xl
                                                     block mb-1">
                                        {badge.icon}
                                    </span>
                                    <p className="text-xs
                                                  font-medium
                                                  text-gray-600
                                                  whitespace-pre-line">
                                        {badge.text}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ── RIGHT — Product Info ──────── */}
                    <motion.div
                        variants={fadeInRight}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6">

                        {/* Category tag */}
                        <motion.span
                            initial={{ opacity: 0,
                                       scale: 0.8 }}
                            animate={{ opacity: 1,
                                       scale: 1 }}
                            className="inline-flex items-center
                                       gap-2 bg-green-100
                                       text-green-700 px-4 py-2
                                       rounded-full font-medium
                                       text-sm">
                            <Tag size={14} />
                            {product.categoryName}
                        </motion.span>

                        {/* Product name */}
                        <h1 className="text-4xl font-bold
                                       text-gray-800 leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating (static for now) */}
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0,
                                                   scale: 0 }}
                                        animate={{ opacity: 1,
                                                   scale: 1 }}
                                        transition={{
                                            delay: i * 0.1
                                        }}>
                                        <Star
                                            size={20}
                                            className="text-yellow-400
                                                       fill-yellow-400"/>
                                    </motion.div>
                                ))}
                            </div>
                            <span className="text-gray-500
                                             text-sm">
                                (4.8 rating)
                            </span>
                        </div>

                        {/* Price section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-r
                                       from-green-50
                                       to-emerald-50
                                       rounded-2xl p-5
                                       border-2
                                       border-green-100">
                            <div className="flex items-baseline
                                            gap-3">
                                <span className="text-5xl font-bold
                                                 text-green-600">
                                    ₹{product.price}
                                </span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-2xl
                                                         text-gray-400
                                                         line-through">
                                            ₹{product.originalPrice}
                                        </span>
                                        <span className="bg-red-100
                                                         text-red-600
                                                         font-bold
                                                         px-3 py-1
                                                         rounded-xl
                                                         text-sm">
                                            Save ₹{
                                                (product.originalPrice
                                                - product.price)
                                                .toFixed(2)
                                            }
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-green-600
                                          text-sm mt-1">
                                Per {product.unit || 'unit'} •
                                Inclusive of all taxes
                            </p>
                        </motion.div>

                        {/* Product details */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-2 gap-4">
                            {[
                                {
                                    icon: <Package size={18}
                                          className="text-blue-600"/>,
                                    label: 'Category',
                                    value: product.categoryName,
                                    bg: 'bg-blue-50'
                                },
                                {
                                    icon: <Layers size={18}
                                          className="text-purple-600"/>,
                                    label: t('productDetail.stock'),
                                    value: `${product.stockQuantity} units`,
                                    bg: 'bg-purple-50'
                                },
                                {
                                    icon: <Tag size={18}
                                          className="text-orange-600"/>,
                                    label: t('productDetail.unit'),
                                    value: product.unit || 'N/A',
                                    bg: 'bg-orange-50'
                                },
                                {
                                    icon: product.isAvailable
                                        ? <CheckCircle size={18}
                                            className="text-green-600"/>
                                        : <XCircle size={18}
                                            className="text-red-600"/>,
                                    label: 'Availability',
                                    value: product.isAvailable
                                        ? t('products.inStock')
                                        : t('products.outOfStock'),
                                    bg: product.isAvailable
                                        ? 'bg-green-50'
                                        : 'bg-red-50'
                                },
                            ].map((item) => (
                                <motion.div
                                    key={item.label}
                                    variants={staggerItem}
                                    whileHover={{ scale: 1.02 }}
                                    className={`${item.bg}
                                                rounded-2xl p-4
                                                flex items-center
                                                gap-3`}>
                                    <div className="bg-white
                                                    p-2 rounded-xl
                                                    shadow-sm">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs
                                                      text-gray-500">
                                            {item.label}
                                        </p>
                                        <p className="font-bold
                                                      text-gray-800
                                                      text-sm">
                                            {item.value}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Quantity selector */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}>
                            <label className="block font-bold
                                              text-gray-700 mb-3">
                                {t('productDetail.quantity')}
                            </label>
                            <div className="flex items-center
                                            gap-4">
                                <div className="flex items-center
                                                bg-white border-2
                                                border-gray-200
                                                rounded-2xl
                                                overflow-hidden">
                                    <motion.button
                                        whileHover={{
                                            backgroundColor: '#f3f4f6'
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() =>
                                            setQuantity(
                                                Math.max(1,
                                                    quantity - 1))}
                                        className="px-5 py-3
                                                   text-xl font-bold
                                                   text-gray-600
                                                   transition-colors">
                                        −
                                    </motion.button>
                                    <span className="px-6 py-3
                                                     text-xl
                                                     font-bold
                                                     text-gray-800
                                                     min-w-16
                                                     text-center">
                                        {quantity}
                                    </span>
                                    <motion.button
                                        whileHover={{
                                            backgroundColor: '#f3f4f6'
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() =>
                                            setQuantity(
                                                Math.min(
                                                    product.stockQuantity,
                                                    quantity + 1))}
                                        className="px-5 py-3
                                                   text-xl font-bold
                                                   text-gray-600
                                                   transition-colors">
                                        +
                                    </motion.button>
                                </div>
                                <span className="text-gray-500
                                                 text-sm">
                                    Total:{' '}
                                    <span className="font-bold
                                                     text-green-600
                                                     text-lg">
                                        ₹{(product.price
                                           * quantity).toFixed(2)}
                                    </span>
                                </span>
                            </div>
                        </motion.div>

                        {/* Action buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex gap-4">

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                disabled={!product.isAvailable
                                          || addingToCart}
                                className="flex-1 bg-green-600
                                           hover:bg-green-700
                                           disabled:bg-gray-300
                                           text-white font-bold
                                           py-4 rounded-2xl
                                           text-lg transition-colors
                                           flex items-center
                                           justify-center gap-2
                                           shadow-lg
                                           shadow-green-200">
                                {addingToCart ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        className="w-6 h-6 border-2
                                                   border-white
                                                   border-t-transparent
                                                   rounded-full"/>
                                ) : (
                                    <>
                                        <ShoppingCart size={22} />
                                        {t('products.addToCart')}
                                    </>
                                )}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleBuyNow}
                                disabled={!product.isAvailable}
                                className="flex-1 bg-orange-500
                                           hover:bg-orange-600
                                           disabled:bg-gray-300
                                           text-white font-bold
                                           py-4 rounded-2xl
                                           text-lg transition-colors
                                           shadow-lg
                                           shadow-orange-200">
                                ⚡ {t('productDetail.buyNow')}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── TABS SECTION ──────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 bg-white rounded-3xl
                               border-2 border-gray-100
                               overflow-hidden">

                    {/* Tab buttons */}
                    <div className="flex border-b-2
                                    border-gray-100">
                        {['description',
                          'details',
                          'shipping'].map((tab) => (
                            <motion.button
                                key={tab}
                                whileHover={{ y: -2 }}
                                onClick={() =>
                                    setActiveTab(tab)}
                                className={`px-8 py-4 font-bold
                                            capitalize transition-all
                                            ${activeTab === tab
                                                ? 'border-b-4 border-green-600 text-green-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                            }`}>
                                {tab}
                            </motion.button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-8">

                        {activeTab === 'description' && (
                            <div>
                                <h3 className="text-xl font-bold
                                               text-gray-800 mb-4">
                                    Product Description
                                </h3>
                                <p className="text-gray-600
                                              leading-relaxed
                                              text-lg">
                                    {product.description
                                     || 'Premium quality farming product. Suitable for all types of crops and soil conditions. Tested and certified by agricultural experts.'}
                                </p>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="grid grid-cols-2
                                            md:grid-cols-3 gap-6">
                                {[
                                    { label: 'Product Name',
                                      value: product.name },
                                    { label: 'Category',
                                      value: product.categoryName },
                                    { label: 'Unit',
                                      value: product.unit
                                             || 'N/A' },
                                    { label: 'Stock',
                                      value: `${product.stockQuantity} available` },
                                    { label: 'Price',
                                      value: `₹${product.price}` },
                                    { label: 'Status',
                                      value: product.isAvailable
                                          ? 'Available'
                                          : 'Unavailable' },
                                ].map((detail) => (
                                    <div key={detail.label}
                                         className="bg-gray-50
                                                    rounded-2xl p-4">
                                        <p className="text-sm
                                                      text-gray-500
                                                      mb-1">
                                            {detail.label}
                                        </p>
                                        <p className="font-bold
                                                      text-gray-800">
                                            {detail.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div className="space-y-4">
                                {[
                                    { icon: '🚚',
                                      title: 'Free Delivery',
                                      desc: 'On orders above ₹500' },
                                    { icon: '📦',
                                      title: 'Secure Packaging',
                                      desc: 'Products packed safely' },
                                    { icon: '⏰',
                                      title: 'Delivery Time',
                                      desc: '3-7 business days' },
                                    { icon: '↩️',
                                      title: 'Easy Returns',
                                      desc: '7-day return policy' },
                                ].map((item) => (
                                    <motion.div
                                        key={item.title}
                                        whileHover={{ x: 5 }}
                                        className="flex items-center
                                                   gap-4 p-4
                                                   bg-gray-50
                                                   rounded-2xl">
                                        <span className="text-3xl">
                                            {item.icon}
                                        </span>
                                        <div>
                                            <p className="font-bold
                                                          text-gray-800">
                                                {item.title}
                                            </p>
                                            <p className="text-gray-500
                                                          text-sm">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetail;