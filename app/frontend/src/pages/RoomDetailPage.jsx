import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import BookingModal from '../components/BookingModal';

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/rooms/${id}`);
      setData(res.data);
    } catch (err) {
      setError('Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading room details...</div>;
  if (error) return <div className="container error-msg">{error}</div>;

  const { room, reviews, stats } = data;

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem', background: 'none', color: 'var(--primary-color)' }}>← Back to Rooms</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '1rem' }}>
        <div>
          <div style={{ width: '100%', height: '400px', backgroundColor: '#eee', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            {room.images?.[0] ? (
              <img src={room.images[0]} alt={room.room_number} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>
            )}
          </div>
        </div>

        <div>
          <span style={{ backgroundColor: 'var(--primary-color)20', color: 'var(--primary-color)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.9em', fontWeight: 'bold' }}>
            {room.type}
          </span>
          <h1 style={{ margin: '1rem 0 0.5rem' }}>Room {room.room_number}</h1>
          <p style={{ color: '#666', fontSize: '1.1em', lineHeight: '1.6' }}>{room.description}</p>

          <div style={{ margin: '2rem 0', padding: '1.5rem', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ margin: 0, color: '#666' }}>Price per night</p>
                    <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>${room.price}</h2>
                </div>
                <button className="primary" onClick={() => setShowBooking(true)} style={{ padding: '1rem 2.5rem', fontSize: '1.1em' }}>Book Now</button>
            </div>
          </div>

          <div className="card">
            <h3>Rating Summary</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '3em', color: 'var(--primary-color)' }}>{stats.average}</h1>
                    <p style={{ margin: 0, color: '#666' }}>out of 5</p>
                    <p style={{ margin: '0.5rem 0 0', fontWeight: 'bold' }}>{stats.total} Reviews</p>
                </div>
                <div style={{ flex: 1 }}>
                    {[5,4,3,2,1].map(num => (
                        <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <span style={{ width: '80px', fontSize: '0.85em', color: '#ffc107' }}>
                                {'★'.repeat(num)}
                            </span>
                            <div style={{ flex: 1, height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    backgroundColor: 'var(--primary-color)',
                                    width: `${stats.total > 0 ? (stats.distribution[num] / stats.total) * 100 : 0}%`
                                }} />
                            </div>
                            <span style={{ width: '30px', fontSize: '0.9em', color: '#666' }}>{stats.distribution[num]}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '4rem' }}>
        <h2>Customer Reviews</h2>
        {reviews.length === 0 ? (
            <p style={{ color: '#666' }}>No reviews yet for this room.</p>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                {reviews.map((rev, idx) => (
                    <div key={idx} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ color: '#ffc107', fontSize: '1.2em' }}>
                                {'★'.repeat(rev.rating)}{'☆'.repeat(5-rev.rating)}
                            </div>
                            <span style={{ color: '#999', fontSize: '0.85em' }}>{new Date(rev.created_at).toLocaleDateString()}</span>
                        </div>
                        <p style={{ margin: 0, fontStyle: 'italic' }}>"{rev.comment}"</p>
                    </div>
                ))}
            </div>
        )}
      </div>

      {showBooking && (
        <BookingModal
          room={room}
          onClose={() => setShowBooking(false)}
          onSuccess={() => { setShowBooking(false); navigate('/my-bookings'); }}
        />
      )}
    </div>
  );
};

export default RoomDetailPage;
