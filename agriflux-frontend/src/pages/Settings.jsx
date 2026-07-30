import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/languageSlice';
import useTranslation from '../utils/useTranslation';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const Settings = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const currentLang = useSelector(
        (state) => state.language.current
    );

    const handleLanguageChange = (lang) => {
        dispatch(setLanguage(lang));
        toast.success(
            lang === 'hi'
                ? 'भाषा हिंदी में बदली गई!'
                : 'Language changed to English!'
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-10">

                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    ⚙️ {t('settings.title')}
                </h1>

                {/* Language Card */}
                <div className="bg-white rounded-2xl shadow-sm
                                border border-gray-100 p-6 mb-6">

                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <span className="text-2xl">🌐</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {t('settings.language')}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {t('settings.selectLang')}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        {/* English Option */}
                        <button
                            onClick={() => handleLanguageChange('en')}
                            className={`p-4 rounded-xl border-2 transition-all
                                flex flex-col items-center gap-2
                                ${currentLang === 'en'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300'
                                }`}
                        >
                            <span className="text-4xl">🇬🇧</span>
                            <span className="font-bold text-gray-800 text-lg">
                                English
                            </span>
                            <span className="text-gray-500 text-sm">
                                English Language
                            </span>
                            {currentLang === 'en' && (
                                <span className="bg-green-500 text-white
                                                text-xs px-3 py-1 rounded-full">
                                    ✓ Active
                                </span>
                            )}
                        </button>

                        {/* Hindi Option */}
                        <button
                            onClick={() => handleLanguageChange('hi')}
                            className={`p-4 rounded-xl border-2 transition-all
                                flex flex-col items-center gap-2
                                ${currentLang === 'hi'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300'
                                }`}
                        >
                            <span className="text-4xl">🇮🇳</span>
                            <span className="font-bold text-gray-800 text-lg">
                                हिंदी
                            </span>
                            <span className="text-gray-500 text-sm">
                                Hindi Language
                            </span>
                            {currentLang === 'hi' && (
                                <span className="bg-green-500 text-white
                                                text-xs px-3 py-1 rounded-full">
                                    ✓ सक्रिय
                                </span>
                            )}
                        </button>

                    </div>

                    {/* Current language indicator */}
                    <div className="mt-6 bg-green-50 rounded-xl p-4
                                    flex items-center gap-3">
                        <span className="text-2xl">
                            {currentLang === 'hi' ? '🇮🇳' : '🇬🇧'}
                        </span>
                        <p className="text-green-800 font-medium">
                            {currentLang === 'hi'
                                ? 'वर्तमान भाषा: हिंदी'
                                : 'Current language: English'}
                        </p>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 rounded-2xl p-6
                                border border-blue-100">
                    <h3 className="font-bold text-blue-800 mb-2">
                        ℹ️ {currentLang === 'hi'
                            ? 'जानकारी'
                            : 'Information'}
                    </h3>
                    <p className="text-blue-700 text-sm leading-relaxed">
                        {currentLang === 'hi'
                            ? 'भाषा बदलने पर पूरी वेबसाइट तुरंत बदल जाएगी। आपकी पसंद सहेजी जाएगी।'
                            : 'Changing the language will instantly update the entire website. Your preference will be saved automatically.'}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Settings;