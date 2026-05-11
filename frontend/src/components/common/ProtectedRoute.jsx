import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpiringSoon, isTokenValid } from '../../util/auth';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTokenValid()) {
      navigate('/login');
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
