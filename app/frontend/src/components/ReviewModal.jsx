import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ReviewModal = ({ booking, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/feedback/', {
                booking_id: booking.booking_id,
                user_id: user.userId,
                rating,
                comment
            });
            onSuccess();
        } catch (err) {
            setError('Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="card" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%' }}>
                <h3>Leave a Review</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Rating</label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            {[1, 2, 3, 4, 5].map(num => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setRating(num)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '2rem',
                                        color: num <= rating ? '#ffc107' : '#eee',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Comment</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            rows="4"
                        />
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="primary" disabled={loading}>Submit Review</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
