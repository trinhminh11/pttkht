import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoomListPage from './pages/RoomListPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProfilePage from './pages/ProfilePage';
import RoomDetailPage from './pages/RoomDetailPage';
import AdminPage from './pages/AdminPage';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="brand">
        <a href="/"><h3>Nhom 14 Hotel</h3></a>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            {user.role === 'Manager' ? (
              <a href="/admin" style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Admin Panel</a>
            ) : (
              <>
                <a href="/rooms">Rooms</a>
                <a href="/my-bookings">My Bookings</a>
                <a href="/profile">Profile</a>
              </>
            )}
            <button
              onClick={logout}
              className="primary"
              style={{ padding: '0.4em 1em' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="app-container">
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/rooms" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/rooms" element={<RoomListPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
