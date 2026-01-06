import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PaymentModal from '../components/PaymentModal';
import ReviewModal from '../components/ReviewModal';
import EditBookingModal from '../components/EditBookingModal';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeBooking, setActiveBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading before checking user
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, authLoading, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await api.get(`/bookings/user/${user.userId}`);
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Cancel this booking?')) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (err) {
        alert(err.response?.data?.detail || 'Failed to cancel booking');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': '#28a745',
      'Pending': '#ffc107',
      'Cancelled': '#dc3545',
      'Completed': '#17a2b8'
    };
    return colors[status] || '#6c757d';
  };

  if (authLoading || loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error-msg">{error}</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Bookings</h2>
        <a href="/rooms">
          <button className="primary">Book New Room</button>
        </a>
      </div>

      {bookings.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#666', fontSize: '1.1em' }}>No bookings yet.</p>
          <a href="/rooms">
            <button className="primary" style={{ marginTop: '1rem' }}>
              Browse Rooms
            </button>
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((booking) => (
            <div key={booking.booking_id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>Booking #{booking.booking_code || booking.booking_id.slice(0, 8)}</h3>
                  <p style={{ margin: 0, color: 'var(--primary-color)', fontWeight: '500' }}>{booking.room_type} - Room {booking.room_number}</p>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.85em' }}>ID: {booking.room_id.slice(0, 8)}...</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '0.4em 0.8em',
                      borderRadius: 'var(--radius)',
                      backgroundColor: getStatusColor(booking.status) + '20',
                      color: getStatusColor(booking.status),
                      fontWeight: '500',
                      fontSize: '0.9em'
                    }}
                  >
                    {booking.status}
                  </span>
                  {booking.status === 'Pending' && (
                    <>
                      <button className="primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8em' }} onClick={() => { setActiveBooking(booking); setShowPayment(true); }}>Pay Now</button>
                      <button style={{ padding: '0.3rem 0.6rem', fontSize: '0.8em', border: '1px solid #ccc' }} onClick={() => { setActiveBooking(booking); setShowEdit(true); }}>Edit</button>
                      <button style={{ padding: '0.3rem 0.6rem', fontSize: '0.8em', color: 'var(--accent-color)', background: 'none' }} onClick={() => handleDelete(booking.booking_id)}>Cancel</button>
                    </>
                  )}
                  {booking.status === 'Completed' && !booking.is_reviewed && (
                    <button className="primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8em' }} onClick={() => { setActiveBooking(booking); setShowReview(true); }}>Leave Review</button>
                  )}
                  {booking.is_reviewed && (
                    <span style={{ fontSize: '0.8em', color: '#666', fontStyle: 'italic' }}>✓ Reviewed</span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.3rem', color: '#666', fontSize: '0.9em' }}>Check-in</p>
                  <p style={{ margin: 0, fontWeight: '500' }}>
                    {new Date(booking.check_in_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.3rem', color: '#666', fontSize: '0.9em' }}>Check-out</p>
                  <p style={{ margin: 0, fontWeight: '500' }}>
                    {new Date(booking.check_out_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.3rem', color: '#666', fontSize: '0.9em' }}>Total Amount</p>
                  <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '1.1em' }}>
                    ${booking.total_amount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPayment && <PaymentModal booking={activeBooking} onClose={() => setShowPayment(false)} onSuccess={() => { setShowPayment(false); fetchBookings(); }} />}
      {showReview && <ReviewModal booking={activeBooking} onClose={() => setShowReview(false)} onSuccess={() => { setShowReview(false); fetchBookings(); }} />}
      {showEdit && <EditBookingModal booking={activeBooking} onClose={() => setShowEdit(false)} onSuccess={() => { setShowEdit(false); fetchBookings(); }} />}
    </div>
  );
};

export default MyBookingsPage;
