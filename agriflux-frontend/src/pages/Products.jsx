import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getAllProducts, searchProducts,
    getProductsByCategory, getAllCategories
} from '../api/productApi';
import { addToCart } from '../api/cartApi';
import { setCart } from '../redux/cartSlice';
import useTranslation from '../utils/useTranslation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';
import {
    staggerContainer, staggerItem, fadeInUp
} from '../utils/animations';
import {
    Search, ShoppingCart, Filter,
    X, SlidersHorizontal, Eye
} from 'lucide-react';

const Products = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const { isLoggedIn } = useSelector(
            (state) => state.auth);

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] =
            useState(null);
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);
    const [addingToCart, setAddingToCart] = useState(null);

    // Read category from URL params
    useEffect(() => {
        const catId = searchParams.get('category');
        if (catId) setSelectedCategory(Number(catId));
    }, [searchParams]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            const res = await getAllCategories();
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories');
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            let res;
            if (selectedCategory) {
                res = await getProductsByCategory(
                        selectedCategory);
            } else {
                res = await getAllProducts();
            }
            setProducts(res.data);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchKeyword.trim()) {
            fetchProducts();
            return;
        }
        setLoading(true);
        try {
            const res = await searchProducts(
                    searchKeyword);
            setProducts(res.data);
            setSelectedCategory(null);
        } catch {
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        if (!isLoggedIn) {
            toast.error('Please login first!');
            navigate('/login');
            return;
        }
        setAddingToCart(productId);
        try {
            const res = await addToCart({
                productId, quantity: 1
            });
            dispatch(setCart(res.data));
            toast.success('Added to cart! 🛒');
        } catch {
            toast.error('Failed to add to cart');
        } finally {
            setAddingToCart(null);
        }
    };

    // Sort products
    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'price-low')
            return a.price - b.price;
        if (sortBy === 'price-high')
            return b.price - a.price;
        if (sortBy === 'name')
            return a.name.localeCompare(b.name);
        return 0;
    });

    const categoryEmoji = {
        'Seeds': '🌱', 'Fertilizers': '🧪',
        'Tools': '🔧', 'Pesticides': '🛡️',
        'Irrigation': '💧', 'default': '🌾'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* ── PAGE HEADER ───────────────────────── */}
            <motion.section
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-green-600
                           to-emerald-700 text-white
                           py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">
                        {t('products.title')} 🛍️
                    </h1>
                    <p className="text-green-100 text-lg">
                        {products.length} products available
                        for Indian farmers
                    </p>
                </div>
            </motion.section>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* ── SEARCH BAR ────────────────────── */}
                <motion.form
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    onSubmit={handleSearch}
                    className="flex gap-3 mb-8">
                    <div className="flex-1 relative">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2
                                       -translate-y-1/2
                                       text-gray-400"/>
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={(e) =>
                                setSearchKeyword(
                                    e.target.value)}
                            placeholder={t('products.search')}
                            className="w-full pl-12 pr-4 py-4
                                       border-2 border-gray-200
                                       rounded-2xl text-lg
                                       focus:border-green-500
                                       focus:outline-none
                                       bg-white transition-all
                                       focus:shadow-lg
                                       focus:shadow-green-100"/>
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-green-600 hover:bg-green-700
                                   text-white px-8 py-4 rounded-2xl
                                   font-bold text-lg transition-colors
                                   flex items-center gap-2">
                        <Search size={20} />
                        {t('weather.search')}
                    </motion.button>

                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                            setShowFilters(!showFilters)}
                        className="bg-white border-2 border-gray-200
                                   hover:border-green-400 text-gray-700
                                   px-4 py-4 rounded-2xl font-bold
                                   transition-all flex items-center
                                   gap-2">
                        <SlidersHorizontal size={20} />
                        <span className="hidden md:inline">
                            {t('products.filter')}
                        </span>
                    </motion.button>
                </motion.form>

                {/* ── FILTERS PANEL ─────────────────── */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0,
                                       height: 0 }}
                            animate={{ opacity: 1,
                                       height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl
                                       border-2 border-gray-100
                                       p-6 mb-8 overflow-hidden">

                            <div className="flex justify-between
                                            items-center mb-4">
                                <h3 className="font-bold text-lg
                                               text-gray-800 flex
                                               items-center gap-2">
                                    <Filter size={20}
                                            className="text-green-600"/>
                                    Filters
                                </h3>
                                <button
                                    onClick={() =>
                                        setShowFilters(false)}
                                    className="text-gray-400
                                               hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1
                                            md:grid-cols-2 gap-6">

                                {/* Sort By */}
                                <div>
                                    <label className="block
                                                      font-medium
                                                      text-gray-700
                                                      mb-3">
                                        Sort By
                                    </label>
                                    <div className="flex flex-wrap
                                                    gap-2">
                                        {[
                                            { val: 'default',
                                              label: 'Default' },
                                            { val: 'price-low',
                                              label: '₹ Low to High' },
                                            { val: 'price-high',
                                              label: '₹ High to Low' },
                                            { val: 'name',
                                              label: 'A to Z' },
                                        ].map((opt) => (
                                            <motion.button
                                                key={opt.val}
                                                whileHover={{
                                                    scale: 1.05
                                                }}
                                                whileTap={{
                                                    scale: 0.95
                                                }}
                                                onClick={() =>
                                                    setSortBy(
                                                        opt.val)}
                                                className={`px-4 py-2
                                                            rounded-xl
                                                            font-medium
                                                            text-sm
                                                            transition-all
                                                            ${sortBy === opt.val
                                                                ? 'bg-green-600 text-white'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                                                            }`}>
                                                {opt.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Clear Filters */}
                                <div className="flex items-end">
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => {
                                            setSelectedCategory(
                                                null);
                                            setSortBy('default');
                                            setSearchKeyword('');
                                            fetchProducts();
                                        }}
                                        className="bg-red-50
                                                   text-red-600
                                                   border-2
                                                   border-red-200
                                                   px-6 py-2
                                                   rounded-xl
                                                   font-medium
                                                   hover:bg-red-100
                                                   transition-colors
                                                   flex items-center
                                                   gap-2">
                                        <X size={16} />
                                        Clear All Filters
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col md:flex-row
                                gap-8">

                    {/* ── CATEGORIES SIDEBAR ──────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full md:w-64 shrink-0">

                        <div className="bg-white rounded-2xl
                                        border-2 border-gray-100
                                        p-5 sticky top-24">
                            <h3 className="font-bold text-lg
                                           text-gray-800 mb-4
                                           flex items-center gap-2">
                                🗂️ {t('products.allCategory')}
                            </h3>

                            {/* All Category Button */}
                            <motion.button
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSearchKeyword('');
                                }}
                                className={`w-full text-left px-4
                                            py-3 rounded-xl font-medium
                                            transition-all mb-2
                                            flex items-center gap-3
                                            ${!selectedCategory
                                                ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                                                : 'text-gray-600 hover:bg-green-50'
                                            }`}>
                                <span className="text-xl">🌾</span>
                                All Products
                                {!selectedCategory && (
                                    <span className="ml-auto
                                                     bg-white
                                                     bg-opacity-30
                                                     text-xs px-2
                                                     py-0.5
                                                     rounded-full">
                                        {products.length}
                                    </span>
                                )}
                            </motion.button>

                            {/* Category Buttons */}
                            {categories.map((cat) => (
                                <motion.button
                                    key={cat.id}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => {
                                        setSelectedCategory(
                                            cat.id);
                                        setSearchKeyword('');
                                    }}
                                    className={`w-full text-left
                                                px-4 py-3 rounded-xl
                                                font-medium
                                                transition-all mb-2
                                                flex items-center
                                                gap-3
                                                ${selectedCategory
                                                   === cat.id
                                                    ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                                                    : 'text-gray-600 hover:bg-green-50'
                                                }`}>
                                    <span className="text-xl">
                                        {categoryEmoji[cat.name]
                                         || categoryEmoji.default}
                                    </span>
                                    <span className="flex-1">
                                        {cat.name}
                                    </span>
                                    <span className={`text-xs
                                                      px-2 py-0.5
                                                      rounded-full
                                                      ${selectedCategory
                                                         === cat.id
                                                          ? 'bg-white bg-opacity-30'
                                                          : 'bg-gray-100 text-gray-500'
                                                      }`}>
                                        {cat.productCount}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── PRODUCTS GRID ──────────────── */}
                    <div className="flex-1">

                        {/* Results count */}
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            className="flex justify-between
                                       items-center mb-6">
                            <p className="text-gray-500">
                                Showing{' '}
                                <span className="font-bold
                                                 text-gray-800">
                                    {sortedProducts.length}
                                </span>
                                {' '}products
                                {selectedCategory && (
                                    <span> in{' '}
                                        <span className="text-green-600
                                                          font-bold">
                                            {categories.find(
                                                c => c.id ===
                                                selectedCategory
                                            )?.name}
                                        </span>
                                    </span>
                                )}
                            </p>
                        </motion.div>

                        {/* Loading State */}
                        {loading ? (
                            <div className="grid grid-cols-1
                                            md:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            delay: i * 0.1
                                        }}
                                        className="bg-white
                                                   rounded-2xl
                                                   overflow-hidden
                                                   border-2
                                                   border-gray-100">
                                        <div className="h-48
                                                        bg-gray-200
                                                        animate-pulse"/>
                                        <div className="p-4
                                                        space-y-3">
                                            <div className="h-4
                                                            bg-gray-200
                                                            rounded
                                                            animate-pulse"/>
                                            <div className="h-4
                                                            bg-gray-200
                                                            rounded
                                                            w-2/3
                                                            animate-pulse"/>
                                            <div className="h-8
                                                            bg-gray-200
                                                            rounded
                                                            animate-pulse"/>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                        ) : sortedProducts.length === 0 ? (

                            /* Empty State */
                            <motion.div
                                variants={fadeInUp}
                                initial="hidden"
                                animate="visible"
                                className="text-center py-20">
                                <motion.span
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity
                                    }}
                                    className="text-8xl block mb-6">
                                    🌱
                                </motion.span>
                                <h3 className="text-2xl font-bold
                                               text-gray-700 mb-3">
                                    {t('products.noProducts')}
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Try different search or
                                    category
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setSearchKeyword('');
                                        fetchProducts();
                                    }}
                                    className="bg-green-600
                                               text-white px-6 py-3
                                               rounded-xl font-bold
                                               hover:bg-green-700">
                                    View All Products
                                </motion.button>
                            </motion.div>

                        ) : (

                            /* Products Grid */
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1
                                           md:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {sortedProducts.map(
                                        (product) => (
                                        <motion.div
                                            key={product.id}
                                            variants={staggerItem}
                                            layout
                                            whileHover={{
                                                y: -8,
                                                boxShadow:
                                                  "0 25px 50px rgba(0,0,0,0.12)"
                                            }}
                                            className="bg-white
                                                       rounded-2xl
                                                       border-2
                                                       border-gray-100
                                                       overflow-hidden
                                                       group">

                                            {/* Image */}
                                            <div className="bg-gradient-to-br
                                                            from-green-50
                                                            to-emerald-50
                                                            h-52 flex
                                                            items-center
                                                            justify-center
                                                            relative
                                                            overflow-hidden">
                                                {product.imageUrl
                                                    ? (
                                                    <motion.img
                                                        whileHover={{
                                                            scale: 1.1
                                                        }}
                                                        transition={{
                                                            duration: 0.3
                                                        }}
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="h-44
                                                                   w-full
                                                                   object-cover"/>
                                                ) : (
                                                    <motion.span
                                                        whileHover={{
                                                            scale: 1.2,
                                                            rotate: 10
                                                        }}
                                                        className="text-8xl">
                                                        🌱
                                                    </motion.span>
                                                )}

                                                {/* Discount badge */}
                                                {product
                                                  .discountPercentage
                                                  > 0 && (
                                                    <motion.div
                                                        initial={{
                                                            scale: 0,
                                                            rotate: -12
                                                        }}
                                                        animate={{
                                                            scale: 1,
                                                            rotate: -12
                                                        }}
                                                        className="absolute
                                                                   top-4
                                                                   left-4
                                                                   bg-red-500
                                                                   text-white
                                                                   text-xs
                                                                   font-bold
                                                                   px-2
                                                                   py-1
                                                                   rounded-lg">
                                                        {Math.round(
                                                            product
                                                            .discountPercentage
                                                        )}% OFF
                                                    </motion.div>
                                                )}

                                                {/* Stock badge */}
                                                {!product.isAvailable
                                                    && (
                                                    <div className="absolute
                                                                    inset-0
                                                                    bg-black
                                                                    bg-opacity-50
                                                                    flex
                                                                    items-center
                                                                    justify-center">
                                                        <span className="bg-red-600
                                                                         text-white
                                                                         font-bold
                                                                         px-4 py-2
                                                                         rounded-xl">
                                                            {t('products.outOfStock')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="p-4">
                                                <div className="flex
                                                                justify-between
                                                                items-start
                                                                mb-2">
                                                    <span className="text-xs
                                                                     text-green-600
                                                                     font-medium
                                                                     bg-green-50
                                                                     px-2 py-1
                                                                     rounded-lg">
                                                        {product.categoryName}
                                                    </span>
                                                    {product.unit && (
                                                        <span className="text-xs
                                                                         text-gray-400
                                                                         bg-gray-100
                                                                         px-2 py-1
                                                                         rounded-lg">
                                                            {product.unit}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="font-bold
                                                               text-gray-800
                                                               text-lg
                                                               mb-1
                                                               line-clamp-1">
                                                    {product.name}
                                                </h3>

                                                <p className="text-gray-400
                                                              text-sm
                                                              mb-3
                                                              line-clamp-2
                                                              leading-relaxed">
                                                    {product.description
                                                     || 'Quality farming product'}
                                                </p>

                                                {/* Price */}
                                                <div className="flex
                                                                items-center
                                                                justify-between
                                                                mb-4">
                                                    <div className="flex
                                                                    items-baseline
                                                                    gap-2">
                                                        <span className="text-2xl
                                                                         font-bold
                                                                         text-green-600">
                                                            ₹{product.price}
                                                        </span>
                                                        {product.originalPrice
                                                            && (
                                                            <span className="text-sm
                                                                             text-gray-400
                                                                             line-through">
                                                                ₹{product.originalPrice}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <span className={`text-xs
                                                                      font-medium
                                                                      px-2 py-1
                                                                      rounded-lg
                                                                      ${product.stockQuantity
                                                                          > 10
                                                                          ? 'bg-green-100 text-green-700'
                                                                          : product.stockQuantity > 0
                                                                          ? 'bg-orange-100 text-orange-700'
                                                                          : 'bg-red-100 text-red-700'
                                                                      }`}>
                                                        {product.stockQuantity
                                                            > 10
                                                            ? '✅ In Stock'
                                                            : product.stockQuantity
                                                                > 0
                                                            ? `⚠️ Only ${product.stockQuantity} left`
                                                            : '❌ Out of Stock'
                                                        }
                                                    </span>
                                                </div>

                                                {/* Buttons */}
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
                                                        disabled={
                                                            !product.isAvailable
                                                            || addingToCart
                                                               === product.id
                                                        }
                                                        className="flex-1
                                                                   bg-green-600
                                                                   hover:bg-green-700
                                                                   disabled:bg-gray-300
                                                                   text-white
                                                                   font-bold
                                                                   py-3
                                                                   rounded-xl
                                                                   text-sm
                                                                   transition-colors
                                                                   flex items-center
                                                                   justify-center
                                                                   gap-1">
                                                        {addingToCart
                                                            === product.id
                                                            ? (
                                                            <motion.div
                                                                animate={{
                                                                    rotate: 360
                                                                }}
                                                                transition={{
                                                                    duration: 1,
                                                                    repeat: Infinity,
                                                                    ease: "linear"
                                                                }}
                                                                className="w-4 h-4
                                                                           border-2
                                                                           border-white
                                                                           border-t-transparent
                                                                           rounded-full"/>
                                                        ) : (
                                                            <>
                                                                <ShoppingCart
                                                                    size={16}/>
                                                                {t('products.addToCart')}
                                                            </>
                                                        )}
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
                                                                       py-3 px-3
                                                                       rounded-xl
                                                                       text-sm
                                                                       transition-colors
                                                                       flex items-center
                                                                       justify-center">
                                                            <Eye size={18}/>
                                                        </Link>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Products;