import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Wind, Droplets, Thermometer, ChevronLeft, Calendar } from 'lucide-react';

const CityDetail = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);

  const API_KEY = "4d2631c6c6c4dffc5b233b2636f0ec33"; 

  useEffect(() => {
    // 1. Vremea curentă
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`)
      .then(res => res.json())
      .then(json => setCurrent(json));

    // 2. Prognoza pe 5 zile
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`)
      .then(res => res.json())
      .then(json => {
        // Filtrăm ca să luăm doar o prognoză pe zi (ora 12:00)
        const daily = json.list.filter(reading => reading.dt_txt.includes("12:00:00"));
        setForecast(daily);
      });
  }, [cityName, API_KEY]);

  if (!current) return <div className="flex justify-center mt-20 animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>;

  return (
    <div className="max-w-md mx-auto p-4 pb-10 animate-fade-in">
      {/* Buton Înapoi - Optimizat pentru deget pe mobil */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 mb-6 p-2 hover:text-white transition-colors">
        <ChevronLeft size={24} /> <span className="font-medium">Înapoi</span>
      </button>

      {/* Card Principal - Vremea Curentă */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2rem] shadow-2xl text-center mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold capitalize">{current.name}</h2>
          <p className="opacity-80 text-sm font-bold uppercase tracking-widest">{current.weather[0].description}</p>
          
          <div className="flex items-center justify-center my-4">
            <span className="text-8xl font-black">{Math.round(current.main.temp)}°</span>
            <img 
              src={`http://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`} 
              alt="icon" className="w-32 h-32"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <div className="flex flex-col items-center">
              <Thermometer size={18} className="text-orange-300 mb-1" />
              <span className="text-xs opacity-70">Simțită</span>
              <span className="font-bold">{Math.round(current.main.feels_like)}°</span>
            </div>
            <div className="flex flex-col items-center border-x border-white/10">
              <Droplets size={18} className="text-blue-300 mb-1" />
              <span className="text-xs opacity-70">Umiditate</span>
              <span className="font-bold">{current.main.humidity}%</span>
            </div>
            <div className="flex flex-col items-center">
              <Wind size={18} className="text-emerald-300 mb-1" />
              <span className="text-xs opacity-70">Vânt</span>
              <span className="font-bold">{current.wind.speed}m/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secțiune Prognoză pe 5 Zile */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4 px-2">
          <Calendar size={20} className="text-blue-400" />
          <h3 className="font-bold text-lg">Următoarele zile</h3>
        </div>

        {forecast.map((day, index) => (
          <div key={index} className="bg-slate-800/40 backdrop-blur-sm border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-slate-800/60 transition-all">
            <div className="w-32">
              <p className="font-bold text-sm">
                {new Date(day.dt * 1000).toLocaleDateString('ro-RO', { weekday: 'long' })}
              </p>
              <p className="text-xs opacity-50 capitalize">
                {new Date(day.dt * 1000).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })}
              </p>
            </div>
            
            <img 
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
              alt="weather" className="w-12 h-12"
            />
            
            <div className="flex gap-4 w-24 justify-end">
              <span className="font-bold text-lg">{Math.round(day.main.temp_max)}°</span>
              <span className="opacity-40 text-lg">{Math.round(day.main.temp_min)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityDetail;