/* ================================================================
   RouteOptimizer.jsx — Nearest-Neighbor TSP Route Optimizer
================================================================ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './AllCss/RouteOptimizer.css';

// Preset Karnataka places with known lat/lon for quick demo
const PRESETS = [
  { name: 'Mysuru',     lat: 12.2958, lon: 76.6394, district: 'Mysuru' },
  { name: 'Coorg',      lat: 12.3375, lon: 75.8069, district: 'Kodagu' },
  { name: 'Hassan',     lat: 13.0068, lon: 76.0996, district: 'Hassan' },
  { name: 'Chikmagalur',lat: 13.3161, lon: 75.7720, district: 'Chikmagalur' },
  { name: 'Hampi',      lat: 15.3350, lon: 76.4600, district: 'Vijayanagara' },
  { name: 'Gokarna',    lat: 14.5479, lon: 74.3188, district: 'Uttara Kannada' },
  { name: 'Bengaluru',  lat: 12.9716, lon: 77.5946, district: 'Bengaluru Urban' },
  { name: 'Mangaluru',  lat: 12.9141, lon: 74.8560, district: 'Dakshina Kannada' },
  { name: 'Udupi',      lat: 13.3409, lon: 74.7421, district: 'Udupi' },
  { name: 'Hubballi',   lat: 15.3647, lon: 75.1240, district: 'Dharwad' },
];

function getPreset(name) {
  return PRESETS.find(p => p.name.toLowerCase() === name.toLowerCase()) || null;
}

export default function RouteOptimizer() {
  const navigate = useNavigate();
  const [stops, setStops]   = useState(['', '', '']);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const updateStop = (i, val) => {
    setStops(prev => prev.map((s, idx) => idx === i ? val : s));
  };

  const addStop = () => {
    if (stops.length < 10) setStops(prev => [...prev, '']);
  };

  const removeStop = (i) => {
    if (stops.length > 2) setStops(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleOptimize = async () => {
    setError('');
    const filled = stops.filter(s => s.trim());
    if (filled.length < 2) { setError('Please enter at least 2 stops.'); return; }

    const stopsData = filled.map(name => {
      const preset = getPreset(name.trim());
      if (preset) return preset;
      // If not a preset, use a default central Karnataka coord + the name
      return { name: name.trim(), lat: 13.0, lon: 76.5, district: '' };
    });

    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/api/route/optimize', stopsData);
      setResult(data);
    } catch {
      setError('Could not connect to the backend. Make sure Spring Boot is running.');
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setStops(['Mysuru', 'Hampi', 'Hassan', 'Coorg', 'Chikmagalur']);
    setResult(null);
  };

  const saved = result ? result.distanceSavedKm > 0 : false;

  return (
    <div className="ro">
      <div className="ro__column">
      <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', zIndex: 10 }}>← Back</button>
      <motion.div className="ro__header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
        <div className="ro__eyebrow">🗺️ Algorithmic Optimization</div>
        <h1 className="ro__title">Route <span>Optimizer</span></h1>
        <p className="ro__subtitle">Enter your Karnataka destinations and get the most efficient travel order — saving time, fuel, and distance.</p>
      </motion.div>

      <div className="ro__layout">
        {/* ── Input Panel ── */}
        <motion.div className="ro__card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, delay: .1 }}>
          <div className="ro__card-title">📍 Your Stops</div>

          <div className="ro__stops">
            {stops.map((stop, i) => (
              <div key={i} className="ro__stop">
                <div className="ro__stop-num">{i + 1}</div>
                <input
                  className="ro__stop-input"
                  placeholder={i === 0 ? 'Starting point (e.g. Mysuru)' : `Stop ${i + 1} (e.g. Hampi)`}
                  value={stop}
                  onChange={e => updateStop(i, e.target.value)}
                  list="karnataka-places"
                />
                {stops.length > 2 && (
                  <button className="ro__stop-del" onClick={() => removeStop(i)}>✕</button>
                )}
              </div>
            ))}
          </div>

          {/* Datalist for autocomplete */}
          <datalist id="karnataka-places">
            {['Bagalkot', 'Bangalore Rural', 'Bangalore Urban', 'Belgaum', 'Bellary', 'Bidar', 'Bijapur', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Gulbarga', 'Hassan', 'Haveri', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shimoga', 'Tumkur', 'Udupi', 'Uttara Kannada', 'Vijayanagara', 'Yadgir'].map(d => <option key={d} value={d} />)}
          </datalist>

          <button className="ro__add-btn" onClick={addStop} disabled={stops.length >= 10}>
            + Add another stop
          </button>

          {error && <div style={{ color: '#f87171', fontSize: '.82rem', marginBottom: '.75rem' }}>{error}</div>}

          <button className="ro__opt-btn" onClick={handleOptimize} disabled={loading}>
            {loading ? '⏳ Optimizing…' : '🚀 Optimize My Route'}
          </button>

          <button
            onClick={loadDemo}
            style={{ width: '100%', marginTop: '.75rem', background: 'transparent', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '.6rem', color: '#64748b', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontSize: '.82rem' }}
          >
            Load Demo (5-stop Karnataka trip)
          </button>

          <div style={{ marginTop: '1.2rem', padding: '.9rem', background: 'rgba(59,130,246,.06)', borderRadius: 10, border: '1px solid rgba(59,130,246,.15)' }}>
            <div style={{ fontSize: '.72rem', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.4rem' }}>💡 How It Works</div>
            <div style={{ fontSize: '.8rem', color: '#64748b', lineHeight: 1.6 }}>
              Uses the <strong style={{ color: '#93c5fd' }}>Nearest-Neighbor TSP algorithm</strong> with the Haversine formula to reorder your stops by shortest travel distance.
            </div>
          </div>
        </motion.div>

        {/* ── Results Panel ── */}
        <motion.div className="ro__card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, delay: .2 }}>
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="empty" className="ro__empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="ro__empty-icon">🗺️</div>
                <div>Enter your stops and click Optimize to see the most efficient route.</div>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="ro__card-title">📊 Optimization Result</div>

                {/* Route comparison */}
                <div className="ro__routes">
                  <div className="ro__route-panel ro__route-panel--before">
                    <div className="ro__route-label ro__route-label--before">🔴 Original Route</div>
                    <div className="ro__route-stops">
                      {result.originalRoute.map((stop, i) => (
                        <React.Fragment key={i}>
                          <div className="ro__route-stop">
                            <div className="ro__route-dot ro__route-dot--before" />
                            {stop.name}
                          </div>
                          {i < result.originalRoute.length - 1 && (
                            <div className="ro__route-line ro__route-line--before" style={{ marginLeft: '3.5px' }} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ marginTop: '.8rem', fontSize: '.8rem', color: '#94a3b8' }}>
                      Total: <strong style={{ color: '#f87171' }}>{result.originalDistanceKm} km</strong>
                    </div>
                  </div>

                  <div className="ro__route-panel ro__route-panel--after">
                    <div className="ro__route-label ro__route-label--after">🟢 Optimized Route</div>
                    <div className="ro__route-stops">
                      {result.optimizedRoute.map((stop, i) => (
                        <React.Fragment key={i}>
                          <div className="ro__route-stop">
                            <div className="ro__route-dot ro__route-dot--after" />
                            {stop.name}
                          </div>
                          {i < result.optimizedRoute.length - 1 && (
                            <div className="ro__route-line ro__route-line--after" style={{ marginLeft: '3.5px' }} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div style={{ marginTop: '.8rem', fontSize: '.8rem', color: '#94a3b8' }}>
                      Total: <strong style={{ color: '#4ade80' }}>{result.optimizedDistanceKm} km</strong>
                    </div>
                  </div>
                </div>

                {/* Savings */}
                {saved ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}>
                    <div style={{ fontSize: '.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.75rem', fontWeight: 700 }}>🎉 Savings</div>
                    <div className="ro__savings">
                      <div className="ro__saving-card">
                        <div className="ro__saving-icon">📏</div>
                        <div className="ro__saving-value">{result.distanceSavedKm} km</div>
                        <div className="ro__saving-label">Distance Saved</div>
                      </div>
                      <div className="ro__saving-card">
                        <div className="ro__saving-icon">⛽</div>
                        <div className="ro__saving-value">{result.fuelSavedLitres} L</div>
                        <div className="ro__saving-label">Fuel Saved</div>
                      </div>
                      <div className="ro__saving-card">
                        <div className="ro__saving-icon">⏱️</div>
                        <div className="ro__saving-value">{result.timeSavedMinutes} min</div>
                        <div className="ro__saving-label">Time Saved</div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="ro__no-saving">
                    ✅ Your original route is already optimal! No changes needed.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
