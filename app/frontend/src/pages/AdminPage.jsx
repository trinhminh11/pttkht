import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('bookings');
    const [stats, setStats] = useState(null);
    const [hotel, setHotel] = useState(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user || user.role !== 'Manager') {
            navigate('/');
            return;
        }
        fetchStats();
        fetchHotel();
    }, [user, authLoading, navigate]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/stats/');
            setStats(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchHotel = async () => {
        try {
            const res = await api.get('/rooms/hotel');
            setHotel(res.data);
        } catch (err) { console.error(err); }
    };

    if (authLoading || !user) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setActiveTab('bookings')} className={activeTab === 'bookings' ? 'primary' : ''}>Bookings</button>
                    <button onClick={() => setActiveTab('rooms')} className={activeTab === 'rooms' ? 'primary' : ''}>Rooms</button>
                    <button onClick={() => setActiveTab('stats')} className={activeTab === 'stats' ? 'primary' : ''}>Analytics</button>
                    <button onClick={() => setActiveTab('hotel')} className={activeTab === 'hotel' ? 'primary' : ''}>Hotel Settings</button>
                </div>
            </div>

            {activeTab === 'bookings' && <BookingManager />}
            {activeTab === 'rooms' && <RoomManager />}
            {activeTab === 'stats' && <Analytics stats={stats} />}
            {activeTab === 'hotel' && <HotelSettings hotel={hotel} onUpdate={fetchHotel} />}
        </div>
    );
};

// --- Sub-Components ---

const BookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAllBookings(); }, []);

    const fetchAllBookings = async () => {
        try {
            const res = await api.get('/bookings/');
            setBookings(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/bookings/${id}`, { status });
            fetchAllBookings();
        } catch (err) { alert('Failed to update status'); }
    };

    if (loading) return <div>Loading bookings...</div>;

    return (
        <div className="card">
            <h3>Manage Bookings</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                        <th style={{ padding: '0.5rem' }}>ID</th>
                        <th style={{ padding: '0.5rem' }}>Customer</th>
                        <th style={{ padding: '0.5rem' }}>Room</th>
                        <th style={{ padding: '0.5rem' }}>Dates</th>
                        <th style={{ padding: '0.5rem' }}>Status</th>
                        <th style={{ padding: '0.5rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(b => (
                        <tr key={b.booking_id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                            <td style={{ padding: '0.5rem' }}>{b.booking_id.slice(0,8)}</td>
                            <td style={{ padding: '0.5rem' }}>{b.customer_name}</td>
                            <td style={{ padding: '0.5rem' }}>{b.room_type} (#{b.room_number})</td>
                            <td style={{ padding: '0.5rem' }}>{b.check_in_date} to {b.check_out_date}</td>
                            <td style={{ padding: '0.5rem' }}>
                                <span style={{
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.8em',
                                    backgroundColor: b.status === 'Confirmed' ? '#d4edda' : '#fff3cd'
                                }}>{b.status}</span>
                            </td>
                            <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                {b.status === 'Pending' && (
                                    <>
                                        <button onClick={() => updateStatus(b.booking_id, 'Confirmed')} className="primary" style={{ padding: '0.2rem 0.5rem' }}>Confirm</button>
                                        <button onClick={() => updateStatus(b.booking_id, 'Cancelled')} style={{ padding: '0.2rem 0.5rem', background: '#dc3545', color: 'white' }}>Reject</button>
                                    </>
                                )}
                                {b.status === 'Confirmed' && (
                                    <button onClick={() => updateStatus(b.booking_id, 'Checked-in')} className="primary" style={{ padding: '0.2rem 0.5rem' }}>Check-in</button>
                                )}
                                {b.status === 'Checked-in' && (
                                    <button onClick={() => updateStatus(b.booking_id, 'Completed')} className="primary" style={{ padding: '0.2rem 0.5rem' }}>Check-out</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const RoomManager = () => {
    const [rooms, setRooms] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);

    useEffect(() => { fetchRooms(); }, []);

    const fetchRooms = async () => {
        try {
            const res = await api.get('/rooms/');
            setRooms(res.data);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this room?')) {
            await api.delete(`/rooms/${id}`);
            fetchRooms();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Room Inventory</h3>
                <button className="primary" onClick={() => setShowAdd(true)}>+ Add Room</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {rooms.map(r => (
                    <div key={r.room_id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4>Room {r.room_number} ({r.type})</h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => setEditingRoom(r)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.8em' }}>Edit</button>
                                <button onClick={() => handleDelete(r.room_id)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.8em', color: 'red' }}>Del</button>
                            </div>
                        </div>
                        <p style={{ margin: '0.5rem 0' }}>Price: ${r.price}/night</p>
                        <p style={{ fontSize: '0.9em', color: '#666' }}>Status: {r.status}</p>
                    </div>
                ))}
            </div>

            {(showAdd || editingRoom) && (
                <RoomForm
                    room={editingRoom}
                    onClose={() => { setShowAdd(false); setEditingRoom(null); }}
                    onSuccess={() => { setShowAdd(false); setEditingRoom(null); fetchRooms(); }}
                />
            )}
        </div>
    );
};

const RoomForm = ({ room, onClose, onSuccess }) => {
    const [formData, setFormData] = useState(room || {
        room_number: '',
        type: 'Single',
        price: 100,
        capacity: 2,
        status: 'Available',
        description: '',
        hotel_id: '00000000-0000-0000-0000-000000000001' // Assumed default hotel id
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (room) {
                await api.patch(`/rooms/${room.room_id}`, formData);
            } else {
                await api.post('/rooms/', formData);
            }
            onSuccess();
        } catch (err) { alert('Failed to save room'); }
    };

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
                <h3>{room ? 'Edit Room' : 'Add New Room'}</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Room Number</label>
                            <input value={formData.room_number} onChange={e => setFormData({...formData, room_number: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                <option>Single</option>
                                <option>Double</option>
                                <option>Suite</option>
                                <option>Deluxe</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Price</label>
                            <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                        </div>
                        <div className="form-group">
                            <label>Capacity</label>
                            <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3"></textarea>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="primary">Save Room</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const HotelSettings = ({ hotel, onUpdate }) => {
    const [formData, setFormData] = useState(hotel);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/rooms/hotel/${hotel.hotel_id}`, formData);
            onUpdate();
            alert('Hotel info updated');
        } catch (err) { alert('Update failed'); }
    };

    if (!hotel) return <div>Loading hotel...</div>;

    return (
        <div className="card" style={{ maxWidth: '600px' }}>
            <h3>Hotel Information</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Hotel Name</label>
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Address</label>
                    <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Contact Email</label>
                    <input value={formData.contact_email} onChange={e => setFormData({...formData, contact_email: e.target.value})} />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="4" />
                </div>
                <button type="submit" className="primary">Update Hotel Info</button>
            </form>
        </div>
    );
};


const Analytics = ({ stats }) => {
    if (!stats) return <div>Loading statistics...</div>;

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#666', margin: 0 }}>Average Rating</p>
                    <div style={{ color: '#ffc107', fontSize: '1.5em', margin: '0.5rem 0' }}>
                        {'★'.repeat(Math.round(stats.reviews.average))}{'☆'.repeat(5 - Math.round(stats.reviews.average))}
                    </div>
                    <h2 style={{ fontSize: '2em', margin: '0', color: 'var(--primary-color)' }}>{stats.reviews.average}</h2>
                    <p style={{ fontSize: '0.9em', color: '#666' }}>from {stats.reviews.total} reviews</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#666', margin: 0 }}>Daily Active Users (DAU)</p>
                    <h2 style={{ fontSize: '2.5em', margin: '0.5rem 0' }}>{stats.engagement.dau}</h2>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#666', margin: 0 }}>Monthly Active Users (MAU)</p>
                    <h2 style={{ fontSize: '2.5em', margin: '0.5rem 0' }}>{stats.engagement.mau}</h2>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <p style={{ color: '#666', margin: 0 }}>Stickiness (DAU/MAU)</p>
                    <h2 style={{ fontSize: '2.5em', margin: '0.5rem 0', color: 'var(--primary-color)' }}>{stats.engagement.stickiness}%</h2>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', height: '400px' }}>
                <h3>User Engagement Trends (30 Days)</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <LineChart data={stats.timeline}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ borderRadius: 'var(--radius)', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="top" align="right" height={36} />
                        <Line type="monotone" dataKey="dau" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4 }} name="Daily Active (DAU)" />
                        <Line type="monotone" dataKey="mau" stroke="#999" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Monthly Active (MAU)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="card">
                <h3>Business Overview</h3>
                <div style={{ display: 'flex', gap: '3rem' }}>
                    <div>
                        <p style={{ color: '#666' }}>Total Registered Users</p>
                        <h3>{stats.business.total_users}</h3>
                    </div>
                    <div>
                        <p style={{ color: '#666' }}>Total Bookings Created</p>
                        <h3>{stats.business.total_bookings}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
