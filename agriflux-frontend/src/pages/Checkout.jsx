import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { getCart } from '../api/cartApi';
import { getMyAddresses, addAddress } from '../api/addressApi';
import { placeOrder } from '../api/orderApi';
import { createPaymentOrder, verifyPayment } from '../api/paymentApi';
import { clearCartState } from '../redux/cartSlice';
import useTranslation from '../utils/useTranslation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';
import {
    MapPin, Plus, CreditCard, Banknote,
    CheckCircle, X, Loader, ShoppingBag
} from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);

    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const [addressForm, setAddressForm] = useState({
        fullName: user?.name || '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
    });
    const [savingAddress, setSavingAddress] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [cartRes, addrRes] = await Promise.all([
                getCart(),
                getMyAddresses(),
            ]);

            if (!cartRes.data.items?.length) {
                toast.error('Your cart is empty!');
                navigate('/cart');
                return;
            }

            setCart(cartRes.data);
            setAddresses(addrRes.data);

            const defaultAddr = addrRes.data.find(a => a.isDefault);
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr.id);
            } else if (addrRes.data.length > 0) {
                setSelectedAddressId(addrRes.data[0].id);
            }
        } catch {
            toast.error('Failed to load checkout data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressForm({
            ...addressForm,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setSavingAddress(true);
        try {
            const res = await addAddress(addressForm);
            toast.success('Address added! ✅');
            const updatedAddresses = await getMyAddresses();
            setAddresses(updatedAddresses.data);
            setSelectedAddressId(res.data.id);
            setShowAddressModal(false);
            setAddressForm({
                fullName: user?.name || '',
                phone: '', addressLine1: '',
                addressLine2: '', city: '',
                state: '', pincode: '',
                isDefault: false,
            });
        } catch (error) {
            toast.error(
                error.response?.data?.error
                || 'Failed to add address'
            );
        } finally {
            setSavingAddress(false);
        }
    };

    // ── MAIN ORDER + PAYMENT FLOW ─────────────────
    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error('Please select a delivery address');
            return;
        }

        setPlacing(true);

        try {
            // Step 1: Place the order in our backend
            // Order is created with PENDING payment status
            const orderRes = await placeOrder({
                addressId: selectedAddressId,
                paymentMethod: paymentMethod,
                notes: notes,
            });

            const order = orderRes.data;

            if (paymentMethod === 'COD') {
                // COD — no payment gateway needed
                toast.success('Order placed successfully! 🎉');
                dispatch(clearCartState());
                navigate('/orders');
                return;
            }

            // ── ONLINE PAYMENT FLOW ───────────────
            // Step 2: Create Razorpay order via our backend
            const paymentRes = await createPaymentOrder(
                order.orderId
            );
            const paymentData = paymentRes.data;

            // Step 3: Check Razorpay script loaded
            if (!window.Razorpay) {
                toast.error(
                    'Payment gateway failed to load. ' +
                    'Please refresh and try again.'
                );
                setPlacing(false);
                return;
            }

            // Step 4: Open Razorpay checkout popup
            const options = {
                key: paymentData.keyId,
                amount: paymentData.amount,
                currency: paymentData.currency,
                name: 'AgriFlux',
                description: `Order #${order.orderId}`,
                order_id: paymentData.razorpayOrderId,
                prefill: {
                    name: paymentData.customerName,
                    email: paymentData.customerEmail,
                },
                theme: {
                    color: '#16a34a'
                },

                // Step 5: Called after successful payment
                handler: async (response) => {
                    try {
                        await verifyPayment({
                            razorpayOrderId:
                                response.razorpay_order_id,
                            razorpayPaymentId:
                                response.razorpay_payment_id,
                            razorpaySignature:
                                response.razorpay_signature,
                            orderId: order.orderId,
                        });

                        toast.success(
                            'Payment successful! Order confirmed 🎉'
                        );
                        dispatch(clearCartState());
                        navigate('/orders');
                    } catch (err) {
                        toast.error(
                            'Payment verification failed. ' +
                            'Contact support if amount was deducted.'
                        );
                    } finally {
                        setPlacing(false);
                    }
                },

                // Called when user closes the popup
                modal: {
                    ondismiss: () => {
                        toast.error(
                            'Payment cancelled. ' +
                            'Your order is saved as pending.'
                        );
                        setPlacing(false);
                    }
                }
            };

            const razorpayWindow = new window.Razorpay(options);
            razorpayWindow.open();

        } catch (error) {
            toast.error(
                error.response?.data?.error
                || 'Failed to place order'
            );
            setPlacing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-5xl mx-auto px-4 py-12">
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i}
                                 className="bg-gray-200 rounded-2xl
                                            h-32 animate-pulse"/>
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

            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-green-600
                           to-emerald-700 text-white py-10 px-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold">
                        {t('checkout.title')} 🛍️
                    </h1>
                    <p className="text-green-100 mt-1">
                        Complete your order in 2 easy steps
                    </p>
                </div>
            </motion.section>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3
                                gap-8">

                    {/* ── LEFT SIDE ──────────────────── */}
                    <div className="md:col-span-2 space-y-6">

                        {/* ── ADDRESS SECTION ──────── */}
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            className="bg-white rounded-2xl
                                       border-2 border-gray-100
                                       p-6">
                            <div className="flex justify-between
                                            items-center mb-5">
                                <h2 className="text-xl font-bold
                                               text-gray-800
                                               flex items-center
                                               gap-2">
                                    <MapPin size={22}
                                            className="text-green-600"/>
                                    {t('checkout.address')}
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                        setShowAddressModal(true)}
                                    className="flex items-center
                                               gap-1 bg-green-50
                                               text-green-600
                                               px-4 py-2 rounded-xl
                                               font-medium text-sm
                                               hover:bg-green-100
                                               transition-colors">
                                    <Plus size={16}/>
                                    {t('checkout.addAddress')}
                                </motion.button>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="text-center py-10
                                                text-gray-400">
                                    <MapPin size={40}
                                        className="mx-auto mb-3
                                                   opacity-30"/>
                                    <p>No saved addresses</p>
                                    <p className="text-sm mt-1">
                                        Add an address to continue
                                    </p>
                                </div>
                            ) : (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-3">
                                    {addresses.map((addr) => (
                                        <motion.label
                                            key={addr.id}
                                            variants={staggerItem}
                                            whileHover={{ x: 4 }}
                                            className={`flex items-start
                                                        gap-3 p-4
                                                        rounded-xl
                                                        border-2
                                                        cursor-pointer
                                                        transition-all
                                                        ${selectedAddressId
                                                            === addr.id
                                                            ? 'border-green-500 bg-green-50'
                                                            : 'border-gray-200 hover:border-green-300'
                                                        }`}>
                                            <input
                                                type="radio"
                                                name="address"
                                                checked={
                                                    selectedAddressId
                                                    === addr.id}
                                                onChange={() =>
                                                    setSelectedAddressId(
                                                        addr.id)}
                                                className="mt-1
                                                           w-5 h-5
                                                           accent-green-600"/>
                                            <div className="flex-1">
                                                <div className="flex
                                                                items-center
                                                                gap-2">
                                                    <p className="font-bold
                                                                  text-gray-800">
                                                        {addr.fullName}
                                                    </p>
                                                    {addr.isDefault && (
                                                        <span className="text-xs
                                                                         bg-green-100
                                                                         text-green-700
                                                                         px-2 py-0.5
                                                                         rounded-full
                                                                         font-medium">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-500
                                                              text-sm mt-1">
                                                    {addr.addressLine1}
                                                    {addr.addressLine2
                                                        && `, ${addr.addressLine2}`}
                                                    , {addr.city},
                                                    {' '}{addr.state}
                                                    {' - '}{addr.pincode}
                                                </p>
                                                <p className="text-gray-400
                                                              text-sm mt-1">
                                                    📞 {addr.phone}
                                                </p>
                                            </div>
                                        </motion.label>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* ── PAYMENT SECTION ──────── */}
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl
                                       border-2 border-gray-100
                                       p-6">
                            <h2 className="text-xl font-bold
                                           text-gray-800 mb-5
                                           flex items-center gap-2">
                                <CreditCard size={22}
                                            className="text-green-600"/>
                                {t('checkout.payment')}
                            </h2>

                            <div className="grid grid-cols-1
                                            md:grid-cols-2 gap-4">
                                <motion.label
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex items-center
                                                gap-3 p-5 rounded-2xl
                                                border-2 cursor-pointer
                                                transition-all
                                                ${paymentMethod === 'COD'
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-green-300'
                                                }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod
                                                 === 'COD'}
                                        onChange={() =>
                                            setPaymentMethod('COD')}
                                        className="w-5 h-5
                                                   accent-green-600"/>
                                    <Banknote size={28}
                                              className="text-green-600"/>
                                    <div>
                                        <p className="font-bold
                                                      text-gray-800">
                                            {t('checkout.cod')}
                                        </p>
                                        <p className="text-xs
                                                      text-gray-400">
                                            Pay when delivered
                                        </p>
                                    </div>
                                </motion.label>

                                <motion.label
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex items-center
                                                gap-3 p-5 rounded-2xl
                                                border-2 cursor-pointer
                                                transition-all
                                                ${paymentMethod === 'ONLINE'
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-green-300'
                                                }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod
                                                 === 'ONLINE'}
                                        onChange={() =>
                                            setPaymentMethod(
                                                'ONLINE')}
                                        className="w-5 h-5
                                                   accent-green-600"/>
                                    <CreditCard size={28}
                                                className="text-blue-600"/>
                                    <div>
                                        <p className="font-bold
                                                      text-gray-800">
                                            {t('checkout.online')}
                                        </p>
                                        <p className="text-xs
                                                      text-gray-400">
                                            UPI, Card, Netbanking
                                        </p>
                                    </div>
                                </motion.label>
                            </div>

                            {paymentMethod === 'ONLINE' && (
                                <motion.div
                                    initial={{ opacity: 0,
                                               height: 0 }}
                                    animate={{ opacity: 1,
                                               height: 'auto' }}
                                    className="mt-4 bg-blue-50
                                               rounded-xl p-4
                                               flex items-center
                                               gap-3 text-sm
                                               text-blue-700">
                                    🔒 Secured by Razorpay •
                                    256-bit SSL encryption
                                </motion.div>
                            )}

                            {/* Notes */}
                            <div className="mt-5">
                                <label className="block font-medium
                                                  text-gray-700
                                                  mb-2">
                                    {t('checkout.notes')}
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) =>
                                        setNotes(e.target.value)}
                                    rows={3}
                                    placeholder="e.g. Deliver in the morning, call before arriving..."
                                    className="w-full border-2
                                               border-gray-200
                                               rounded-xl px-4
                                               py-3 focus:border-green-500
                                               focus:outline-none
                                               resize-none
                                               transition-colors"/>
                            </div>
                        </motion.div>
                    </div>

                    {/* ── ORDER SUMMARY ────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-fit sticky top-24">
                        <div className="bg-white rounded-3xl
                                        border-2 border-gray-100
                                        p-6 shadow-lg">
                            <h2 className="text-xl font-bold
                                           text-gray-800 mb-5
                                           flex items-center gap-2">
                                <ShoppingBag size={20}/>
                                {t('checkout.orderSummary')}
                            </h2>

                            <div className="space-y-3 max-h-60
                                            overflow-y-auto mb-4
                                            pr-2">
                                {cart?.items.map((item) => (
                                    <div key={item.cartItemId}
                                         className="flex justify-between
                                                    items-center text-sm">
                                        <div className="flex-1">
                                            <p className="font-medium
                                                          text-gray-700
                                                          line-clamp-1">
                                                {item.productName}
                                            </p>
                                            <p className="text-gray-400
                                                          text-xs">
                                                {item.quantity}
                                                {' × '}₹{item.productPrice}
                                            </p>
                                        </div>
                                        <p className="font-bold
                                                      text-gray-800">
                                            ₹{item.itemTotal}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-2 border-dashed
                                            border-gray-100 pt-4
                                            space-y-2">
                                <div className="flex justify-between
                                                text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{cart?.totalAmount}</span>
                                </div>
                                <div className="flex justify-between
                                                text-gray-600">
                                    <span>Delivery</span>
                                    <span className="text-green-600
                                                      font-medium">
                                        {cart?.totalAmount > 500
                                            ? 'FREE' : '₹50'}
                                    </span>
                                </div>
                                <div className="flex justify-between
                                                items-center pt-2
                                                border-t border-gray-100">
                                    <span className="text-lg font-bold
                                                     text-gray-800">
                                        Total
                                    </span>
                                    <span className="text-2xl font-bold
                                                     text-green-600">
                                        ₹{cart?.totalAmount
                                            + (cart?.totalAmount
                                               > 500 ? 0 : 50)}
                                    </span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePlaceOrder}
                                disabled={placing
                                          || !selectedAddressId}
                                className="w-full mt-6 bg-green-600
                                           hover:bg-green-700
                                           disabled:bg-gray-300
                                           text-white font-bold
                                           py-4 rounded-2xl text-lg
                                           transition-colors flex
                                           items-center justify-center
                                           gap-2 shadow-lg
                                           shadow-green-200">
                                {placing ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear"
                                            }}
                                            className="w-5 h-5
                                                       border-2
                                                       border-white
                                                       border-t-transparent
                                                       rounded-full"/>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20}/>
                                        {paymentMethod === 'COD'
                                            ? t('checkout.placeOrder')
                                            : `Pay ₹${cart?.totalAmount + (cart?.totalAmount > 500 ? 0 : 50)}`}
                                    </>
                                )}
                            </motion.button>

                            {!selectedAddressId && (
                                <p className="text-red-500 text-xs
                                              text-center mt-2">
                                    Please select a delivery address
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── ADD ADDRESS MODAL ────────────────── */}
            <AnimatePresence>
                {showAddressModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black
                                   bg-opacity-50 z-50 flex
                                   items-center justify-center
                                   p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl
                                       w-full max-w-lg max-h-screen
                                       overflow-y-auto shadow-2xl">
                            <div className="flex justify-between
                                            items-center p-6
                                            border-b border-gray-100">
                                <h2 className="text-xl font-bold
                                               text-gray-800">
                                    📍 Add New Address
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1,
                                                  rotate: 90 }}
                                    onClick={() =>
                                        setShowAddressModal(false)}
                                    className="p-2 text-gray-400
                                               hover:bg-gray-100
                                               rounded-xl">
                                    <X size={22}/>
                                </motion.button>
                            </div>

                            <form onSubmit={handleSaveAddress}
                                  className="p-6 space-y-4">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={addressForm.fullName}
                                    onChange={handleAddressChange}
                                    required
                                    placeholder="Full Name"
                                    className="w-full border-2
                                               border-gray-200
                                               rounded-xl px-4
                                               py-3 focus:border-green-500
                                               focus:outline-none"/>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={addressForm.phone}
                                    onChange={handleAddressChange}
                                    required
                                    placeholder="Phone Number"
                                    className="w-full border-2
                                               border-gray-200
                                               rounded-xl px-4
                                               py-3 focus:border-green-500
                                               focus:outline-none"/>

                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={addressForm.addressLine1}
                                    onChange={handleAddressChange}
                                    required
                                    placeholder="Address Line 1"
                                    className="w-full border-2
                                               border-gray-200
                                               rounded-xl px-4
                                               py-3 focus:border-green-500
                                               focus:outline-none"/>

                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={addressForm.addressLine2}
                                    onChange={handleAddressChange}
                                    placeholder="Address Line 2 (optional)"
                                    className="w-full border-2
                                               border-gray-200
                                               rounded-xl px-4
                                               py-3 focus:border-green-500
                                               focus:outline-none"/>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="city"
                                        value={addressForm.city}
                                        onChange={handleAddressChange}
                                        required
                                        placeholder="City"
                                        className="w-full border-2
                                                   border-gray-200
                                                   rounded-xl px-4
                                                   py-3 focus:border-green-500
                                                   focus:outline-none"/>
                                    <input
                                        type="text"
                                        name="state"
                                        value={addressForm.state}
                                        onChange={handleAddressChange}
                                        required
                                        placeholder="State"
                                        className="w-full border-2
                                                   border-gray-200
                                                   rounded-xl px-4
                                                   py-3 focus:border-green-500
                                                   focus:outline-none"/>
                                </div>

                                <input
                                    type="text"
                                    name="pincode"
                                    value={addressForm.pincode}
                                    onChange={handleAddressChange}
                                    required
                                    placeholder="Pincode"
                                    className="w-full border-2
                                               border-gray-200
                                               rounded-xl px-4
                                               py-3 focus:border-green-500
                                               focus:outline-none"/>

                                <label className="flex items-center
                                                  gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isDefault"
                                        checked={addressForm
                                                 .isDefault}
                                        onChange={
                                            handleAddressChange}
                                        className="w-5 h-5
                                                   accent-green-600"/>
                                    <span className="text-gray-700">
                                        Set as default address
                                    </span>
                                </label>

                                <motion.button
                                    type="submit"
                                    disabled={savingAddress}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-green-600
                                               hover:bg-green-700
                                               disabled:bg-green-300
                                               text-white font-bold
                                               py-3 rounded-xl
                                               transition-colors">
                                    {savingAddress
                                        ? 'Saving...'
                                        : 'Save Address'}
                                </motion.button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default Checkout;