import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CityDetail from './pages/CityDetail';

function App() {
  return (
    <BrowserRouter>
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