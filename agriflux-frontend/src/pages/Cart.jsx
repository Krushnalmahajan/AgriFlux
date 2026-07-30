import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getCart, updateCartItem,
    removeFromCart, clearCart
} from '../api/cartApi';
import { setCart, clearCartState } from '../redux/cartSlice';
import useTranslation from '../utils/useTranslation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import {
    staggerContainer, staggerItem, fadeInUp
} from '../utils/animations';
import {
    ShoppingCart, Trash2, Plus,
    Minus, ArrowRight, ShoppingBag,
    Tag
} from 'lucide-react';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingItem, setUpdatingItem] = useState(null);
    const [removingItem, setRemovingItem] = useState(null);
    const [clearingCart, setClearingCart] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await getCart();
            setCartData(res.data);
            dispatch(setCart(res.data));
        } catch {
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (
            cartItemId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveItem(cartItemId);
            return;
        }
        setUpdatingItem(cartItemId);
        try {
            const res = await updateCartItem(
                    cartItemId, newQuantity);
            setCartData(res.data);
            dispatch(setCart(res.data));
        } catch (error) {
            toast.error(
                error.response?.data?.error
                || 'Failed to update');
        } finally {
            setUpdatingItem(null);
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        setRemovingItem(cartItemId);
        try {
            const res = await removeFromCart(cartItemId);
            setCartData(res.data);
            dispatch(setCart(res.data));
            toast.success('Item removed from cart');
        } catch {
            toast.error('Failed to remove item');
        } finally {
            setRemovingItem(null);
        }
    };

    const handleClearCart = async () => {
        setClearingCart(true);
        try {
            await clearCart();
            const emptyCart = {
                cartId: cartData.cartId,
                items: [],
                totalItems: 0,
                totalAmount: 0
            };
            setCartData(emptyCart);
            dispatch(clearCartState());
            toast.success('Cart cleared!');
        } catch {
            toast.error('Failed to clear cart');
        } finally {
            setClearingCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1
                                    md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i}
                                     className="bg-white
                                                rounded-2xl p-6
                                                animate-pulse h-32"/>
                            ))}
                        </div>
                        <div className="bg-white rounded-2xl
                                        h-64 animate-pulse"/>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const isEmpty = !cartData?.items?.length;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-600
                           to-emerald-700 text-white
                           py-10 px-4">
                <div className="max-w-6xl mx-auto flex
                                items-center gap-4">
                    <ShoppingCart size={36} />
                    <div>
                        <h1 className="text-3xl font-bold">
                            {t('cart.title')}
                        </h1>
                        <p className="text-green-100">
                            {cartData?.totalItems || 0}{' '}
                            {t('cart.items')} •
                            ₹{cartData?.totalAmount || 0} total
                        </p>
                    </div>
                </div>
            </motion.section>

            <div className="max-w-6xl mx-auto px-4 py-8">

                {isEmpty ? (
                    /* ── EMPTY CART ─────────────────── */
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="text-center py-20">
                        <motion.div
                            animate={{
                                y: [-10, 10, -10],
                                rotate: [-5, 5, -5]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity
                            }}
                            className="text-9xl mb-6">
                            🛒
                        </motion.div>
                        <h2 className="text-3xl font-bold
                                       text-gray-700 mb-4">
                            {t('cart.empty')}
                        </h2>
                        <p className="text-gray-400 text-lg
                                      mb-8">
                            {t('cart.emptyMsg')}
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            <Link to="/products"
                                  className="bg-green-600
                                             hover:bg-green-700
                                             text-white font-bold
                                             px-10 py-4 rounded-2xl
                                             text-lg inline-flex
                                             items-center gap-2
                                             shadow-lg
                                             shadow-green-200">
                                <ShoppingBag size={22} />
                                {t('cart.shopNow')}
                            </Link>
                        </motion.div>
                    </motion.div>

                ) : (
                    /* ── CART WITH ITEMS ──────────────── */
                    <div className="grid grid-cols-1
                                    md:grid-cols-3 gap-8">

                        {/* Cart Items */}
                        <div className="md:col-span-2">

                            {/* Clear cart button */}
                            <div className="flex justify-between
                                            items-center mb-4">
                                <h2 className="font-bold text-xl
                                               text-gray-800">
                                    Your Items
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleClearCart}
                                    disabled={clearingCart}
                                    className="flex items-center
                                               gap-2 text-red-500
                                               hover:text-red-700
                                               font-medium text-sm
                                               bg-red-50 px-4 py-2
                                               rounded-xl
                                               transition-colors">
                                    <Trash2 size={16} />
                                    {clearingCart
                                        ? 'Clearing...'
                                        : t('cart.clearCart')}
                                </motion.button>
                            </div>

                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4">
                                <AnimatePresence>
                                    {cartData.items.map(
                                        (item) => (
                                        <motion.div
                                            key={item.cartItemId}
                                            variants={staggerItem}
                                            layout
                                            exit={{
                                                opacity: 0,
                                                x: -100,
                                                height: 0
                                            }}
                                            transition={{
                                                duration: 0.3
                                            }}
                                            className="bg-white
                                                       rounded-2xl
                                                       border-2
                                                       border-gray-100
                                                       p-5 flex
                                                       items-center
                                                       gap-4
                                                       hover:border-green-200
                                                       transition-colors">

                                            {/* Product image */}
                                            <motion.div
                                                whileHover={{
                                                    scale: 1.05
                                                }}
                                                className="w-24 h-24
                                                           bg-gradient-to-br
                                                           from-green-50
                                                           to-emerald-50
                                                           rounded-2xl
                                                           flex items-center
                                                           justify-center
                                                           shrink-0
                                                           overflow-hidden">
                                                {item.productImage
                                                    ? (
                                                    <img
                                                        src={item.productImage}
                                                        alt={item.productName}
                                                        className="w-full
                                                                   h-full
                                                                   object-cover"/>
                                                ) : (
                                                    <span className="text-4xl">
                                                        🌱
                                                    </span>
                                                )}
                                            </motion.div>

                                            {/* Product info */}
                                            <div className="flex-1
                                                            min-w-0">
                                                <h3 className="font-bold
                                                               text-gray-800
                                                               text-lg
                                                               truncate">
                                                    {item.productName}
                                                </h3>
                                                <div className="flex
                                                                items-center
                                                                gap-2
                                                                mt-1">
                                                    <Tag size={14}
                                                        className="text-green-600"/>
                                                    <span className="text-green-600
                                                                     font-bold
                                                                     text-lg">
                                                        ₹{item.productPrice}
                                                    </span>
                                                    {item.unit && (
                                                        <span className="text-gray-400
                                                                         text-sm">
                                                            / {item.unit}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quantity controls */}
                                            <div className="flex
                                                            items-center
                                                            gap-3
                                                            shrink-0">
                                                <div className="flex
                                                                items-center
                                                                bg-gray-50
                                                                rounded-xl
                                                                border-2
                                                                border-gray-100">
                                                    <motion.button
                                                        whileHover={{
                                                            backgroundColor: '#e5e7eb'
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9
                                                        }}
                                                        onClick={() =>
                                                            handleUpdateQuantity(
                                                                item.cartItemId,
                                                                item.quantity - 1
                                                            )}
                                                        disabled={
                                                            updatingItem
                                                            === item.cartItemId}
                                                        className="p-2
                                                                   rounded-l-xl
                                                                   transition-colors">
                                                        <Minus size={16}
                                                               className="text-gray-600"/>
                                                    </motion.button>

                                                    <span className="px-4
                                                                     py-2
                                                                     font-bold
                                                                     text-gray-800
                                                                     min-w-12
                                                                     text-center">
                                                        {updatingItem
                                                            === item.cartItemId
                                                            ? (
                                                            <motion.div
                                                                animate={{
                                                                    rotate: 360
                                                                }}
                                                                transition={{
                                                                    duration: 0.5,
                                                                    repeat: Infinity,
                                                                    ease: "linear"
                                                                }}
                                                                className="w-4 h-4
                                                                           border-2
                                                                           border-green-500
                                                                           border-t-transparent
                                                                           rounded-full
                                                                           mx-auto"/>
                                                        ) : (
                                                            item.quantity
                                                        )}
                                                    </span>

                                                    <motion.button
                                                        whileHover={{
                                                            backgroundColor: '#e5e7eb'
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9
                                                        }}
                                                        onClick={() =>
                                                            handleUpdateQuantity(
                                                                item.cartItemId,
                                                                item.quantity + 1
                                                            )}
                                                        disabled={
                                                            updatingItem
                                                            === item.cartItemId}
                                                        className="p-2
                                                                   rounded-r-xl
                                                                   transition-colors">
                                                        <Plus size={16}
                                                              className="text-gray-600"/>
                                                    </motion.button>
                                                </div>

                                                {/* Item total */}
                                                <div className="text-right
                                                                min-w-20">
                                                    <p className="font-bold
                                                                  text-gray-800
                                                                  text-lg">
                                                        ₹{item.itemTotal}
                                                    </p>
                                                    <p className="text-xs
                                                                  text-gray-400">
                                                        subtotal
                                                    </p>
                                                </div>

                                                {/* Remove button */}
                                                <motion.button
                                                    whileHover={{
                                                        scale: 1.1,
                                                        color: '#ef4444'
                                                    }}
                                                    whileTap={{
                                                        scale: 0.9
                                                    }}
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            item.cartItemId)}
                                                    disabled={
                                                        removingItem
                                                        === item.cartItemId}
                                                    className="p-2
                                                               text-gray-400
                                                               hover:text-red-500
                                                               transition-colors
                                                               rounded-xl
                                                               hover:bg-red-50">
                                                    {removingItem
                                                        === item.cartItemId
                                                        ? (
                                                        <motion.div
                                                            animate={{
                                                                rotate: 360
                                                            }}
                                                            transition={{
                                                                duration: 0.5,
                                                                repeat: Infinity,
                                                                ease: "linear"
                                                            }}
                                                            className="w-5 h-5
                                                                       border-2
                                                                       border-red-400
                                                                       border-t-transparent
                                                                       rounded-full"/>
                                                    ) : (
                                                        <Trash2 size={20}/>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="h-fit sticky top-24">
                            <div className="bg-white rounded-3xl
                                            border-2 border-gray-100
                                            p-6 shadow-lg">
                                <h2 className="text-xl font-bold
                                               text-gray-800 mb-6
                                               flex items-center
                                               gap-2">
                                    📋 Order Summary
                                </h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between
                                                    text-gray-600">
                                        <span>
                                            Items (
                                            {cartData.totalItems})
                                        </span>
                                        <span>
                                            ₹{cartData.totalAmount}
                                        </span>
                                    </div>
                                    <div className="flex justify-between
                                                    text-gray-600">
                                        <span>Delivery</span>
                                        <span className="text-green-600
                                                          font-medium">
                                            {cartData.totalAmount
                                                > 500
                                                ? 'FREE'
                                                : '₹50'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between
                                                    text-gray-600">
                                        <span>Discount</span>
                                        <span className="text-green-600">
                                            −₹0
                                        </span>
                                    </div>

                                    <div className="border-t-2
                                                    border-dashed
                                                    border-gray-100
                                                    pt-3">
                                        <div className="flex
                                                        justify-between
                                                        items-center">
                                            <span className="text-xl
                                                             font-bold
                                                             text-gray-800">
                                                {t('cart.total')}
                                            </span>
                                            <motion.span
                                                key={cartData.totalAmount}
                                                initial={{
                                                    scale: 1.2,
                                                    color: '#16a34a'
                                                }}
                                                animate={{
                                                    scale: 1
                                                }}
                                                className="text-2xl
                                                           font-bold
                                                           text-green-600">
                                                ₹{cartData.totalAmount
                                                    + (cartData.totalAmount
                                                        > 500
                                                        ? 0 : 50)}
                                            </motion.span>
                                        </div>
                                    </div>
                                </div>

                                {cartData.totalAmount <= 500 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-blue-50
                                                   rounded-xl p-3
                                                   mb-4 text-sm
                                                   text-blue-700">
                                        🚚 Add ₹{
                                            500 - cartData.totalAmount
                                        } more for FREE delivery!
                                    </motion.div>
                                )}

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}>
                                    <Link to="/checkout"
                                          className="w-full
                                                     bg-green-600
                                                     hover:bg-green-700
                                                     text-white
                                                     font-bold py-4
                                                     rounded-2xl
                                                     text-lg
                                                     transition-colors
                                                     flex items-center
                                                     justify-center
                                                     gap-2 shadow-lg
                                                     shadow-green-200">
                                        {t('cart.checkout')}
                                        <ArrowRight size={20} />
                                    </Link>
                                </motion.div>

                                <Link to="/products"
                                      className="w-full mt-3 text-center
                                                 text-gray-500
                                                 hover:text-green-600
                                                 font-medium py-3
                                                 block transition-colors">
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Cart;