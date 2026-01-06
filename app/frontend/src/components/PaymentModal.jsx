import { useState } from 'react';
import api from '../services/api';

const PaymentModal = ({ booking, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [method, setMethod] = useState('Credit Card');

    const handlePayment = async () => {
        setLoading(true);
        try {
            await api.post('/payments/', {
                booking_id: booking.booking_id,
                amount: booking.total_amount,
                method,
                type: 'Booking Payment'
            });
            onSuccess();
        } catch (err) {
            alert('Payment failed');
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
                <h3>Complete Payment</h3>
                <p>Total Amount: <strong>${booking.total_amount}</strong></p>
                <div className="form-group">
                    <label>Select Payment Method</label>
                    <select value={method} onChange={(e) => setMethod(e.target.value)}>
                        <option>Credit Card</option>
                        <option>PayPal</option>
                        <option>Bank Transfer</option>
                    </select>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.9em' }}>
                    This is a demo payment. No real charges will be made.
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="primary" onClick={handlePayment} disabled={loading}>
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
