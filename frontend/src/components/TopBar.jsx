import { useNavigate } from 'react-router-dom';

export default function TopBar({ socket, role }) {
  const navigate = useNavigate();

  const handlePresent = () => {
    socket.emit('toggle-present-mode'); 
    document.documentElement.requestFullscreen?.();
  };

  const handleExit = () => {
    socket.emit('leave-presentation');
    navigate('/');
  };

  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-2 bg-primary text-white shadow-sm">
      <h4 className="m-0">📊 CollabSlides</h4>
      <div>
        {role !== 'viewer' && (
          <button
            className="btn btn-light me-2"
            onClick={handlePresent}
          >
            Present Mode
          </button>
        )}
        <button className="btn btn-outline-light" onClick={handleExit}>
          Exit
        </button>
      </div>
    </div>
  );
}