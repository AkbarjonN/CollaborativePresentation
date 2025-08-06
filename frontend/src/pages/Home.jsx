import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!nickname) return;
    const id = uuidv4();
    localStorage.setItem('nickname', nickname);
    navigate(`/presentation/${id}?role=creator`);
  };

  const handleJoin = () => {
    if (!nickname) return;
    const id = prompt('Enter presentation ID:');
    if (id) {
      localStorage.setItem('nickname', nickname);
      navigate(`/presentation/${id}?role=viewer`);
    }
  };

  return (
    <div className="container text-center mt-5 w-25">
      <h1>Collaborative Presentation</h1>
      <input
        className="form-control my-3"
        placeholder="NickName"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button className="btn btn-primary me-2" onClick={handleCreate}>
        Create Presentation
      </button>
      <button className="btn btn-secondary" onClick={handleJoin}>
        Join Presentation
      </button>
    </div>
  );
}