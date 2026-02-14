import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Trash2, CloudSun, Navigation } from 'lucide-react';

const Home = () => {
  const [cityName, setCityName] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();

  const API_KEY = "4d2631c6c6c4dffc5b233b2636f0ec33";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bună dimineața ☕";
    if (hour < 18) return "Bună ziua ☀️";
    return "Bună seara ✨";
  };

  const handleLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
          const data = await res.json();
          if (data.name) navigate(`/city/${data.name}`);
        } catch (error) { alert("Eroare la detectarea locației."); }
        setLoadingLocation(false);
      }, () => {
        alert("Locație refuzată.");
        setLoadingLocation(false);
      });
    }
  };

  useEffect(() => {
    const q = query(collection(db, "favorites"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFavorites(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!cityName.trim()) return;
    await addDoc(collection(db, "favorites"), { name: cityName, createdAt: new Date() });
    setCityName('');
  };

  return (
    // Am mărit max-width la 7xl pentru ecrane de PC
    <div className="max-w-7xl mx-auto p-6 min-h-screen animate-fade-in text-white">
      
      {/* Layout adaptiv: pe PC avem 2 coloane, pe mobil 1 singură */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-10">
        
        {/* Coloana Stângă: Căutare și Branding (4 din 12 coloane pe PC) */}
        <div className="lg:col-span-5 lg:sticky lg:top-10 text-center lg:text-left">
          <header className="mb-10">
            <p className="text-blue-400 font-bold text-sm tracking-[0.3em] mb-3 animate-pulse uppercase">
              {getGreeting()}
            </p>
            <div className="inline-block lg:flex items-center gap-4 p-3 bg-blue-500/10 rounded-3xl mb-6">
              <CloudSun size={48} className="text-blue-400 mx-auto" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter mb-4">
              Weather<span className="text-blue-500">OS</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-md mx-auto lg:mx-0">
              Gestionează orașele favorite și monitorizează prognoza globală în timp real.
            </p>
          </header>
          
          <div className="flex gap-3 mb-8">
            <form onSubmit={handleAddCity} className="relative flex-1 group">
              <input 
                type="text" 
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="Caută un oraș..." 
                className="w-full bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-5 pl-14 rounded-[2rem] focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white shadow-2xl"
              />
              <Search className="absolute left-6 top-5.5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <button className="absolute right-3 top-2.5 bg-blue-600 px-6 py-3 rounded-2xl hover:bg-blue-500 active:scale-95 transition-all font-black shadow-lg">
                +
              </button>
            </form>

            <button 
              onClick={handleLocation}
              className="bg-slate-800/40 hover:bg-slate-700 p-5 rounded-[2rem] text-blue-400 transition-all active:scale-95 border border-slate-700/50 shadow-2xl"
            >
              <Navigation size={24} className={loadingLocation ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Coloana Dreaptă: Lista de Favorite (7 din 12 coloane pe PC) */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-2xl font-black tracking-tight">Orașe Salvate</h3>
            <span className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {favorites.length} Locații
            </span>
          </div>

          {/* Grid pentru carduri: pe PC se pun pe 2 coloane */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map((city, index) => (
              <div 
                key={city.id} 
                className="group bg-slate-800/20 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] flex justify-between items-center 
                           hover:bg-slate-800/60 hover:border-blue-500/40 transition-all duration-500 
                           active:scale-[0.97] animate-fade-in shadow-xl"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link to={`/city/${city.name}`} className="flex items-center gap-4 flex-1">
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl group-hover:from-blue-500/20 group-hover:to-blue-500/30 transition-all">
                    <MapPin className="text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-xl font-bold capitalize tracking-tight group-hover:translate-x-1 transition-transform">{city.name}</span>
                </Link>
                
                <button 
                  onClick={(e) => { e.preventDefault(); deleteDoc(doc(db, "favorites", city.id)); }} 
                  className="p-3 text-slate-600 hover:text-red-400 active:scale-125 transition-all 
                             opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            {favorites.length === 0 && (
              <div className="col-span-full border-2 border-dashed border-slate-800 rounded-[2rem] p-12 text-center text-slate-600">
                Lista ta de favorite este goală.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;