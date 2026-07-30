import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../utils/axiosInstance';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { staggerContainer, staggerItem } from '../utils/animations';
import {
    Plus, Edit, Trash2, X,
    Package, Search, Save
} from 'lucide-react';

const ManageProducts = () => {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);

    const emptyForm = {
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        stockQuantity: '',
        unit: '',
        categoryId: '',
        isFeatured: false,
        imageUrl: '',
    };

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axiosInstance.get('/products'),
                axiosInstance.get('/categories'),
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAdd = () => {
        setEditingProduct(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const handleOpenEdit = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            originalPrice: product.originalPrice || '',
            stockQuantity: product.stockQuantity || '',
            unit: product.unit || '',
            categoryId: product.categoryId || '',
            isFeatured: product.isFeatured || false,
            imageUrl: product.imageUrl || '',
        });
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                originalPrice: form.originalPrice
                    ? parseFloat(form.originalPrice)
                    : null,
                stockQuantity: parseInt(form.stockQuantity),
                categoryId: parseInt(form.categoryId),
            };

            if (editingProduct) {
                await axiosInstance.put(
                    `/admin/products/${editingProduct.id}`,
                    payload
                );
                toast.success('Product updated! ✅');
            } else {
                await axiosInstance.post(
                    '/admin/products',
                    payload
                );
                toast.success('Product added! ✅');
            }

            setShowModal(false);
            fetchData();
        } catch (error) {
            toast.error(
                error.response?.data?.error
                || 'Failed to save product'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm(
            'Delete this product?')) return;

        setDeleting(productId);
        try {
            await axiosInstance.delete(
                `/admin/products/${productId}`
            );
            toast.success('Product deleted!');
            fetchData();
        } catch {
            toast.error('Failed to delete');
        } finally {
            setDeleting(null);
        }
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(
            searchKeyword.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600
                           to-indigo-700 text-white
                           py-10 px-4">
                <div className="max-w-7xl mx-auto flex
                                justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">
                            📦 Manage Products
                        </h1>
                        <p className="text-blue-200 mt-1">
                            {products.length} total products
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpenAdd}
                        className="bg-white text-blue-700
                                   font-bold px-6 py-3
                                   rounded-xl hover:bg-blue-50
                                   transition-all flex
                                   items-center gap-2
                                   shadow-lg">
                        <Plus size={20} />
                        Add Product
                    </motion.button>
                </div>
            </motion.section>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Search */}
                <div className="relative mb-6">
                    <Search size={20}
                            className="absolute left-4 top-1/2
                                       -translate-y-1/2
                                       text-gray-400"/>
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) =>
                            setSearchKeyword(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-12 pr-4 py-4
                                   border-2 border-gray-200
                                   rounded-2xl text-lg
                                   focus:border-blue-500
                                   focus:outline-none bg-white"/>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-2xl
                                border-2 border-gray-100
                                overflow-hidden">

                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-4
                                    p-4 bg-gray-50 border-b
                                    border-gray-100 font-bold
                                    text-gray-600 text-sm">
                        <div className="col-span-2">
                            Product
                        </div>
                        <div>Category</div>
                        <div>Price</div>
                        <div>Stock</div>
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
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16
                                        text-gray-400">
                            <Package size={48}
                                className="mx-auto mb-3
                                           opacity-30"/>
                            <p className="text-lg">
                                No products found
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible">
                            {filtered.map((product) => (
                                <motion.div
                                    key={product.id}
                                    variants={staggerItem}
                                    className="grid grid-cols-6
                                               gap-4 p-4
                                               border-b
                                               border-gray-50
                                               hover:bg-blue-50
                                               transition-colors
                                               items-center">

                                    {/* Product name */}
                                    <div className="col-span-2
                                                    flex items-center
                                                    gap-3">
                                        <div className="w-12 h-12
                                                        bg-green-50
                                                        rounded-xl
                                                        flex items-center
                                                        justify-center
                                                        shrink-0">
                                            {product.imageUrl
                                                ? (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full
                                                               h-full
                                                               object-cover
                                                               rounded-xl"/>
                                            ) : (
                                                <span className="text-2xl">
                                                    🌱
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold
                                                          text-gray-800
                                                          text-sm
                                                          line-clamp-1">
                                                {product.name}
                                            </p>
                                            {product.isFeatured && (
                                                <span className="text-xs
                                                                 bg-yellow-100
                                                                 text-yellow-700
                                                                 px-2 py-0.5
                                                                 rounded-full
                                                                 font-medium">
                                                    ⭐ Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <span className="text-xs
                                                         bg-green-100
                                                         text-green-700
                                                         px-2 py-1
                                                         rounded-lg
                                                         font-medium">
                                            {product.categoryName}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <p className="font-bold
                                                      text-green-600">
                                            ₹{product.price}
                                        </p>
                                        {product.originalPrice && (
                                            <p className="text-xs
                                                          text-gray-400
                                                          line-through">
                                                ₹{product.originalPrice}
                                            </p>
                                        )}
                                    </div>

                                    {/* Stock */}
                                    <div>
                                        <span className={`text-xs
                                                          font-bold px-2
                                                          py-1 rounded-lg
                                                          ${product.stockQuantity
                                                              > 10
                                                              ? 'bg-green-100 text-green-700'
                                                              : product.stockQuantity > 0
                                                              ? 'bg-orange-100 text-orange-700'
                                                              : 'bg-red-100 text-red-700'
                                                          }`}>
                                            {product.stockQuantity}
                                            {' '}units
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{
                                                scale: 1.1
                                            }}
                                            whileTap={{
                                                scale: 0.9
                                            }}
                                            onClick={() =>
                                                handleOpenEdit(
                                                    product)}
                                            className="bg-blue-100
                                                       text-blue-700
                                                       p-2 rounded-xl
                                                       hover:bg-blue-200
                                                       transition-colors">
                                            <Edit size={16}/>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{
                                                scale: 1.1
                                            }}
                                            whileTap={{
                                                scale: 0.9
                                            }}
                                            onClick={() =>
                                                handleDelete(
                                                    product.id)}
                                            disabled={
                                                deleting
                                                === product.id}
                                            className="bg-red-100
                                                       text-red-700
                                                       p-2 rounded-xl
                                                       hover:bg-red-200
                                                       transition-colors">
                                            {deleting === product.id
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
                                                               border-red-500
                                                               border-t-transparent
                                                               rounded-full"/>
                                            ) : (
                                                <Trash2 size={16}/>
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* ── ADD/EDIT MODAL ───────────────────── */}
            <AnimatePresence>
                {showModal && (
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
                                            border-b border-gray-100">
                                <h2 className="text-2xl font-bold
                                               text-gray-800">
                                    {editingProduct
                                        ? '✏️ Edit Product'
                                        : '➕ Add New Product'}
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1,
                                                  rotate: 90 }}
                                    onClick={() =>
                                        setShowModal(false)}
                                    className="p-2 text-gray-400
                                               hover:text-gray-600
                                               hover:bg-gray-100
                                               rounded-xl
                                               transition-all">
                                    <X size={24}/>
                                </motion.button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSave}
                                  className="p-6 space-y-5">

                                {/* Name */}
                                <div>
                                    <label className="block
                                                      font-bold
                                                      text-gray-700
                                                      mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Tomato Seeds"
                                        className="w-full border-2
                                                   border-gray-200
                                                   rounded-xl px-4
                                                   py-3 text-gray-800
                                                   focus:border-blue-500
                                                   focus:outline-none
                                                   transition-colors"/>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block
                                                      font-bold
                                                      text-gray-700
                                                      mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Product description..."
                                        className="w-full border-2
                                                   border-gray-200
                                                   rounded-xl px-4
                                                   py-3 text-gray-800
                                                   focus:border-blue-500
                                                   focus:outline-none
                                                   transition-colors
                                                   resize-none"/>
                                </div>

                                {/* Price Row */}
                                <div className="grid grid-cols-2
                                                gap-4">
                                    <div>
                                        <label className="block
                                                          font-bold
                                                          text-gray-700
                                                          mb-2">
                                            Price (₹) *
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={form.price}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            placeholder="250.00"
                                            className="w-full border-2
                                                       border-gray-200
                                                       rounded-xl px-4
                                                       py-3 text-gray-800
                                                       focus:border-blue-500
                                                       focus:outline-none
                                                       transition-colors"/>
                                    </div>
                                    <div>
                                        <label className="block
                                                          font-bold
                                                          text-gray-700
                                                          mb-2">
                                            Original Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="originalPrice"
                                            value={form.originalPrice}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.01"
                                            placeholder="300.00"
                                            className="w-full border-2
                                                       border-gray-200
                                                       rounded-xl px-4
                                                       py-3 text-gray-800
                                                       focus:border-blue-500
                                                       focus:outline-none
                                                       transition-colors"/>
                                    </div>
                                </div>

                                {/* Stock + Unit Row */}
                                <div className="grid grid-cols-2
                                                gap-4">
                                    <div>
                                        <label className="block
                                                          font-bold
                                                          text-gray-700
                                                          mb-2">
                                            Stock Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            name="stockQuantity"
                                            value={form.stockQuantity}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            placeholder="100"
                                            className="w-full border-2
                                                       border-gray-200
                                                       rounded-xl px-4
                                                       py-3 text-gray-800
                                                       focus:border-blue-500
                                                       focus:outline-none
                                                       transition-colors"/>
                                    </div>
                                    <div>
                                        <label className="block
                                                          font-bold
                                                          text-gray-700
                                                          mb-2">
                                            Unit
                                        </label>
                                        <input
                                            type="text"
                                            name="unit"
                                            value={form.unit}
                                            onChange={handleChange}
                                            placeholder="kg / litre / packet"
                                            className="w-full border-2
                                                       border-gray-200
                                                       rounded-xl px-4
                                                       py-3 text-gray-800
                                                       focus:border-blue-500
                                                       focus:outline-none
                                                       transition-colors"/>
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block
                                                      font-bold
                                                      text-gray-700
                                                      mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="categoryId"
                                        value={form.categoryId}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-2
                                                   border-gray-200
                                                   rounded-xl px-4
                                                   py-3 text-gray-800
                                                   focus:border-blue-500
                                                   focus:outline-none
                                                   transition-colors
                                                   bg-white">
                                        <option value="">
                                            Select Category
                                        </option>
                                        {categories.map((cat) => (
                                            <option
                                                key={cat.id}
                                                value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label className="block
                                                      font-bold
                                                      text-gray-700
                                                      mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={form.imageUrl}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full border-2
                                                   border-gray-200
                                                   rounded-xl px-4
                                                   py-3 text-gray-800
                                                   focus:border-blue-500
                                                   focus:outline-none
                                                   transition-colors"/>
                                </div>

                                {/* Featured checkbox */}
                                <label className="flex items-center
                                                  gap-3 cursor-pointer
                                                  bg-yellow-50
                                                  p-4 rounded-xl
                                                  border-2
                                                  border-yellow-100">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={form.isFeatured}
                                        onChange={handleChange}
                                        className="w-5 h-5
                                                   accent-yellow-500"/>
                                    <div>
                                        <p className="font-bold
                                                      text-gray-800">
                                            ⭐ Featured Product
                                        </p>
                                        <p className="text-sm
                                                      text-gray-500">
                                            Show on homepage
                                        </p>
                                    </div>
                                </label>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <motion.button
                                        type="submit"
                                        disabled={saving}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1
                                                   bg-blue-600
                                                   hover:bg-blue-700
                                                   disabled:bg-blue-300
                                                   text-white
                                                   font-bold py-3
                                                   rounded-xl
                                                   transition-colors
                                                   flex items-center
                                                   justify-center
                                                   gap-2">
                                        {saving ? (
                                            <motion.div
                                                animate={{
                                                    rotate: 360
                                                }}
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
                                        ) : (
                                            <>
                                                <Save size={18}/>
                                                {editingProduct
                                                    ? 'Update Product'
                                                    : 'Add Product'}
                                            </>
                                        )}
                                    </motion.button>

                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                            setShowModal(false)}
                                        className="flex-1 bg-gray-100
                                                   hover:bg-gray-200
                                                   text-gray-700
                                                   font-bold py-3
                                                   rounded-xl
                                                   transition-colors">
                                        Cancel
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageProducts;