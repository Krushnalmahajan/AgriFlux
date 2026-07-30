import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { loginUser } from '../api/authApi';
import { loginSuccess } from '../redux/authSlice';
import useTranslation from '../utils/useTranslation';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { fadeInUp, scaleIn } from '../utils/animations';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [form, setForm] = useState({
        email: '', password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await loginUser(form);
            const data = response.data;
            dispatch(loginSuccess({
                token: data.token,
                user: {
                    name: data.name,
                    email: data.email,
                    role: data.role,
                }
            }));
            toast.success(`Welcome back, ${data.name}! 🌾`);
            if (data.role === 'ADMIN') navigate('/admin');
            else navigate('/');
        } catch (error) {
            toast.error(
                error.response?.data?.error
                || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br
                        from-green-50 to-emerald-100
                        flex items-center justify-center
                        px-4 overflow-hidden relative">

            {/* Animated background elements */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity
                }}
                className="absolute top-20 left-20 w-32 h-32
                           bg-green-200 rounded-full blur-xl"/>

            <motion.div
                animate={{
                    scale: [1.3, 1, 1.3],
                    opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity
                }}
                className="absolute bottom-20 right-20
                           w-48 h-48 bg-emerald-200
                           rounded-full blur-xl"/>

            <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md relative z-10">

                {/* Logo */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="text-center mb-8">
                    <motion.span
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}
                        className="text-6xl block">
                        🌾
                    </motion.span>
                    <h1 className="text-3xl font-bold
                                   text-green-700 mt-3">
                        AgriFlux
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Empowering Indian Farmers
                    </p>
                </motion.div>

                {/* Card */}
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-3xl
                               shadow-2xl p-8
                               border border-gray-100">

                    <h2 className="text-2xl font-bold
                                   text-gray-800 mb-6">
                        {t('auth.login')} 👋
                    </h2>

                    <form onSubmit={handleSubmit}
                          className="space-y-5">

                        {/* Email */}
                        <motion.div
                            whileFocus={{ scale: 1.01 }}>
                            <label className="block text-gray-700
                                              font-medium mb-2">
                                📧 {t('auth.email')}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full border-2
                                           border-gray-200
                                           rounded-xl px-4 py-3
                                           text-gray-800
                                           focus:border-green-500
                                           focus:outline-none
                                           text-lg transition-all
                                           focus:shadow-lg
                                           focus:shadow-green-100"/>
                        </motion.div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-700
                                              font-medium mb-2">
                                🔒 {t('auth.password')}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword
                                        ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full border-2
                                               border-gray-200
                                               rounded-xl px-4
                                               py-3 text-gray-800
                                               focus:border-green-500
                                               focus:outline-none
                                               text-lg pr-12
                                               transition-all"/>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword)}
                                    className="absolute right-4
                                               top-1/2
                                               -translate-y-1/2
                                               text-gray-400
                                               hover:text-gray-600">
                                    {showPassword
                                        ? <EyeOff size={20} />
                                        : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-green-600
                                       hover:bg-green-700
                                       disabled:bg-green-300
                                       text-white font-bold
                                       py-3 rounded-xl text-lg
                                       transition-colors flex
                                       items-center justify-center
                                       gap-2 shadow-lg
                                       shadow-green-200">
                            {loading ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        className="w-5 h-5 border-2
                                                   border-white
                                                   border-t-transparent
                                                   rounded-full"/>
                                    {t('common.loading')}
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    {t('auth.loginBtn')}
                                </>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center text-gray-500
                                  mt-6 text-base">
                        {t('auth.noAccount')}{' '}
                        <Link to="/register"
                              className="text-green-600 font-bold
                                         hover:underline">
                            {t('auth.signUp')}
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;