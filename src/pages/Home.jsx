import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom'; // Am adăugat useNavigate
import { Search, MapPin, Trash2, CloudSun, Navigation } from 'lucide-react';

const Home = () => {
  const [cityName, setCityName] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const navigate = useNavigate();

  const API_KEY = "4d2631c6c6c4dffc5b233b2636f0ec33"; // Asigură-te că e aceeași cheie

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bună dimineața ☕";
    if (hour < 18) return "Bună ziua ☀️";
    return "Bună seara ✨";
  };

  // FUNCȚIA DE DETECTARE LOCAȚIE
  const handleLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          const data = await res.json();
          if (data.name) {
            navigate(`/city/${data.name}`);
          }
        } catch (error) {
          alert("Nu am putut prelua orașul pentru coordonatele tale.");
        }
        setLoadingLocation(false);
      }, () => {
        alert("Accesul la locație a fost refuzat.");
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
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <header className="text-center my-12">
        <p className="text-blue-400 font-bold text-sm tracking-[0.2em] mb-2 animate-pulse">{getGreeting()}</p>
        <div className="inline-block p-3 bg-blue-500/10 rounded-2xl mb-4">
          <CloudSun size={40} className="text-blue-400" />
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white">Weather<span className="text-blue-500">OS</span></h1>
      </header>
      
      <div className="flex gap-2 mb-12">
        <form onSubmit={handleAddCity} className="relative flex-1 group">
          <input 
            type="text" 
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="Caută un oraș..." 
            className="w-full bg-slate-800/50 backdrop-blur-md border border-slate-700 p-5 pl-14 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none text-white text-lg"
          />
          <Search className="absolute left-5 top-5 text-slate-500 group-focus-within:text-blue-400" />
          <button className="absolute right-3 top-3 bg-blue-600 px-6 py-2.5 rounded-xl hover:bg-blue-500 font-bold text-white shadow-lg">
            Adaugă
          </button>
        </form>

        {/* BUTONUL DE LOCAȚIE */}
        <button 
          onClick={handleLocation}
          className="bg-slate-700/50 hover:bg-slate-700 p-5 rounded-2xl text-blue-400 transition-all active:scale-95 border border-slate-600"
          title="Vremea în locația mea"
        >
          <Navigation size={24} className={loadingLocation ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favorites.map((city, index) => (
          <div key={city.id} className="group bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 p-6 rounded-3xl flex justify-between items-center hover:border-blue-500/50 transition-all duration-300 active:scale-[0.98]">
            <Link to={`/city/${city.name}`} className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20">
                <MapPin className="text-blue-400" />
              </div>
              <span className="text-xl font-bold capitalize text-white">{city.name}</span>
            </Link>
            <button 
              onClick={(e) => { e.preventDefault(); deleteDoc(doc(db, "favorites", city.id)); }} 
              className="p-3 text-slate-500 hover:text-red-400 active:scale-125 transition-all md:opacity-0 md:group-hover:opacity-100"
            >
              <Trash2 size={22} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;