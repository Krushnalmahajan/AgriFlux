import { Link } from 'react-router-dom';
import useTranslation from '../utils/useTranslation';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4
                                gap-8">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🌾</span>
                            <span className="text-2xl font-bold
                                             text-green-400">
                                AgriFlux
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed
                                      max-w-xs">
                            {t('home.heroSubtitle')}
                        </p>
                        <div className="flex gap-4 mt-6">
                            <span className="bg-green-600 p-2
                                             rounded-lg text-xl
                                             cursor-pointer
                                             hover:bg-green-500
                                             transition-colors">
                                📘
                            </span>
                            <span className="bg-green-600 p-2
                                             rounded-lg text-xl
                                             cursor-pointer
                                             hover:bg-green-500
                                             transition-colors">
                                📸
                            </span>
                            <span className="bg-green-600 p-2
                                             rounded-lg text-xl
                                             cursor-pointer
                                             hover:bg-green-500
                                             transition-colors">
                                🐦
                            </span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4
                                       text-green-400">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { to: '/', label: t('nav.home') },
                                { to: '/products',
                                  label: t('nav.products') },
                                { to: '/weather',
                                  label: t('nav.weather') },
                                { to: '/orders',
                                  label: t('nav.orders') },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to}
                                          className="text-gray-400
                                                     hover:text-green-400
                                                     transition-colors
                                                     flex items-center
                                                     gap-2">
                                        → {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-lg mb-4
                                       text-green-400">
                            Contact Us
                        </h3>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-center gap-2">
                                📧 support@agriflux.in
                            </li>
                            <li className="flex items-center gap-2">
                                📞 1800-XXX-XXXX
                            </li>
                            <li className="flex items-center gap-2">
                                📍 Pune, Maharashtra, India
                            </li>
                            <li className="flex items-center gap-2">
                                🕐 Mon-Sat: 9AM - 6PM
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-10
                                pt-6 flex flex-col md:flex-row
                                justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2025 AgriFlux. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Made with ❤️ for Indian Farmers 🇮🇳
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;