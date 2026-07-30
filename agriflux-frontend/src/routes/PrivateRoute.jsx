import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Redirects to login if not logged in
const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useSelector((state) => state.auth);
    return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;