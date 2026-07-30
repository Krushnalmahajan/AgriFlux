import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import useTranslation from '../utils/useTranslation';
import toast from 'react-hot-toast';
import {
    ShoppingCart, Home, Package, CloudSun,
    LogIn, LogOut, User, Settings, Menu, X,
    Shield
} from 'lucide-react';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isLoggedIn, user } = useSelector(
            (state) => state.auth);
    const { totalItems } = useSelector(
            (state) => state.cart);

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully!');
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center
                                justify-between">

                    {/* ── LOGO ─────────────────── */}
                    <Link to="/"
                          className="flex items-center gap-2">
                        <span className="text-3xl">🌾</span>
                        <span className="text-2xl font-bold
                                         text-green-600">
                            AgriFlux
                        </span>
                    </Link>

                    {/* ── DESKTOP MENU ─────────── */}
                    <div className="hidden md:flex items-center
                                    gap-6">
                        <Link to="/"
                              className="flex items-center gap-1
                                         text-gray-600 hover:text-green-600
                                         font-medium transition-colors">
                            <Home size={18} />
                            {t('nav.home')}
                        </Link>

                        <Link to="/products"
                              className="flex items-center gap-1
                                         text-gray-600 hover:text-green-600
                                         font-medium transition-colors">
                            <Package size={18} />
                            {t('nav.products')}
                        </Link>

                        <Link to="/weather"
                              className="flex items-center gap-1
                                         text-gray-600 hover:text-green-600
                                         font-medium transition-colors">
                            <CloudSun size={18} />
                            {t('nav.weather')}
                        </Link>

                        {isLoggedIn && (
                            <Link to="/orders"
                                  className="flex items-center gap-1
                                             text-gray-600
                                             hover:text-green-600
                                             font-medium transition-colors">
                                <Package size={18} />
                                {t('nav.orders')}
                            </Link>
                        )}

                        {/* Admin Link */}
                        {isLoggedIn &&
                         user?.role === 'ADMIN' && (
                            <Link to="/admin"
                                  className="flex items-center gap-1
                                             text-purple-600
                                             hover:text-purple-800
                                             font-medium transition-colors">
                                <Shield size={18} />
                                {t('nav.admin')}
                            </Link>
                        )}
                    </div>

                    {/* ── RIGHT SIDE ICONS ─────── */}
                    <div className="hidden md:flex items-center
                                    gap-3">

                        {/* Settings */}
                        <Link to="/settings"
                              className="p-2 text-gray-500
                                         hover:text-green-600
                                         hover:bg-green-50
                                         rounded-xl transition-all">
                            <Settings size={22} />
                        </Link>

                        {/* Cart */}
                        {isLoggedIn && (
                            <Link to="/cart"
                                  className="relative p-2
                                             text-gray-500
                                             hover:text-green-600
                                             hover:bg-green-50
                                             rounded-xl
                                             transition-all">
                                <ShoppingCart size={22} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1
                                                     -right-1
                                                     bg-red-500
                                                     text-white
                                                     text-xs w-5 h-5
                                                     rounded-full
                                                     flex items-center
                                                     justify-center
                                                     font-bold">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Auth Buttons */}
                        {isLoggedIn ? (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600
                                                 font-medium text-sm">
                                    👋 {user?.name?.split(' ')[0]}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1
                                               bg-red-50 text-red-600
                                               px-4 py-2 rounded-xl
                                               hover:bg-red-100
                                               font-medium transition-all">
                                    <LogOut size={16} />
                                    {t('nav.logout')}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login"
                                      className="flex items-center gap-1
                                                 text-green-600
                                                 border border-green-600
                                                 px-4 py-2 rounded-xl
                                                 hover:bg-green-50
                                                 font-medium
                                                 transition-all">
                                    <LogIn size={16} />
                                    {t('nav.login')}
                                </Link>
                                <Link to="/register"
                                      className="flex items-center gap-1
                                                 bg-green-600 text-white
                                                 px-4 py-2 rounded-xl
                                                 hover:bg-green-700
                                                 font-medium
                                                 transition-all">
                                    <User size={16} />
                                    {t('nav.register')}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* ── MOBILE MENU BUTTON ────── */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-xl
                                   text-gray-600 hover:bg-gray-100">
                        {menuOpen
                            ? <X size={24} />
                            : <Menu size={24} />}
                    </button>
                </div>

                {/* ── MOBILE MENU ───────────────── */}
                {menuOpen && (
                    <div className="md:hidden mt-3 pb-3
                                    border-t border-gray-100
                                    flex flex-col gap-3 pt-3">
                        <Link to="/"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2
                                         text-gray-700 font-medium
                                         py-2 px-3 rounded-xl
                                         hover:bg-green-50">
                            <Home size={18} />
                            {t('nav.home')}
                        </Link>

                        <Link to="/products"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2
                                         text-gray-700 font-medium
                                         py-2 px-3 rounded-xl
                                         hover:bg-green-50">
                            <Package size={18} />
                            {t('nav.products')}
                        </Link>

                        <Link to="/weather"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2
                                         text-gray-700 font-medium
                                         py-2 px-3 rounded-xl
                                         hover:bg-green-50">
                            <CloudSun size={18} />
                            {t('nav.weather')}
                        </Link>

                        {isLoggedIn && (
                            <>
                                <Link to="/cart"
                                      onClick={() =>
                                          setMenuOpen(false)}
                                      className="flex items-center
                                                 gap-2 text-gray-700
                                                 font-medium py-2
                                                 px-3 rounded-xl
                                                 hover:bg-green-50">
                                    <ShoppingCart size={18} />
                                    {t('nav.cart')}
                                    {totalItems > 0 && (
                                        <span className="bg-red-500
                                                          text-white
                                                          text-xs px-2
                                                          py-0.5
                                                          rounded-full">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>

                                <Link to="/orders"
                                      onClick={() =>
                                          setMenuOpen(false)}
                                      className="flex items-center
                                                 gap-2 text-gray-700
                                                 font-medium py-2
                                                 px-3 rounded-xl
                                                 hover:bg-green-50">
                                    <Package size={18} />
                                    {t('nav.orders')}
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2
                                               text-red-600 font-medium
                                               py-2 px-3 rounded-xl
                                               hover:bg-red-50 text-left">
                                    <LogOut size={18} />
                                    {t('nav.logout')}
                                </button>
                            </>
                        )}

                        {!isLoggedIn && (
                            <>
                                <Link to="/login"
                                      onClick={() =>
                                          setMenuOpen(false)}
                                      className="flex items-center
                                                 gap-2 text-green-600
                                                 font-medium py-2
                                                 px-3 rounded-xl
                                                 hover:bg-green-50">
                                    <LogIn size={18} />
                                    {t('nav.login')}
                                </Link>
                                <Link to="/register"
                                      onClick={() =>
                                          setMenuOpen(false)}
                                      className="flex items-center
                                                 gap-2 bg-green-600
                                                 text-white font-medium
                                                 py-2 px-3 rounded-xl">
                                    <User size={18} />
                                    {t('nav.register')}
                                </Link>
                            </>
                        )}

                        <Link to="/settings"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2
                                         text-gray-700 font-medium
                                         py-2 px-3 rounded-xl
                                         hover:bg-green-50">
                            <Settings size={18} />
                            {t('nav.settings')}
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;