import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
    const { user, login, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        username: ''
    });
    const [pwdData, setPwdData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [user, authLoading, navigate]);

    const fetchProfile = async () => {
        try {
            const res = await api.get(`/users/me?user_id=${user.userId}`);
            setProfile(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        try {
            await api.patch(`/users/me?user_id=${user.userId}`, {
                full_name: profile.full_name,
                phone_number: profile.phone_number
            });
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        if (pwdData.new_password !== pwdData.confirm_password) {
            setError('New passwords do not match');
            return;
        }
        try {
            await api.patch(`/users/me/password?user_id=${user.userId}`, {
                old_password: pwdData.old_password,
                new_password: pwdData.new_password
            });
            setMessage('Password changed successfully!');
            setPwdData({ old_password: '', new_password: '', confirm_password: '' });
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to change password');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                await api.delete(`/users/me?user_id=${user.userId}`);
                logout();
                navigate('/login');
            } catch (err) {
                setError('Failed to delete account');
            }
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <h2>Member Profile</h2>
            {message && <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>{message}</div>}
            {error && <div className="error-msg">{error}</div>}

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Update Information</h3>
                <form onSubmit={handleUpdateProfile}>
                    <div className="form-group">
                        <label>Username (Fixed)</label>
                        <input value={profile.username} disabled />
                    </div>
                    <div className="form-group">
                        <label>Email (Fixed)</label>
                        <input value={profile.email} disabled />
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            value={profile.full_name}
                            onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            value={profile.phone_number || ''}
                            onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="primary">Update Profile</button>
                </form>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3>Change Password</h3>
                <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                        <label>Old Password</label>
                        <input
                            type="password"
                            value={pwdData.old_password}
                            onChange={(e) => setPwdData({...pwdData, old_password: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={pwdData.new_password}
                            onChange={(e) => setPwdData({...pwdData, new_password: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={pwdData.confirm_password}
                            onChange={(e) => setPwdData({...pwdData, confirm_password: e.target.value})}
                            required
                        />
                    </div>
                    <button type="submit" className="primary">Change Password</button>
                </form>
            </div>

            <div className="card" style={{ borderColor: 'var(--accent-color)', border: '1px solid #ffcccc' }}>
                <h3 style={{ color: 'var(--accent-color)' }}>Danger Zone</h3>
                <p>Deleting your account will remove all your booking history and profile information.</p>
                <button
                    onClick={handleDeleteAccount}
                    style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
