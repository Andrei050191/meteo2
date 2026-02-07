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
    <div className="max-w-md mx-auto p-4 min-h-screen animate-fade text-white"> 
      {/* text-white aici asigură că tot textul din pagină devine alb implicit */}
      
      <button onClick={() => navigate('/')} className="flex items-center gap-1 mb-6 text-blue-200 hover:text-white transition-all">
        <ChevronLeft size={24} /> <span className="font-bold">Înapoi</span>
      </button>

      {/* Card Principal */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-8 rounded-[2.5rem] shadow-2xl text-center mb-8 border border-white/20">
        <h2 className="text-4xl font-black capitalize mb-1 text-white">{current.name}</h2>
        <p className="text-blue-100 uppercase tracking-widest text-[10px] font-bold mb-6 opacity-80">
          {current.weather[0].description}
        </p>
        
        <div className="flex items-center justify-center mb-6">
          <span className="text-8xl font-black tracking-tighter text-white">{Math.round(current.main.temp)}°</span>
          <img src={`http://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`} className="w-28 h-28" alt="weather" />
        </div>

        <div className="grid grid-cols-3 bg-black/30 rounded-3xl p-4 backdrop-blur-md border border-white/10">
          <div className="flex flex-col items-center border-r border-white/10 text-white">
            <Thermometer size={18} className="text-orange-300 mb-1"/>
            <span className="font-bold">{Math.round(current.main.feels_like)}°</span>
            <span className="text-[10px] opacity-60">RealFeel</span>
          </div>
          <div className="flex flex-col items-center border-r border-white/10 text-white">
            <Droplets size={18} className="text-blue-300 mb-1"/>
            <span className="font-bold">{current.main.humidity}%</span>
            <span className="text-[10px] opacity-60">Umiditate</span>
          </div>
          <div className="flex flex-col items-center text-white">
            <Wind size={18} className="text-emerald-300 mb-1"/>
            <span className="font-bold">{current.wind.speed}</span>
            <span className="text-[10px] opacity-60">m/s</span>
          </div>
        </div>
      </div>

      {/* Listă Prognoză */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2 font-bold text-lg px-2 mb-4 text-white">
          <Calendar size={18} className="text-blue-300"/> Următoarele zile
        </h3>
        
        {forecast.map((day, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center justify-between text-white">
            <div className="w-32">
              <span className="font-bold text-sm uppercase text-blue-200">
                {new Date(day.dt * 1000).toLocaleDateString('ro-RO', {weekday: 'long'})}
              </span>
              <p className="text-[10px] opacity-60 capitalize">
                {new Date(day.dt * 1000).toLocaleDateString('ro-RO', {day: 'numeric', month: 'long'})}
              </p>
            </div>
            
            <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} className="w-10 h-10" alt="w" />
            
            <div className="flex gap-3 font-bold text-lg">
              <span className="text-white">{Math.round(day.main.temp_max)}°</span>
              <span className="text-white/40">{Math.round(day.main.temp_min)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityDetail;