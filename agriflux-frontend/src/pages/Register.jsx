import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../api/authApi';
import { loginSuccess } from '../redux/authSlice';
import useTranslation from '../utils/useTranslation';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await registerUser(form);
            const data = response.data;

            dispatch(loginSuccess({
                token: data.token,
                user: {
                    name: data.name,
                    email: data.email,
                    role: data.role,
                }
            }));

            toast.success(
                `Welcome to AgriFlux, ${data.name}! 🌾`);
            navigate('/');

        } catch (error) {
            const msg = error.response?.data?.error
                     || 'Registration failed. Try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br
                        from-green-50 to-emerald-100
                        flex items-center justify-center px-4
                        py-10">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <span className="text-6xl">🌾</span>
                    <h1 className="text-3xl font-bold
                                   text-green-700 mt-3">
                        AgriFlux
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Join 1000+ Farmers Today
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl
                                shadow-xl p-8">
                    <h2 className="text-2xl font-bold
                                   text-gray-800 mb-6">
                        {t('auth.register')} 🚀
                    </h2>

                    <form onSubmit={handleSubmit}
                          className="space-y-5">

                        {/* Name */}
                        <div>
                            <label className="block text-gray-700
                                              font-medium mb-2">
                                👤 {t('auth.name')}
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Ramesh Kumar"
                                className="w-full border-2
                                           border-gray-200
                                           rounded-xl px-4 py-3
                                           text-gray-800
                                           focus:border-green-500
                                           focus:outline-none
                                           text-lg transition-colors"
                            />
                        </div>

                        {/* Email */}
                        <div>
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
                                           text-lg transition-colors"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-700
                                              font-medium mb-2">
                                🔒 {t('auth.password')}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword
                                        ? 'text'
                                        : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Min 6 characters"
                                    className="w-full border-2
                                               border-gray-200
                                               rounded-xl px-4
                                               py-3 text-gray-800
                                               focus:border-green-500
                                               focus:outline-none
                                               text-lg pr-12
                                               transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)}
                                    className="absolute right-4
                                               top-1/2 -translate-y-1/2
                                               text-gray-400">
                                    {showPassword
                                        ? <EyeOff size={20} />
                                        : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600
                                       hover:bg-green-700
                                       disabled:bg-green-300
                                       text-white font-bold
                                       py-3 rounded-xl text-lg
                                       transition-colors
                                       flex items-center
                                       justify-center gap-2">
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2
                                                    border-white
                                                    border-t-transparent
                                                    rounded-full
                                                    animate-spin"/>
                                    {t('common.loading')}
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    {t('auth.registerBtn')}
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-500
                                  mt-6 text-base">
                        {t('auth.hasAccount')}{' '}
                        <Link to="/login"
                              className="text-green-600 font-bold
                                         hover:underline">
                            {t('auth.signIn')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;