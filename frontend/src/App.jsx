import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainNavigation from './components/layout/MainNavigation';
import LoginPage, { action as loginAction } from './pages/LoginPage';
import SignupPage, { action as signupAction } from './pages/SignupPage';
import HomePage from './pages/HomePage';
import CreateTripPage from './pages/CreateTripPage';
import EditTripPage from './pages/EditTripPage';
import TripDetailPage from './pages/TripDetailPage';
import AdminPage from './pages/AdminPage';
import './App.css';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage />, action: loginAction },
  { path: '/signup', element: <SignupPage />, action: signupAction },
  {
    path: '/',
    element: <MainNavigation />,
    children: [
      {
        path: '',
        element: <ProtectedRoute>
          <HomePage />
          </ProtectedRoute>,
      },
      {
        path: 'trips',
        children: [
          { path: 'new', element: <ProtectedRoute><CreateTripPage /></ProtectedRoute> },
          { path: 'detail/:id', element: <ProtectedRoute><TripDetailPage /></ProtectedRoute> },
          { path: 'edit/:id', element: <ProtectedRoute><EditTripPage /></ProtectedRoute> },
        ],
      },
      { path: 'admin', element: <ProtectedRoute><AdminPage /></ProtectedRoute> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
