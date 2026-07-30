import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Redirects to home if not admin
const AdminRoute = ({ children }) => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    if (!isLoggedIn) return <Navigate to="/login" />;
    if (user?.role !== 'ADMIN') return <Navigate to="/" />;

    return children;
};

export default AdminRoute;