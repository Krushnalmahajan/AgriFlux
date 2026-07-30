const translations = {

    // ── NAVBAR ────────────────────────────────────
    nav: {
        home:        { en: 'Home',        hi: 'होम' },
        products:    { en: 'Products',    hi: 'उत्पाद' },
        weather:     { en: 'Weather',     hi: 'मौसम' },
        orders:      { en: 'My Orders',   hi: 'मेरे आदेश' },
        cart:        { en: 'Cart',        hi: 'कार्ट' },
        login:       { en: 'Login',       hi: 'लॉगिन' },
        register:    { en: 'Register',    hi: 'रजिस्टर' },
        logout:      { en: 'Logout',      hi: 'लॉगआउट' },
        settings:    { en: 'Settings',    hi: 'सेटिंग्स' },
        admin:       { en: 'Admin Panel', hi: 'एडमिन पैनल' },
    },

    // ── HOME PAGE ─────────────────────────────────
    home: {
        heroTitle:    { en: 'Your Complete Farming Solution',
                        hi: 'आपका संपूर्ण कृषि समाधान' },
        heroSubtitle: { en: 'Quality seeds, fertilizers, tools and expert advice — all in one place',
                        hi: 'उच्च गुणवत्ता के बीज, खाद, उपकरण और विशेषज्ञ सलाह — एक ही जगह' },
        shopNow:      { en: 'Shop Now',       hi: 'अभी खरीदें' },
        checkWeather: { en: 'Check Weather',  hi: 'मौसम देखें' },
        featured:     { en: 'Featured Products', hi: 'विशेष उत्पाद' },
        categories:   { en: 'Shop by Category',  hi: 'श्रेणी से खरीदें' },
        whyUs:        { en: 'Why Choose AgriFlux?', hi: 'AgriFlux क्यों चुनें?' },
    },

    // ── PRODUCTS PAGE ─────────────────────────────
    products: {
        title:        { en: 'All Products',    hi: 'सभी उत्पाद' },
        search:       { en: 'Search products...', hi: 'उत्पाद खोजें...' },
        filter:       { en: 'Filter',          hi: 'फ़िल्टर' },
        allCategory:  { en: 'All Categories',  hi: 'सभी श्रेणियां' },
        addToCart:    { en: 'Add to Cart',     hi: 'कार्ट में जोड़ें' },
        viewDetails:  { en: 'View Details',    hi: 'विवरण देखें' },
        inStock:      { en: 'In Stock',        hi: 'उपलब्ध' },
        outOfStock:   { en: 'Out of Stock',    hi: 'उपलब्ध नहीं' },
        noProducts:   { en: 'No products found', hi: 'कोई उत्पाद नहीं मिला' },
        price:        { en: 'Price',           hi: 'मूल्य' },
        discount:     { en: 'off',             hi: 'छूट' },
    },

    // ── PRODUCT DETAIL ────────────────────────────
    productDetail: {
        addToCart:    { en: 'Add to Cart',      hi: 'कार्ट में जोड़ें' },
        buyNow:       { en: 'Buy Now',          hi: 'अभी खरीदें' },
        quantity:     { en: 'Quantity',         hi: 'मात्रा' },
        description:  { en: 'Description',      hi: 'विवरण' },
        category:     { en: 'Category',         hi: 'श्रेणी' },
        unit:         { en: 'Unit',             hi: 'इकाई' },
        stock:        { en: 'Stock Available',  hi: 'स्टॉक उपलब्ध' },
    },

    // ── CART PAGE ─────────────────────────────────
    cart: {
        title:        { en: 'Your Cart',        hi: 'आपका कार्ट' },
        empty:        { en: 'Your cart is empty', hi: 'आपका कार्ट खाली है' },
        emptyMsg:     { en: 'Add some products to get started',
                        hi: 'शुरू करने के लिए कुछ उत्पाद जोड़ें' },
        shopNow:      { en: 'Shop Now',         hi: 'अभी खरीदें' },
        remove:       { en: 'Remove',           hi: 'हटाएं' },
        total:        { en: 'Total',            hi: 'कुल' },
        items:        { en: 'items',            hi: 'वस्तुएं' },
        checkout:     { en: 'Proceed to Checkout', hi: 'चेकआउट करें' },
        clearCart:    { en: 'Clear Cart',       hi: 'कार्ट साफ करें' },
    },

    // ── CHECKOUT PAGE ─────────────────────────────
    checkout: {
        title:        { en: 'Checkout',         hi: 'चेकआउट' },
        address:      { en: 'Delivery Address', hi: 'डिलीवरी पता' },
        addAddress:   { en: 'Add New Address',  hi: 'नया पता जोड़ें' },
        payment:      { en: 'Payment Method',   hi: 'भुगतान विधि' },
        cod:          { en: 'Cash on Delivery', hi: 'नकद भुगतान' },
        online:       { en: 'Online Payment',   hi: 'ऑनलाइन भुगतान' },
        placeOrder:   { en: 'Place Order',      hi: 'आदेश दें' },
        orderSummary: { en: 'Order Summary',    hi: 'आदेश सारांश' },
        notes:        { en: 'Delivery Notes (Optional)',
                        hi: 'डिलीवरी नोट्स (वैकल्पिक)' },
    },

    // ── ORDERS PAGE ───────────────────────────────
    orders: {
        title:        { en: 'My Orders',        hi: 'मेरे आदेश' },
        noOrders:     { en: 'No orders yet',    hi: 'अभी तक कोई आदेश नहीं' },
        orderId:      { en: 'Order ID',         hi: 'आदेश संख्या' },
        status:       { en: 'Status',           hi: 'स्थिति' },
        total:        { en: 'Total',            hi: 'कुल' },
        date:         { en: 'Date',             hi: 'दिनांक' },
        cancel:       { en: 'Cancel Order',     hi: 'आदेश रद्द करें' },
        viewDetails:  { en: 'View Details',     hi: 'विवरण देखें' },
        placed:       { en: 'Placed',           hi: 'दिया गया' },
        confirmed:    { en: 'Confirmed',        hi: 'पुष्टि हुई' },
        processing:   { en: 'Processing',       hi: 'प्रक्रिया में' },
        shipped:      { en: 'Shipped',          hi: 'भेजा गया' },
        delivered:    { en: 'Delivered',        hi: 'पहुंचा दिया' },
        cancelled:    { en: 'Cancelled',        hi: 'रद्द' },
    },

    // ── WEATHER PAGE ──────────────────────────────
    weather: {
        title:        { en: 'Weather & Farming Forecast',
                        hi: 'मौसम और कृषि पूर्वानुमान' },
        searchCity:   { en: 'Search city...',   hi: 'शहर खोजें...' },
        search:       { en: 'Search',           hi: 'खोजें' },
        humidity:     { en: 'Humidity',         hi: 'नमी' },
        wind:         { en: 'Wind Speed',       hi: 'हवा की गति' },
        feelsLike:    { en: 'Feels Like',       hi: 'अनुभव' },
        farmingAdvice:{ en: 'Farming Advice',   hi: 'कृषि सलाह' },
        forecast:     { en: '5-Day Forecast',   hi: '5 दिन का पूर्वानुमान' },
    },

    // ── CHATBOT ───────────────────────────────────
    chatbot: {
        title:        { en: 'AgriBot — Farming Assistant',
                        hi: 'AgriBot — कृषि सहायक' },
        placeholder:  { en: 'Ask about crops, fertilizers, diseases...',
                        hi: 'फसल, खाद, बीमारियों के बारे में पूछें...' },
        send:         { en: 'Send',             hi: 'भेजें' },
        greeting:     { en: 'Hello! I am AgriBot. How can I help you today?',
                        hi: 'नमस्ते! मैं AgriBot हूं। आज मैं आपकी कैसे मदद कर सकता हूं?' },
    },

    // ── AUTH PAGES ────────────────────────────────
    auth: {
        login:        { en: 'Login',            hi: 'लॉगिन' },
        register:     { en: 'Create Account',   hi: 'खाता बनाएं' },
        email:        { en: 'Email Address',    hi: 'ईमेल पता' },
        password:     { en: 'Password',         hi: 'पासवर्ड' },
        name:         { en: 'Full Name',        hi: 'पूरा नाम' },
        loginBtn:     { en: 'Login',            hi: 'लॉगिन करें' },
        registerBtn:  { en: 'Create Account',   hi: 'खाता बनाएं' },
        noAccount:    { en: "Don't have an account?", hi: 'खाता नहीं है?' },
        hasAccount:   { en: 'Already have an account?', hi: 'पहले से खाता है?' },
        signUp:       { en: 'Sign Up',          hi: 'साइन अप करें' },
        signIn:       { en: 'Sign In',          hi: 'साइन इन करें' },
    },

    // ── SETTINGS ─────────────────────────────────
    settings: {
        title:        { en: 'Settings',         hi: 'सेटिंग्स' },
        language:     { en: 'Language',         hi: 'भाषा' },
        english:      { en: 'English',          hi: 'अंग्रेज़ी' },
        hindi:        { en: 'Hindi',            hi: 'हिंदी' },
        selectLang:   { en: 'Select Language',  hi: 'भाषा चुनें' },
        saved:        { en: 'Settings saved!',  hi: 'सेटिंग्स सहेजी गई!' },
    },

    // ── COMMON ────────────────────────────────────
    common: {
        loading:      { en: 'Loading...',       hi: 'लोड हो रहा है...' },
        error:        { en: 'Something went wrong', hi: 'कुछ गलत हुआ' },
        success:      { en: 'Success!',         hi: 'सफलता!' },
        save:         { en: 'Save',             hi: 'सहेजें' },
        cancel:       { en: 'Cancel',           hi: 'रद्द करें' },
        delete:       { en: 'Delete',           hi: 'हटाएं' },
        edit:         { en: 'Edit',             hi: 'संपादित करें' },
        back:         { en: 'Back',             hi: 'वापस' },
        next:         { en: 'Next',             hi: 'आगे' },
        submit:       { en: 'Submit',           hi: 'जमा करें' },
        close:        { en: 'Close',            hi: 'बंद करें' },
        rupee:        { en: '₹',               hi: '₹' },
        welcome:      { en: 'Welcome',          hi: 'स्वागत है' },
    },
};

export default translations;