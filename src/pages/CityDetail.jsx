import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Wind, Droplets, Thermometer, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CityDetail = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // Ziua curentă selectată
  const API_KEY = "4d2631c6c6c4dffc5b233b2636f0ec33";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}&lang=ro`);
        const data = await res.json();
        setWeather(data);
      } catch (err) { console.error(err); }
    };
    fetchWeather();
  }, [cityName]);

  if (!weather) return <div className="p-10 text-white text-center">Se încarcă...</div>;

  // Grupăm datele pe zile (OpenWeather dă segmente de 3 ore)
  const daysData = [];
  for (let i = 0; i < weather.list.length; i += 8) {
    daysData.push(weather.list.slice(i, i + 8));
  }

  const currentDay = daysData[selectedDayIndex] || daysData[0];
  const mainInfo = currentDay[0];

  // Pregătim datele pentru graficul zilei selectate
  const chartData = currentDay.map(item => ({
    ora: new Date(item.dt * 1000).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp)
  }));

  return (
    <div className="max-w-md md:max-w-6xl mx-auto p-4 min-h-screen text-white">
      <button onClick={() => navigate('/')} className="flex items-center gap-1 mb-6 text-blue-200 hover:text-white transition-all">
        <ChevronLeft size={24} /> <span className="font-bold">Înapoi la Favorite</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Cardul principal - Reflectă ziua selectată */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-8 rounded-[2.5rem] shadow-2xl text-center border border-white/20 h-full flex flex-col justify-center transition-all duration-500">
          <h2 className="text-5xl font-black capitalize mb-2">{weather.city.name}</h2>
          <p className="text-blue-100 font-bold mb-1 opacity-80 uppercase tracking-widest text-sm">
            {new Date(mainInfo.dt * 1000).toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <p className="text-blue-200 italic mb-6">{mainInfo.weather[0].description}</p>
          
          <div className="flex items-center justify-center mb-6">
            <span className="text-8xl font-black tracking-tighter">{Math.round(mainInfo.main.temp)}°</span>
            <img src={`http://openweathermap.org/img/wn/${mainInfo.weather[0].icon}@4x.png`} className="w-32" alt="w" />
          </div>

          <div className="grid grid-cols-3 bg-black/30 rounded-3xl p-6 backdrop-blur-md border border-white/10">
            <div className="flex flex-col items-center border-r border-white/10"><Thermometer size={20} className="text-orange-300 mb-1"/><span className="font-bold">{Math.round(mainInfo.main.feels_like)}°</span><span className="text-[10px] opacity-50">Senzație</span></div>
            <div className="flex flex-col items-center border-r border-white/10"><Droplets size={20} className="text-blue-300 mb-1"/><span className="font-bold">{mainInfo.main.humidity}%</span><span className="text-[10px] opacity-50">Umiditate</span></div>
            <div className="flex flex-col items-center"><Wind size={20} className="text-emerald-300 mb-1"/><span className="font-bold">{mainInfo.wind.speed}</span><span className="text-[10px] opacity-50">Vânt</span></div>
          </div>
        </div>

        {/* Graficul - Se schimbă la click pe zi */}
        <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 shadow-xl flex flex-col justify-center">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-blue-300 justify-center md:justify-start">
            <Calendar size={20}/> Evoluție termică: {new Date(mainInfo.dt * 1000).toLocaleDateString('ro-RO', {weekday: 'short'})}
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="ora" stroke="#94a3b880" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px', color: '#fff'}}
                  itemStyle={{color: '#60a5fa', fontWeight: 'bold'}}
                />
                <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={5} dot={{r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lista de zile - Acum devine interactivă */}
      <h3 className="font-bold text-xl px-2 mb-6 text-blue-300">Prognoză pe zile (Apasă pentru detalii)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {daysData.map((day, i) => (
          <button 
            key={i} 
            onClick={() => setSelectedDayIndex(i)}
            className={`p-5 rounded-[2rem] flex flex-col items-center gap-2 transition-all border ${
              selectedDayIndex === i 
              ? "bg-blue-600 border-blue-400 shadow-lg scale-105 shadow-blue-900/40" 
              : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <span className="font-bold text-xs uppercase opacity-70">
              {new Date(day[0].dt * 1000).toLocaleDateString('ro-RO', {weekday: 'short'})}
            </span>
            <img src={`http://openweathermap.org/img/wn/${day[0].weather[0].icon}.png`} className="w-12 h-12" alt="w" />
            <div className="font-black text-2xl">{Math.round(day[0].main.temp)}°</div>
            <span className="text-[10px] opacity-40">{new Date(day[0].dt * 1000).toLocaleDateString('ro-RO', {day: 'numeric', month: 'short'})}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CityDetail;