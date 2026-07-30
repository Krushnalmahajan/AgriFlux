import { useSelector } from 'react-redux';
import translations from './translations';

// Custom hook — use this in every component
// Returns a function t() that gives correct text
const useTranslation = () => {

    const lang = useSelector(
        (state) => state.language.current
    );

    // t('nav.home') → 'Home' or 'होम'
    const t = (key) => {
        // Split key like 'nav.home' into ['nav', 'home']
        const parts = key.split('.');

        if (parts.length !== 2) return key;

        const section = parts[0];
        const item = parts[1];

        // Find translation
        const translation = translations[section]?.[item];

        if (!translation) return key;

        // Return English or Hindi based on current language
        return translation[lang] || translation['en'] || key;
    };

    return { t, lang };
};

export default useTranslation;