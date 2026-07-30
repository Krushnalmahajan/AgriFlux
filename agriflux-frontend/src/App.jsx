import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Weather from './pages/Weather';
import Settings from './pages/Settings';

// Admin Pages
import AdminDashboard from './admin/AdminDashboard';
import ManageProducts from './admin/ManageProducts';
import ManageOrders from './admin/ManageOrders';

// ← Add this import
import Chatbot from './components/Chatbot';

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            fontSize: '16px',
                            borderRadius: '12px',
                        }
                    }}
                />

                {/* ← Add Chatbot here — shows on ALL pages */}
                <Chatbot />

                <Routes>
                    {/* Public Routes */}
                    <Route path="/"
                           element={<Home />} />
                    <Route path="/login"
                           element={<Login />} />
                    <Route path="/register"
                           element={<Register />} />
                    <Route path="/products"
                           element={<Products />} />
                    <Route path="/products/:id"
                           element={<ProductDetail />} />
                    <Route path="/weather"
                           element={<Weather />} />
                    <Route path="/settings"
                           element={<Settings />} />

                    {/* Protected Routes */}
                    <Route path="/cart" element={
                        <PrivateRoute>
                            <Cart />
                        </PrivateRoute>
                    } />
                    <Route path="/checkout" element={
                        <PrivateRoute>
                            <Checkout />
                        </PrivateRoute>
                    } />
                    <Route path="/orders" element={
                        <PrivateRoute>
                            <Orders />
                        </PrivateRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } />
                    <Route path="/admin/products" element={
                        <AdminRoute>
                            <ManageProducts />
                        </AdminRoute>
                    } />
                    <Route path="/admin/orders" element={
                        <AdminRoute>
                            <ManageOrders />
                        </AdminRoute>
                    } />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}

export default App;