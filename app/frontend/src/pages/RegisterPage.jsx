import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone_number: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Create Account</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleRegister}>
         <div className="form-group">
          <label>Full Name</label>
          <input name="full_name" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input name="username" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input name="phone_number" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" onChange={handleChange} required />
        </div>
        <button type="submit" className="primary" style={{ width: '100%' }}>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
