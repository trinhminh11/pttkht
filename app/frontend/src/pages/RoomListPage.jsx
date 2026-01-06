import { useState, useEffect } from 'react';
import api from '../services/api';
import RoomCard from '../components/RoomCard';

const RoomListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms/');
      setRooms(response.data);
    } catch (err) {
      setError('Failed to load rooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error-msg">{error}</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Available Rooms</h2>
         {/* Filter components could go here */}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {rooms.map((room) => (
          <RoomCard key={room.room_id} room={room} />
        ))}
      </div>

      {rooms.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>No rooms found.</p>
      )}
    </div>
  );
};

export default RoomListPage;
