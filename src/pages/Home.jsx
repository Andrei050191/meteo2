import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Search, MapPin, Trash2, CloudSun } from 'lucide-react';

const Home = () => {
  const [cityName, setCityName] = useState('');
  const [favorites, setFavorites] = useState([]);

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
        <div className="inline-block p-3 bg-blue-500/10 rounded-2xl mb-4">
          <CloudSun size={40} className="text-blue-400" />
        </div>
        <h1 className="text-5xl font-black tracking-tight text-white">Weather<span className="text-blue-500">OS</span></h1>
        <p className="text-slate-400 mt-2 font-medium">Prognoza ta meteo, salvată în Cloud</p>
      </header>
      
      <form onSubmit={handleAddCity} className="relative mb-12 group">
        <input 
          type="text" 
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="Caută un oraș (ex: Chisinau)..." 
          className="w-full bg-slate-800/50 backdrop-blur-md border border-slate-700 p-5 pl-14 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-lg"
        />
        <Search className="absolute left-5 top-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
        <button className="absolute right-3 top-3 bg-blue-600 px-8 py-2.5 rounded-xl hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all font-bold">
          Adaugă
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favorites.map((city, index) => (
          <div 
            key={city.id} 
            className="group bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 p-6 rounded-3xl flex justify-between items-center hover:border-blue-500/50 hover:bg-slate-800/60 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Link to={`/city/${city.name}`} className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                <MapPin className="text-blue-400" />
              </div>
              <span className="text-xl font-bold capitalize tracking-tight">{city.name}</span>
            </Link>
            <button 
              onClick={() => deleteDoc(doc(db, "favorites", city.id))} 
              className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;