import { useNavigate } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div className="card room-card"
      onClick={() => navigate(`/rooms/${room.room_id}`)}
      style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid transparent' }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div className="room-image" style={{ height: '200px', backgroundColor: '#eee', borderRadius: '4px', marginBottom: '1rem', overflow: 'hidden' }}>
        {room.images && room.images.length > 0 ? (
          <img src={room.images[0]} alt={room.room_number} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa' }}>
            No Image
          </div>
        )}
      </div>

      <h3>{room.type} - {room.room_number}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ color: '#ffc107', fontSize: '1.1em' }}>
          {'★'.repeat(Math.round(room.avg_rating || 0))}{'☆'.repeat(5 - Math.round(room.avg_rating || 0))}
        </span>
        <span style={{ fontSize: '0.9em', color: '#666' }}>
          ({room.avg_rating || 0}) • {room.total_reviews || 0} reviews
        </span>
      </div>
      <p style={{ color: '#666', fontSize: '0.9em', height: '3em', overflow: 'hidden' }}>{room.description || 'No description available.'}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'var(--primary-color)' }}>
          ${room.price} / night
        </span>
        <button
          className="primary"
          onClick={(e) => { e.stopPropagation(); navigate(`/rooms/${room.room_id}`); }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
