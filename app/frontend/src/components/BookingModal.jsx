import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const BookingModal = ({ room, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    return calculateNights() * room.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!user) {
      setError('Please login to book a room');
      setLoading(false);
      return;
    }

    const nights = calculateNights();
    if (nights <= 0) {
      setError('Check-out date must be after check-in date');
      setLoading(false);
      return;
    }

    try {
      await api.post('/bookings/', {
        user_id: user.userId,
        room_id: room.room_id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        total_amount: calculateTotal()
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ maxWidth: '500px', width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Book Room</h2>
          <button onClick={onClose} style={{ background: 'none', fontSize: '1.5rem' }}>×</button>
        </div>

        <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>{room.type} - {room.room_number}</h3>
          <p style={{ margin: 0, fontSize: '1.2em', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            ${room.price} / night
          </p>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Check-in Date</label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Check-out Date</label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>

          {checkIn && checkOut && calculateNights() > 0 && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Nights:</span>
                <strong>{calculateNights()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2em', color: 'var(--primary-color)' }}>
                <span>Total:</span>
                <strong>${calculateTotal()}</strong>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
