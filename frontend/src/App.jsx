import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Presentation from './pages/Presentation';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/presentation/:id" element={<Presentation />} />
    </Routes>
  );
}