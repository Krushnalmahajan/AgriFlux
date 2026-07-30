import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMyOrders, cancelOrder } from '../api/orderApi';
import useTranslation from '../utils/useTranslation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import {
    staggerContainer, staggerItem, fadeInUp
} from '../utils/animations';
import {
    Package, Clock, Truck, CheckCircle,
    XCircle, ChevronDown, ChevronUp,
    ShoppingBag, MapPin, CreditCard
} from 'lucide-react';

const statusConfig = {
    PLACED:     { color: 'bg-blue-100 text-blue-700',
                  icon: <Clock size={16}/>,
                  step: 1 },
    CONFIRMED:  { color: 'bg-yellow-100 text-yellow-700',
                  icon: <CheckCircle size={16}/>,
                  step: 2 },
    PROCESSING: { color: 'bg-orange-100 text-orange-700',
                  icon: <Package size={16}/>,
                  step: 3 },
    SHIPPED:    { color: 'bg-purple-100 text-purple-700',
                  icon: <Truck size={16}/>,
                  step: 4 },
    DELIVERED:  { color: 'bg-green-100 text-green-700',
                  icon: <CheckCircle size={16}/>,
                  step: 5 },
    CANCELLED:  { color: 'bg-red-100 text-red-700',
                  icon: <XCircle size={16}/>,
                  step: 0 },
};

const OrderCard = ({ order, onCancel, t }) => {
    const [expanded, setExpanded] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const status = statusConfig[order.orderStatus]
        || statusConfig.PLACED;

    const canCancel = order.orderStatus === 'PLACED'
        || order.orderStatus === 'CONFIRMED';

    const handleCancel = async () => {
        if (!window.confirm(
            'Are you sure you want to cancel this order?'))
            return;
        setCancelling(true);
        try {
            await onCancel(order.orderId);
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const steps = ['Placed', 'Confirmed',
        'Processing', 'Shipped', 'Delivered'];

    return (
        <motion.div
            variants={staggerItem}
            className="bg-white rounded-2xl border-2
                       border-gray-100 overflow-hidden
                       hover:border-green-200 transition-all
                       hover:shadow-md">

            {/* Order Header */}
            <div className="p-5">
                <div className="flex flex-wrap items-start
                                justify-between gap-4">
                    <div>
                        <div className="flex items-center
                                        gap-2 mb-1">
                            <Package size={18}
                                className="text-green-600"/>
                            <span className="font-bold
                                             text-gray-800">
                                {t('orders.orderId')} #
                                {order.orderId}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            {formatDate(order.createdAt)}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className={`flex items-center
                            gap-1 px-3 py-1 rounded-full
                            text-sm font-medium
                            ${status.color}`}>
                            {status.icon}
                            {t(`orders.${order.orderStatus
                                .toLowerCase()}`)}
                        </span>
                        <span className="font-bold text-lg
                                         text-green-600">
                            ₹{order.totalAmount}
                        </span>
                    </div>
                </div>

                {/* Progress Bar — only if not cancelled */}
                {order.orderStatus !== 'CANCELLED' && (
                    <div className="mt-4">
                        <div className="flex items-center
                                        justify-between
                                        relative">
                            {/* Progress line */}
                            <div className="absolute top-3
                                            left-0 right-0
                                            h-0.5 bg-gray-200
                                            z-0"/>
                            <div
                                className="absolute top-3 left-0
                                           h-0.5 bg-green-500
                                           z-0 transition-all
                                           duration-500"
                                style={{
                                    width: `${((status.step - 1)
                                        / 4) * 100}%`
                                }}
                            />
                            {steps.map((step, index) => (
                                <div key={step}
                                     className="flex flex-col
                                                items-center
                                                z-10 gap-1">
                                    <div className={`w-6 h-6
                                        rounded-full border-2
                                        flex items-center
                                        justify-center text-xs
                                        font-bold
                                        ${index < status.step
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'bg-white border-gray-300 text-gray-400'
                                        }`}>
                                        {index < status.step
                                            ? '✓' : index + 1}
                                    </div>
                                    <span className={`text-xs
                                        hidden sm:block
                                        ${index < status.step
                                            ? 'text-green-600 font-medium'
                                            : 'text-gray-400'
                                        }`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Info Row */}
                <div className="flex flex-wrap gap-4 mt-4
                                text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <CreditCard size={14}/>
                        <span>{order.paymentMethod}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ShoppingBag size={14}/>
                        <span>{order.items?.length} items</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin size={14}/>
                        <span className="truncate max-w-48">
                            {order.deliveryAddress
                                ?.split(',')[0]}
                        </span>
                    </div>
                </div>
            </div>

            {/* Expand Toggle */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-5 py-3 bg-gray-50
                           hover:bg-gray-100 transition-colors
                           flex items-center justify-between
                           text-sm text-gray-600 font-medium
                           border-t border-gray-100">
                <span>
                    {expanded ? 'Hide' : 'View'} order details
                </span>
                {expanded
                    ? <ChevronUp size={16}/>
                    : <ChevronDown size={16}/>}
            </button>

            {/* Expanded Details */}
            <AnimatePresenceWrapper show={expanded}>
                <div className="p-5 border-t border-gray-100
                                bg-gray-50">

                    {/* Order Items */}
                    <h4 className="font-bold text-gray-700
                                   mb-3">
                        Items Ordered
                    </h4>
                    <div className="space-y-3 mb-4">
                        {order.items?.map((item) => (
                            <div key={item.orderItemId}
                                 className="flex items-center
                                            gap-3 bg-white
                                            rounded-xl p-3">
                                <div className="w-12 h-12
                                               bg-green-50
                                               rounded-xl
                                               flex items-center
                                               justify-center
                                               text-2xl shrink-0">
                                    {item.productImage
                                        ? <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-full h-full
                                                       object-cover
                                                       rounded-xl"/>
                                        : '🌱'}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium
                                                  text-gray-800">
                                        {item.productName}
                                    </p>
                                    <p className="text-sm
                                                  text-gray-500">
                                        {item.quantity} ×
                                        ₹{item.priceAtPurchase}
                                    </p>
                                </div>
                                <p className="font-bold
                                              text-green-600">
                                    ₹{item.itemTotal}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white rounded-xl p-4
                                    mb-4">
                        <h4 className="font-bold text-gray-700
                                       mb-1 flex items-center
                                       gap-2">
                            <MapPin size={16}
                                className="text-green-600"/>
                            Delivery Address
                        </h4>
                        <p className="text-gray-500 text-sm">
                            {order.deliveryAddress}
                        </p>
                    </div>

                    {/* Cancel Button */}
                    {canCancel && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCancel}
                            disabled={cancelling}
                            className="w-full bg-red-50
                                       hover:bg-red-100
                                       text-red-600 font-bold
                                       py-3 rounded-xl
                                       transition-colors
                                       flex items-center
                                       justify-center gap-2">
                            <XCircle size={18}/>
                            {cancelling
                                ? 'Cancelling...'
                                : t('orders.cancel')}
                        </motion.button>
                    )}
                </div>
            </AnimatePresenceWrapper>
        </motion.div>
    );
};

// Simple wrapper for AnimatePresence
const AnimatePresenceWrapper = ({ show, children }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}>
                {children}
            </motion.div>
        )}
    </AnimatePresence>
);

// Need this import at top
import { AnimatePresence } from 'framer-motion';

const Orders = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await getMyOrders();
            setOrders(res.data);
        } catch {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (orderId) => {
        try {
            await cancelOrder(orderId);
            toast.success('Order cancelled successfully');
            fetchOrders();
        } catch (error) {
            toast.error(
                error.response?.data?.error
                || 'Cannot cancel this order');
        }
    };

    const filters = ['ALL', 'PLACED', 'CONFIRMED',
        'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    const filteredOrders = filter === 'ALL'
        ? orders
        : orders.filter(o => o.orderStatus === filter);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i}
                                 className="bg-white rounded-2xl
                                            h-40 animate-pulse"/>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

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
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-1">
                        📦 {t('orders.title')}
                    </h1>
                    <p className="text-green-100">
                        {orders.length} total orders
                    </p>
                </div>
            </motion.section>

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl
                                text-sm font-medium transition-all
                                ${filter === f
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}>
                            {f === 'ALL' ? 'All Orders' : f}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="text-center py-20">
                        <div className="text-8xl mb-6">📭</div>
                        <h2 className="text-2xl font-bold
                                       text-gray-600 mb-3">
                            {t('orders.noOrders')}
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Start shopping to see your orders here
                        </p>
                        <Link to="/products"
                              className="bg-green-600 text-white
                                         font-bold px-8 py-3
                                         rounded-2xl inline-block
                                         hover:bg-green-700
                                         transition-colors">
                            Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4">
                        {filteredOrders.map((order) => (
                            <OrderCard
                                key={order.orderId}
                                order={order}
                                onCancel={handleCancel}
                                t={t}
                            />
                        ))}
                    </motion.div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Orders;