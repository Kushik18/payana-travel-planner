/* ================================================================
   WeatherWidget.jsx — 5-day Karnataka Weather Forecast
================================================================ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './AllCss/WeatherWidget.css';

const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '⛅',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

const BG_COLORS = {
  Sunny: 'rgba(251,191,36,.08)',
  Clear: 'rgba(251,191,36,.08)',
  'Partly Cloudy': 'rgba(148,163,184,.08)',
  Cloudy: 'rgba(100,116,139,.08)',
  Misty: 'rgba(100,116,139,.08)',
  'Rain Expected': 'rgba(59,130,246,.1)',
  Thunderstorm: 'rgba(139,92,246,.1)',
};

const KARNATAKA_CITIES = [
  'Mysuru','Bengaluru','Mangaluru','Hubballi','Belagavi','Shivamogga',
  'Chikmagalur','Udupi','Hassan','Madikeri','Hampi','Gokarna',
];

function DayCard({ day, index }) {
  const weather = day.weather?.[0] || {};
  const temp    = Math.round(day.main?.temp || 0);
  const hum     = day.main?.humidity || 0;
  const desc    = weather.description || 'Clear';
  const icon    = WEATHER_ICONS[weather.icon] || '🌤️';
  const dateStr = day.dt_txt ? new Date(day.dt_txt).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) : `Day ${index + 1}`;
  const bg      = BG_COLORS[desc] || 'rgba(255,255,255,.04)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        background: bg,
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 16,
        padding: '1.2rem 1rem',
        textAlign: 'center',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ fontSize: '.72rem', color: '#64748b', marginBottom: '.4rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{dateStr}</div>
      <div style={{ fontSize: '2.5rem', margin: '.3rem 0' }}>{icon}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-.02em' }}>{temp}°C</div>
      <div style={{ fontSize: '.78rem', color: '#94a3b8', marginTop: '.25rem', textTransform: 'capitalize' }}>{desc}</div>
      <div style={{ marginTop: '.6rem', display: 'flex', justifyContent: 'center', gap: '.5rem' }}>
        <span style={{ fontSize: '.72rem', color: '#63b3ed', background: 'rgba(99,179,237,.1)', padding: '2px 8px', borderRadius: 999 }}>💧 {hum}%</span>
      </div>
    </motion.div>
  );
}

export default function WeatherWidget() {
  const navigate = useNavigate();
  const [city, setCity]     = useState('');
  const [days, setDays]     = useState(5);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [isMock, setIsMock] = useState(false);

  const getOpenMeteoIcon = (code) => {
    if (code === 0) return '01d';
    if (code === 1) return '02d';
    if (code === 2) return '03d';
    if (code === 3) return '04d';
    if (code === 45 || code === 48) return '50d';
    if (code >= 51 && code <= 55) return '09d';
    if (code >= 61 && code <= 65) return '10d';
    if (code >= 71 && code <= 77) return '13d';
    if (code >= 80 && code <= 82) return '09d';
    if (code >= 95 && code <= 99) return '11d';
    return '01d';
  };

  const getOpenMeteoDesc = (code) => {
    if (code === 0) return 'Clear';
    if (code === 1 || code === 2) return 'Partly Cloudy';
    if (code === 3) return 'Cloudy';
    if (code === 45 || code === 48) return 'Misty';
    if (code >= 51 && code <= 65) return 'Rain Expected';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain Expected';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Clear';
  };

  const fetchWeather = async (cityName) => {
    const target = cityName || city;
    if (!target) return;
    setLoading(true); setError(''); setForecast(null);
    try {
      // 1. Geocoding
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(target)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();
      
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found');
      }
      
      const { latitude, longitude } = geoData.results[0];
      
      // 2. Weather Forecast
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
      const weatherData = await weatherRes.json();
      
      const daily = weatherData.daily;
      if (!daily || !daily.time) throw new Error('Invalid weather data');
      
      const parsedList = daily.time.map((timeStr, i) => {
        const code = daily.weather_code[i];
        const maxT = daily.temperature_2m_max[i];
        const minT = daily.temperature_2m_min[i];
        const avgTemp = (maxT + minT) / 2;
        
        return {
          dt_txt: timeStr,
          main: { temp: avgTemp },
          weather: [{
            icon: getOpenMeteoIcon(code),
            description: getOpenMeteoDesc(code)
          }]
        };
      });
      
      setForecast(parsedList);
      setIsMock(false);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch weather from OpenMeteo for this city.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    wrap: { position: 'relative', minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(160deg,#0a0f1e 0%,#0d1a2e 55%,#0a0f1e 100%)', fontFamily: "'Inter',sans-serif", color: '#e2e8f0', padding: '2rem 1.5rem 4rem' },
    header: { textAlign: 'center', marginBottom: '2.5rem' },
    eyebrow: { fontSize: '.75rem', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: '#fbbf24', marginBottom: '.5rem' },
    title: { fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-.03em', margin: '0 0 .5rem' },
    inputRow: { display: 'flex', gap: '.75rem', maxWidth: 560, margin: '0 auto 2rem', flexWrap: 'wrap' },
    input: { flex: 1, minWidth: 180, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '.75rem 1rem', color: '#e2e8f0', fontFamily: "'Inter',sans-serif", fontSize: '.9rem', outline: 'none' },
    select: { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '.75rem 1rem', color: '#e2e8f0', fontFamily: "'Inter',sans-serif", fontSize: '.9rem', outline: 'none' },
    btn: { background: 'linear-gradient(135deg,#92400e,#fbbf24)', border: 'none', borderRadius: 12, padding: '.75rem 1.5rem', color: '#0a0f1e', fontWeight: 700, fontFamily: "'Inter',sans-serif", cursor: 'pointer', fontSize: '.9rem' },
    chips: { display: 'flex', flexWrap: 'wrap', gap: '.4rem', justifyContent: 'center', marginBottom: '1.5rem' },
    chip: { background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 999, padding: '.3rem .8rem', fontSize: '.78rem', color: '#94a3b8', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem', maxWidth: 1100, margin: '0 auto' },
    mockBanner: { textAlign: 'center', fontSize: '.78rem', color: '#64748b', marginBottom: '1rem' },
  };

  return (
    <div className="ww">
      <div className="ww__column">
      <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', zIndex: 10 }}>← Back</button>
      <div style={styles.header}>
        <div style={styles.eyebrow}>⛅ Live Forecast</div>
        <h1 style={styles.title}>Weather <span style={{ color: '#fbbf24' }}>Forecast</span></h1>
        <p style={{ color: '#64748b', maxWidth: 500, margin: '0 auto .5rem', fontSize: '.9rem' }}>
          Check the weather for any Karnataka destination before you pack your bags.
        </p>
      </div>

      {/* Quick city chips */}
      <div style={styles.chips}>
        {KARNATAKA_CITIES.map(c => (
          <span key={c} style={styles.chip} onClick={() => { setCity(c); fetchWeather(c); }}>{c}</span>
        ))}
      </div>

      {/* Input Row */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="Enter city (e.g. Coorg, Hampi…)"
          value={city}
          onChange={e => setCity(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchWeather()}
          list="karnataka-cities-ww"
        />
        <datalist id="karnataka-cities-ww">
          {KARNATAKA_CITIES.map(c => <option key={c} value={c} />)}
        </datalist>
        <select style={styles.select} value={days} onChange={e => setDays(Number(e.target.value))}>
          {[3,5,7].map(d => <option key={d} value={d}>{d} days</option>)}
        </select>
        <button style={styles.btn} onClick={() => fetchWeather()} disabled={!city || loading}>
          {loading ? '⏳' : '🔍 Check'}
        </button>
      </div>

      {/* Error */}
      {error && <p style={{ textAlign: 'center', color: '#f87171', marginBottom: '1rem' }}>{error}</p>}

      {/* Mock banner */}
      {forecast && isMock && (
        <p style={styles.mockBanner}>📌 Showing sample forecast.</p>
      )}

      {/* Forecast grid */}
      <AnimatePresence>
        {forecast && (
          <motion.div style={styles.grid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {forecast.slice(0, days).map((day, i) => (
              <DayCard key={i} day={day} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {!forecast && !loading && (
        <div style={{ textAlign: 'center', color: '#475569', marginTop: '3rem', fontSize: '.9rem' }}>
          Click a city above or type a destination to see its weather forecast ☝️
        </div>
      )}
      </div>
    </div>
  );
}
