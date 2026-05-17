import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isTokenExpiringSoon, isTokenValid } from '../../util/auth';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isTokenValid()) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    if (isTokenExpiringSoon()) {
      console.warn('Session expiring soon.');
    }
    const interval = setInterval(() => {
      if (!isTokenValid()) {
        navigate('/login');
        clearInterval(interval);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  return isTokenValid() ? children : null;
}
