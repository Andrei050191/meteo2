import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CityDetail from './pages/CityDetail';

function App() {
  return (
    /* Am adăugat basename pentru ca paginile să se încarce corect pe GitHub Pages */
    <BrowserRouter basename="/meteo2">
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/city/:cityName" element={<CityDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;