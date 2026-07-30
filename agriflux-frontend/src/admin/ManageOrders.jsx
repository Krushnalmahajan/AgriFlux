import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { staggerContainer, staggerItem } from '../utils/animations';
import {
    Eye, X, ChevronDown,
    ShoppingBag, Package
} from 'lucide-react';

const ManageOrders = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axiosInstance.get(
                '/admin/orders');
            setOrders(res.data);
        } catch {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (
            orderId, newStatus) => {
        setUpdatingStatus(orderId);
        try {
            await axiosInstance.put(
                `/admin/orders/${orderId}/status?status=${newStatus}`
            );
            toast.success(
                `Order status updated to ${newStatus}! ✅`);
            fetchOrders();
            if (selectedOrder?.orderId === orderId) {
                setShowModal(false);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.error
                || 'Failed to update status'
            );
        } finally {
            setUpdatingStatus(null);
        }
    };

    const statusColor = {
        PLACED:     'bg-blue-100 text-blue-700 border-blue-200',
        CONFIRMED:  'bg-purple-100 text-purple-700 border-purple-200',
        PROCESSING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        SHIPPED:    'bg-orange-100 text-orange-700 border-orange-200',
        DELIVERED:  'bg-green-100 text-green-700 border-green-200',
        CANCELLED:  'bg-red-100 text-red-700 border-red-200',
    };

    const nextStatus = {
        PLACED:     'CONFIRMED',
        CONFIRMED:  'PROCESSING',
        PROCESSING: 'SHIPPED',
        SHIPPED:    'DELIVERED',
    };

    const allStatuses = [
        'ALL', 'PLACED', 'CONFIRMED',
        'PROCESSING', 'SHIPPED',
        'DELIVERED', 'CANCELLED'
    ];

    const filteredOrders = filterStatus === 'ALL'
        ? orders
        : orders.filter(
            o => o.orderStatus === filterStatus);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r
                           from-purple-600 to-indigo-700
                           text-white py-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold">
                        📋 Manage Orders
                    </h1>
                    <p className="text-purple-200 mt-1">
                        {orders.length} total orders
                    </p>
                </div>
            </motion.section>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Status Filter */}
                <div className="flex gap-2 flex-wrap mb-6">
                    {allStatuses.map((status) => (
                        <motion.button
                            key={status}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                                setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl
                                        font-medium text-sm
                                        transition-all border-2
                                        ${filterStatus === status
                                            ? 'bg-purple-600 text-white border-purple-600'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                                        }`}>
                            {status}
                            {status !== 'ALL' && (
                                <span className="ml-2 bg-white
                                                  bg-opacity-20
                                                  text-xs px-1.5
                                                  py-0.5 rounded-full">
                                    {orders.filter(
                                        o => o.orderStatus
                                             === status
                                    ).length}
                                </span>
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl
                                border-2 border-gray-100
                                overflow-hidden">

                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-4
                                    p-4 bg-gray-50 border-b
                                    border-gray-100 font-bold
                                    text-gray-600 text-sm">
                        <div>Order ID</div>
                        <div className="col-span-2">
                            Delivery Address
                        </div>
                        <div>Amount</div>
                        <div>Status</div>
                        <div>Actions</div>
                    </div>

                    {loading ? (
                        <div className="p-8 space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i}
                                     className="h-16 bg-gray-100
                                                rounded-xl
                                                animate-pulse"/>
                            ))}
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-16
                                        text-gray-400">
                            <ShoppingBag size={48}
                                className="mx-auto mb-3
                                           opacity-30"/>
                            <p className="text-lg">
                                No orders found
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible">
                            {filteredOrders.map((order) => (
                                <motion.div
                                    key={order.orderId}
                                    variants={staggerItem}
                                    className="grid grid-cols-6
                                               gap-4 p-4 border-b
                                               border-gray-50
                                               hover:bg-purple-50
                                               transition-colors
                                               items-center">

                                    {/* Order ID */}
                                    <div>
                                        <p className="font-bold
                                                      text-gray-800">
                                            #{order.orderId}
                                        </p>
                                        <p className="text-xs
                                                      text-gray-400">
                                            {order.paymentMethod}
                                        </p>
                                    </div>

                                    {/* Address */}
                                    <div className="col-span-2">
                                        <p className="text-sm
                                                      text-gray-600
                                                      line-clamp-1">
                                            {order.deliveryAddress
                                             || 'N/A'}
                                        </p>
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <p className="font-bold
                                                      text-green-600">
                                            ₹{order.totalAmount}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <span className={`text-xs
                                                          font-bold
                                                          px-2 py-1
                                                          rounded-full
                                                          border
                                                          ${statusColor[
                                                              order.orderStatus
                                                          ]}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {/* View Details */}
                                        <motion.button
                                            whileHover={{
                                                scale: 1.1
                                            }}
                                            whileTap={{
                                                scale: 0.9
                                            }}
                                            onClick={() => {
                                                setSelectedOrder(
                                                    order);
                                                setShowModal(true);
                                            }}
                                            className="bg-purple-100
                                                       text-purple-700
                                                       p-2 rounded-xl
                                                       hover:bg-purple-200
                                                       transition-colors">
                                            <Eye size={16}/>
                                        </motion.button>

                                        {/* Next Status Button */}
                                        {nextStatus[
                                            order.orderStatus] && (
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.05
                                                }}
                                                whileTap={{
                                                    scale: 0.95
                                                }}
                                                onClick={() =>
                                                    handleUpdateStatus(
                                                        order.orderId,
                                                        nextStatus[
                                                            order.orderStatus
                                                        ]
                                                    )}
                                                disabled={
                                                    updatingStatus
                                                    === order.orderId}
                                                className="bg-green-100
                                                           text-green-700
                                                           px-3 py-2
                                                           rounded-xl
                                                           text-xs
                                                           font-bold
                                                           hover:bg-green-200
                                                           transition-colors
                                                           flex items-center
                                                           gap-1">
                                                {updatingStatus
                                                    === order.orderId
                                                    ? '...'
                                                    : `→ ${nextStatus[order.orderStatus]}`
                                                }
                                            </motion.button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* ── ORDER DETAIL MODAL ───────────────── */}
            <AnimatePresence>
                {showModal && selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black
                                   bg-opacity-50 z-50 flex
                                   items-center justify-center
                                   p-4">
                        <motion.div
                            initial={{ scale: 0.9,
                                       opacity: 0 }}
                            animate={{ scale: 1,
                                       opacity: 1 }}
                            exit={{ scale: 0.9,
                                    opacity: 0 }}
                            className="bg-white rounded-3xl
                                       w-full max-w-2xl
                                       max-h-screen
                                       overflow-y-auto
                                       shadow-2xl">

                            {/* Modal Header */}
                            <div className="flex justify-between
                                            items-center p-6
                                            border-b
                                            border-gray-100">
                                <h2 className="text-2xl font-bold
                                               text-gray-800">
                                    Order #
                                    {selectedOrder.orderId}
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1,
                                                  rotate: 90 }}
                                    onClick={() =>
                                        setShowModal(false)}
                                    className="p-2 text-gray-400
                                               hover:text-gray-600
                                               hover:bg-gray-100
                                               rounded-xl">
                                    <X size={24}/>
                                </motion.button>
                            </div>

                            <div className="p-6 space-y-6">

                                {/* Order Info */}
                                <div className="grid grid-cols-2
                                                gap-4">
                                    {[
                                        {
                                            label: 'Status',
                                            value: selectedOrder
                                                       .orderStatus,
                                            highlight: true
                                        },
                                        {
                                            label: 'Payment',
                                            value: selectedOrder
                                                       .paymentMethod
                                        },
                                        {
                                            label: 'Payment Status',
                                            value: selectedOrder
                                                       .paymentStatus
                                        },
                                        {
                                            label: 'Total Amount',
                                            value: `₹${selectedOrder.totalAmount}`
                                        },
                                    ].map((info) => (
                                        <div key={info.label}
                                             className="bg-gray-50
                                                        rounded-xl p-4">
                                            <p className="text-xs
                                                          text-gray-500
                                                          mb-1">
                                                {info.label}
                                            </p>
                                            <p className={`font-bold
                                                           ${info.highlight
                                                               ? 'text-purple-600 text-lg'
                                                               : 'text-gray-800'
                                                           }`}>
                                                {info.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Delivery Address */}
                                <div className="bg-blue-50
                                                rounded-xl p-4">
                                    <p className="text-xs
                                                  font-bold
                                                  text-blue-600
                                                  mb-2">
                                        📍 DELIVERY ADDRESS
                                    </p>
                                    <p className="text-gray-700">
                                        {selectedOrder
                                            .deliveryAddress}
                                    </p>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <p className="font-bold
                                                  text-gray-800
                                                  mb-3 flex
                                                  items-center
                                                  gap-2">
                                        <Package size={18}
                                            className="text-purple-600"/>
                                        Order Items
                                    </p>
                                    <div className="space-y-3">
                                        {selectedOrder.items
                                            ?.map((item) => (
                                            <div key={item.orderItemId}
                                                 className="flex
                                                            justify-between
                                                            items-center
                                                            bg-gray-50
                                                            rounded-xl
                                                            p-4">
                                                <div className="flex
                                                                items-center
                                                                gap-3">
                                                    <div className="w-10 h-10
                                                                    bg-green-100
                                                                    rounded-xl
                                                                    flex items-center
                                                                    justify-center">
                                                        🌱
                                                    </div>
                                                    <div>
                                                        <p className="font-bold
                                                                      text-gray-800
                                                                      text-sm">
                                                            {item.productName}
                                                        </p>
                                                        <p className="text-xs
                                                                      text-gray-400">
                                                            Qty: {item.quantity}
                                                            {' × '}
                                                            ₹{item.priceAtPurchase}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-bold
                                                              text-green-600">
                                                    ₹{item.itemTotal}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Update Status */}
                                {selectedOrder.orderStatus
                                    !== 'DELIVERED'
                                    && selectedOrder.orderStatus
                                    !== 'CANCELLED' && (
                                    <div>
                                        <p className="font-bold
                                                      text-gray-800
                                                      mb-3">
                                            Update Order Status
                                        </p>
                                        <div className="flex
                                                        flex-wrap
                                                        gap-2">
                                            {[
                                                'CONFIRMED',
                                                'PROCESSING',
                                                'SHIPPED',
                                                'DELIVERED',
                                                'CANCELLED'
                                            ].map((status) => (
                                                <motion.button
                                                    key={status}
                                                    whileHover={{
                                                        scale: 1.05
                                                    }}
                                                    whileTap={{
                                                        scale: 0.95
                                                    }}
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            selectedOrder
                                                            .orderId,
                                                            status
                                                        )}
                                                    disabled={
                                                        updatingStatus
                                                        === selectedOrder
                                                            .orderId
                                                        || selectedOrder
                                                           .orderStatus
                                                           === status
                                                    }
                                                    className={`px-4 py-2
                                                                rounded-xl
                                                                font-bold
                                                                text-sm
                                                                transition-all
                                                                border-2
                                                                ${selectedOrder
                                                                    .orderStatus
                                                                    === status
                                                                    ? 'bg-purple-600 text-white border-purple-600'
                                                                    : status === 'CANCELLED'
                                                                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                                                                    : 'border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                                                                }`}>
                                                    {status}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageOrders;