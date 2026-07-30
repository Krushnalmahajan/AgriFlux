import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import {
    staggerContainer, staggerItem, fadeInUp
} from '../utils/animations';
import {
    Package, ShoppingBag, Users,
    TrendingUp, Plus, Eye,
    AlertTriangle, CheckCircle,
    Clock, XCircle
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        lowStockProducts: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [ordersRes, productsRes] =
                await Promise.all([
                    axiosInstance.get('/admin/orders'),
                    axiosInstance.get('/products'),
                ]);

            const orders = ordersRes.data;
            const products = productsRes.data;

            setStats({
                totalProducts: products.length,
                totalOrders: orders.length,
                pendingOrders: orders.filter(
                    o => o.orderStatus === 'PLACED'
                    || o.orderStatus === 'CONFIRMED'
                ).length,
                deliveredOrders: orders.filter(
                    o => o.orderStatus === 'DELIVERED'
                ).length,
                cancelledOrders: orders.filter(
                    o => o.orderStatus === 'CANCELLED'
                ).length,
                lowStockProducts: products.filter(
                    p => p.stockQuantity <= 10
                ).length,
            });

            setRecentOrders(orders.slice(0, 5));
        } catch (error) {
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const statusColor = {
        PLACED:     'bg-blue-100 text-blue-700',
        CONFIRMED:  'bg-purple-100 text-purple-700',
        PROCESSING: 'bg-yellow-100 text-yellow-700',
        SHIPPED:    'bg-orange-100 text-orange-700',
        DELIVERED:  'bg-green-100 text-green-700',
        CANCELLED:  'bg-red-100 text-red-700',
    };

    const statCards = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: <Package size={28}/>,
            bg: 'from-blue-500 to-blue-600',
            link: '/admin/products'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: <ShoppingBag size={28}/>,
            bg: 'from-green-500 to-green-600',
            link: '/admin/orders'
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: <Clock size={28}/>,
            bg: 'from-yellow-500 to-orange-500',
            link: '/admin/orders'
        },
        {
            title: 'Low Stock',
            value: stats.lowStockProducts,
            icon: <AlertTriangle size={28}/>,
            bg: 'from-red-500 to-red-600',
            link: '/admin/products'
        },
    ];

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
                    <div className="flex justify-between
                                    items-center">
                        <div>
                            <h1 className="text-3xl font-bold">
                                🛠️ Admin Dashboard
                            </h1>
                            <p className="text-purple-200 mt-1">
                                Welcome back, {user?.name} 👋
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link to="/admin/products"
                                  className="bg-white
                                             text-purple-700
                                             font-bold px-5 py-3
                                             rounded-xl
                                             hover:bg-purple-50
                                             transition-all flex
                                             items-center gap-2">
                                <Plus size={18} />
                                Add Product
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.section>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Stat Cards */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-4
                               gap-6 mb-8">
                    {statCards.map((card) => (
                        <motion.div
                            key={card.title}
                            variants={staggerItem}
                            whileHover={{ y: -5,
                                scale: 1.02 }}>
                            <Link to={card.link}
                                  className={`bg-gradient-to-r
                                              ${card.bg}
                                              rounded-2xl p-6
                                              text-white block
                                              shadow-lg`}>
                                <div className="flex justify-between
                                                items-start">
                                    <div>
                                        <p className="text-white
                                                      text-opacity-80
                                                      text-sm
                                                      font-medium">
                                            {card.title}
                                        </p>
                                        <motion.p
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                delay: 0.3
                                            }}
                                            className="text-4xl
                                                       font-bold mt-2">
                                            {loading
                                                ? '...'
                                                : card.value}
                                        </motion.p>
                                    </div>
                                    <div className="bg-white
                                                    bg-opacity-20
                                                    p-3 rounded-xl">
                                        {card.icon}
                                    </div>
                                </div>
                                <div className="flex items-center
                                                gap-1 mt-4
                                                text-white
                                                text-opacity-80
                                                text-sm">
                                    <TrendingUp size={14}/>
                                    View Details →
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1
                                md:grid-cols-3 gap-8">

                    {/* Recent Orders */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="md:col-span-2 bg-white
                                   rounded-2xl border-2
                                   border-gray-100 p-6">
                        <div className="flex justify-between
                                        items-center mb-6">
                            <h2 className="text-xl font-bold
                                           text-gray-800">
                                📋 Recent Orders
                            </h2>
                            <Link to="/admin/orders"
                                  className="text-purple-600
                                             font-medium
                                             hover:underline
                                             flex items-center
                                             gap-1 text-sm">
                                <Eye size={16}/>
                                View All
                            </Link>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i}
                                         className="h-14
                                                    bg-gray-100
                                                    rounded-xl
                                                    animate-pulse"/>
                                ))}
                            </div>
                        ) : recentOrders.length === 0 ? (
                            <div className="text-center
                                            py-10 text-gray-400">
                                <ShoppingBag size={48}
                                    className="mx-auto mb-3
                                               opacity-30"/>
                                <p>No orders yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map((order) => (
                                    <motion.div
                                        key={order.orderId}
                                        whileHover={{ x: 4 }}
                                        className="flex items-center
                                                   justify-between
                                                   p-4 bg-gray-50
                                                   rounded-xl
                                                   hover:bg-purple-50
                                                   transition-colors">
                                        <div className="flex
                                                        items-center
                                                        gap-3">
                                            <div className="bg-purple-100
                                                            p-2
                                                            rounded-lg">
                                                <ShoppingBag
                                                    size={18}
                                                    className="text-purple-600"/>
                                            </div>
                                            <div>
                                                <p className="font-bold
                                                              text-gray-800">
                                                    Order #
                                                    {order.orderId}
                                                </p>
                                                <p className="text-sm
                                                              text-gray-400">
                                                    ₹{order.totalAmount}
                                                    {' • '}
                                                    {order.paymentMethod}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-xs
                                                          font-bold
                                                          px-3 py-1.5
                                                          rounded-full
                                                          ${statusColor[
                                                              order.orderStatus
                                                          ]}`}>
                                            {order.orderStatus}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="bg-white rounded-2xl
                                   border-2 border-gray-100
                                   p-6">
                        <h2 className="text-xl font-bold
                                       text-gray-800 mb-6">
                            ⚡ Quick Actions
                        </h2>

                        <div className="space-y-3">
                            {[
                                {
                                    icon: <Plus size={20}/>,
                                    label: 'Add New Product',
                                    desc: 'Add product to catalog',
                                    link: '/admin/products',
                                    color: 'text-green-600',
                                    bg: 'bg-green-50 hover:bg-green-100'
                                },
                                {
                                    icon: <Package size={20}/>,
                                    label: 'Manage Products',
                                    desc: 'Edit or delete products',
                                    link: '/admin/products',
                                    color: 'text-blue-600',
                                    bg: 'bg-blue-50 hover:bg-blue-100'
                                },
                                {
                                    icon: <ShoppingBag size={20}/>,
                                    label: 'Manage Orders',
                                    desc: 'Update order statuses',
                                    link: '/admin/orders',
                                    color: 'text-purple-600',
                                    bg: 'bg-purple-50 hover:bg-purple-100'
                                },
                                {
                                    icon: <CheckCircle size={20}/>,
                                    label: 'View Store',
                                    desc: 'See store as customer',
                                    link: '/',
                                    color: 'text-orange-600',
                                    bg: 'bg-orange-50 hover:bg-orange-100'
                                },
                            ].map((action) => (
                                <motion.div
                                    key={action.label}
                                    whileHover={{ x: 5 }}>
                                    <Link
                                        to={action.link}
                                        className={`flex items-center
                                                    gap-3 p-4
                                                    rounded-xl
                                                    transition-all
                                                    ${action.bg}`}>
                                        <div className={`${action.color}
                                                         bg-white p-2
                                                         rounded-lg
                                                         shadow-sm`}>
                                            {action.icon}
                                        </div>
                                        <div>
                                            <p className="font-bold
                                                          text-gray-800
                                                          text-sm">
                                                {action.label}
                                            </p>
                                            <p className="text-xs
                                                          text-gray-400">
                                                {action.desc}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Order Status Summary */}
                        <div className="mt-6 pt-6 border-t-2
                                        border-gray-100">
                            <h3 className="font-bold text-gray-700
                                           mb-4 text-sm">
                                Order Summary
                            </h3>
                            <div className="space-y-2">
                                {[
                                    {
                                        label: 'Delivered',
                                        value: stats.deliveredOrders,
                                        color: 'text-green-600',
                                        icon: <CheckCircle size={16}/>
                                    },
                                    {
                                        label: 'Pending',
                                        value: stats.pendingOrders,
                                        color: 'text-yellow-600',
                                        icon: <Clock size={16}/>
                                    },
                                    {
                                        label: 'Cancelled',
                                        value: stats.cancelledOrders,
                                        color: 'text-red-600',
                                        icon: <XCircle size={16}/>
                                    },
                                ].map((item) => (
                                    <div key={item.label}
                                         className="flex justify-between
                                                    items-center">
                                        <div className={`flex items-center
                                                         gap-2
                                                         ${item.color}`}>
                                            {item.icon}
                                            <span className="text-sm
                                                             text-gray-600">
                                                {item.label}
                                            </span>
                                        </div>
                                        <span className="font-bold
                                                         text-gray-800">
                                            {loading
                                                ? '...'
                                                : item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;