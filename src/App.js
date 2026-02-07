import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CityDetail from './pages/CityDetail';

function App() {
  return (
    /* Am trecut la HashRouter pentru a permite Refresh-ul paginii pe GitHub Pages fără eroare 404 */
    <HashRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/city/:cityName" element={<CityDetail />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;