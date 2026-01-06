import { useState } from 'react';
import api from '../services/api';

const EditBookingModal = ({ booking, onClose, onSuccess }) => {
    const [checkIn, setCheckIn] = useState(booking.check_in_date);
    const [checkOut, setCheckOut] = useState(booking.check_out_date);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.patch(`/bookings/${booking.booking_id}`, {
                check_in_date: checkIn,
                check_out_date: checkOut
            });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.detail || 'Update failed');
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
                <h3>Edit Booking Dates</h3>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Check-in Date</label>
                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Check-out Date</label>
                        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="primary" disabled={loading}>Update Dates</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBookingModal;
