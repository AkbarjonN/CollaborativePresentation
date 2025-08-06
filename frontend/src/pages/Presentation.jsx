import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import SlideList from '../components/SlideList';
import SlideEditor from '../components/SlideEditor';
import UsersList from '../components/UsersList';
import { initSocket } from '../socket';

export default function Presentation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const roleFromURL = searchParams.get('role') || 'viewer';

  const nickname = localStorage.getItem('nickname') || 'Anonymous';
  const [role, setRole] = useState(roleFromURL);
  const [socket, setSocket] = useState(null);
  const [slides, setSlides] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const socketInstance = initSocket();
    setSocket(socketInstance);

    socketInstance.emit('join-presentation', {
      presentationId: id,
      nickname,
      role: roleFromURL,
    });

    socketInstance.on('presentation-data', (data) => {
      setSlides(data.slides);
      setUsers(data.users);
      setRole(data.myRole);
    });

    socketInstance.on('slides-updated', setSlides);
    socketInstance.on('users-updated', setUsers);
    socketInstance.on('role-updated', (newRole) => {
      setRole(newRole);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [id]);

  return (
    <div className="d-flex flex-column vh-100">
      <TopBar socket={socket} role={role} />
      <div className="d-flex flex-grow-1">
        <SlideList
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          setCurrentSlideIndex={setCurrentSlideIndex}
          socket={socket}
          role={role}
        />
        <div className="flex-grow-1 bg-light overflow-auto">
          {slides[currentSlideIndex] && (
            <SlideEditor
              slide={slides[currentSlideIndex]}
              slideIndex={currentSlideIndex}
              socket={socket}
              role={role}
            />
          )}
        </div>
        <UsersList
          users={users}
          socket={socket}
          myRole={role}
        />
      </div>
    </div>
  );
}