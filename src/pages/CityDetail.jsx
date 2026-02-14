import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Wind, Droplets, Thermometer, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CityDetail = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
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

  const current = weather.list[0];
  
  // Pregătim datele pentru grafic (luăm temperaturile pentru prognoză)
  const chartData = weather.list.slice(0, 8).map(item => ({
    ora: new Date(item.dt * 1000).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp)
  }));

  return (
    // md:max-w-6xl face ca pe PC să fie lat, iar max-w-md îl ține îngust pe telefon
    <div className="max-w-md md:max-w-6xl mx-auto p-4 min-h-screen text-white transition-all">
      <button onClick={() => navigate('/')} className="flex items-center gap-1 mb-6 text-blue-200 hover:text-white transition-all">
        <ChevronLeft size={24} /> <span className="font-bold">Înapoi la Favorite</span>
      </button>

      {/* Layout Grid: Pe PC se pun pe 2 coloane, pe Mobil una sub alta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* Coloana 1: Cardul principal */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-8 rounded-[2.5rem] shadow-2xl text-center border border-white/20 h-full flex flex-col justify-center">
          <h2 className="text-5xl font-black capitalize mb-2">{weather.city.name}</h2>
          <p className="text-blue-100 uppercase tracking-widest font-bold mb-6 opacity-80">{current.weather[0].description}</p>
          <div className="flex items-center justify-center mb-6">
            <span className="text-8xl font-black tracking-tighter">{Math.round(current.main.temp)}°</span>
            <img src={`http://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`} className="w-32" alt="w" />
          </div>
          <div className="grid grid-cols-3 bg-black/30 rounded-3xl p-6 backdrop-blur-md border border-white/10">
            <div className="flex flex-col items-center border-r border-white/10"><Thermometer className="text-orange-300 mb-1"/><span className="font-bold">{Math.round(current.main.feels_like)}°</span></div>
            <div className="flex flex-col items-center border-r border-white/10"><Droplets className="text-blue-300 mb-1"/><span className="font-bold">{current.main.humidity}%</span></div>
            <div className="flex flex-col items-center"><Wind className="text-emerald-300 mb-1"/><span className="font-bold">{current.wind.speed}</span></div>
          </div>
        </div>

        {/* Coloana 2: Graficul (Vizibil bine pe PC) */}
        <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 shadow-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-300">
            <Calendar size={20}/> Evoluție Temperatură (Următoarele ore)
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="ora" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff'}}
                  itemStyle={{color: '#60a5fa'}}
                />
                <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={4} dot={{r: 6, fill: '#3b82f6'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lista de jos: Pe PC o punem pe 2 coloane ca să ocupe tot ecranul */}
      <h3 className="font-bold text-xl px-2 mb-6 text-blue-300">Prognoză următoarele zile</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weather.list.filter((_, i) => i % 8 === 0).map((day, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-all">
            <div className="w-32 text-left">
              <span className="font-bold text-sm uppercase text-blue-200">{new Date(day.dt * 1000).toLocaleDateString('ro-RO', {weekday: 'long'})}</span>
              <p className="text-[10px] opacity-50">{new Date(day.dt * 1000).toLocaleDateString('ro-RO', {day: 'numeric', month: 'long'})}</p>
            </div>
            <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} className="w-12" alt="w" />
            <div className="font-black text-xl">{Math.round(day.main.temp)}°</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityDetail;