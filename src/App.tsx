import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/src/components/Layout';
import Home from '@/src/pages/Home';
import BookingsPage from '@/src/pages/BookingsPage';
import AuthPage from '@/src/pages/AuthPage';
import AdminDashboard from '@/src/pages/AdminDashboard';
import { AuthProvider } from '@/src/lib/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
