/* ================================================================
   HiddenGemsExplorer.jsx — Karnataka Hidden Gems Discovery Engine
================================================================ */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './AllCss/HiddenGemsExplorer.css';

const CATEGORY_ICONS = {
  Waterfall: '💧', Trek: '🥾', Heritage: '🏛️',
  Nature: '🌿', Adventure: '🧗', Temple: '🛕',
};

const CATEGORY_COLORS = {
  Waterfall: '#3b82f6', Trek: '#10b981', Heritage: '#f59e0b',
  Nature: '#22c55e', Adventure: '#ec4899', Temple: '#8b5cf6',
};

const KARNATAKA_DISTRICTS = [
  'Bengaluru Urban','Mysuru','Kodagu','Hassan','Chikmagalur','Shivamogga',
  'Udupi','Dakshina Kannada','Uttara Kannada','Kolar','Ramanagara',
  'Tumkur','Vijayanagara','Chamarajanagar','Dharwad',
];

function GemCard({ gem, index }) {
  const icon  = CATEGORY_ICONS[gem.category] || '📍';
  const color = CATEGORY_COLORS[gem.category] || '#94a3b8';
  const stars = Math.round(gem.rating || 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: .35 }}
      style={{
        background: 'rgba(255,255,255,.04)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 18,
        padding: '1.4rem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color .2s, transform .2s',
      }}
      whileHover={{ scale: 1.02, borderColor: `${color}66` }}
    >
      {/* Category accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '18px 18px 0 0' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '.7rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <span style={{ fontSize: '1.6rem' }}>{icon}</span>
          <div>
            <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{gem.placeName}</h3>
            <div style={{ fontSize: '.72rem', color: '#64748b', marginTop: '.1rem' }}>📍 {gem.district}</div>
          </div>
        </div>
        <span style={{
          background: `${color}1a`,
          border: `1px solid ${color}44`,
          color,
          fontSize: '.7rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: 999,
        }}>{gem.category}</span>
      </div>

      <p style={{ fontSize: '.83rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 .8rem' }}>
        {gem.description?.length > 140 ? gem.description.slice(0, 140) + '…' : gem.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[1,2,3,4,5].map(s => (
            <span key={s} style={{ fontSize: '.85rem', opacity: s <= stars ? 1 : .25 }}>⭐</span>
          ))}
          <span style={{ fontSize: '.75rem', color: '#64748b', marginLeft: '.3rem' }}>{gem.rating}</span>
        </div>
        {gem.latitude && gem.longitude && (
          <a
            href={`https://www.google.com/maps?q=${gem.latitude},${gem.longitude}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '.75rem', color: '#3b82f6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '.2rem' }}
          >
            🗺️ View on Map
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function HiddenGemsExplorer() {
  const navigate = useNavigate();
  const [allGems, setAllGems]     = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [district, setDistrict]   = useState('');
  const [category, setCategory]   = useState('');
  const [search, setSearch]       = useState('');

  const allCategories = [...new Set(Object.keys(CATEGORY_ICONS))];

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get('/api/hidden-gems/all');
        setAllGems(data);
        setFiltered(data);
      } catch {
        setError('Could not load hidden gems. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let list = [...allGems];
    if (district) list = list.filter(g => g.district === district);
    if (category) list = list.filter(g => g.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(g =>
        g.placeName?.toLowerCase().includes(q) ||
        g.district?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [district, category, search, allGems]);

  const styles = {
    wrap: { position: 'relative', minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(160deg,#0a0f1e 0%,#0d1a2e 55%,#0a0f1e 100%)', fontFamily: "'Inter',sans-serif", color: '#e2e8f0', padding: '2rem 1.5rem 4rem' },
    header: { textAlign: 'center', marginBottom: '2.5rem' },
    controls: { display: 'flex', gap: '.75rem', maxWidth: 900, margin: '0 auto 1.5rem', flexWrap: 'wrap', alignItems: 'center' },
    input: { flex: 1, minWidth: 200, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '.7rem 1rem', color: '#e2e8f0', fontFamily: "'Inter',sans-serif", fontSize: '.88rem', outline: 'none' },
    select: { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '.7rem 1rem', color: '#e2e8f0', fontFamily: "'Inter',sans-serif", fontSize: '.88rem', outline: 'none' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem', maxWidth: 1100, margin: '0 auto' },
    catChips: { display: 'flex', flexWrap: 'wrap', gap: '.4rem', maxWidth: 900, margin: '0 auto 1.25rem', justifyContent: 'center' },
    catChip: (active, color) => ({
      padding: '.35rem .9rem', borderRadius: 999, border: '1px solid',
      fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
      fontFamily: "'Inter',sans-serif",
      background: active ? `${color}22` : 'rgba(255,255,255,.04)',
      borderColor: active ? color : 'rgba(255,255,255,.1)',
      color: active ? color : '#94a3b8',
    }),
  };

  return (
    <div className="hg">
      <div className="hg__column">
      <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', zIndex: 10 }}>← Back</button>
      <div style={styles.header}>
        <div style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: '#10b981', marginBottom: '.5rem' }}>💎 Off the Beaten Path</div>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-.03em', margin: '0 0 .5rem' }}>
          Hidden <span style={{ color: '#10b981' }}>Gems</span> Explorer
        </h1>
        <p style={{ color: '#64748b', maxWidth: 540, margin: '0 auto', fontSize: '.9rem' }}>
          Discover Karnataka's best-kept secrets — offbeat waterfalls, hidden peaks, secret trails, and forgotten heritage.
        </p>
      </div>

      {/* Category chips */}
      <div style={styles.catChips}>
        <span
          style={styles.catChip(!category, '#94a3b8')}
          onClick={() => setCategory('')}
        >All</span>
        {allCategories.map(cat => (
          <span
            key={cat}
            style={styles.catChip(category === cat, CATEGORY_COLORS[cat] || '#94a3b8')}
            onClick={() => setCategory(category === cat ? '' : cat)}
          >
            {CATEGORY_ICONS[cat]} {cat}
          </span>
        ))}
      </div>

      {/* Search + district filter */}
      <div style={styles.controls}>
        <input
          style={styles.input}
          placeholder="Search places, districts…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={styles.select} value={district} onChange={e => setDistrict(e.target.value)}>
          <option value="">All Districts</option>
          {KARNATAKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {(district || category || search) && (
          <button
            onClick={() => { setDistrict(''); setCategory(''); setSearch(''); }}
            style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 10, padding: '.6rem 1rem', color: '#fca5a5', fontFamily: "'Inter',sans-serif", fontSize: '.82rem', cursor: 'pointer' }}
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      <div style={{ textAlign: 'center', color: '#64748b', fontSize: '.82rem', marginBottom: '1.5rem' }}>
        {filtered.length} hidden gem{filtered.length !== 1 ? 's' : ''} found
      </div>
      {loading && <div style={{ textAlign: 'center', color: '#64748b', marginTop: '3rem' }}>Discovering gems…</div>}
      {error && <div style={{ textAlign: 'center', color: '#f87171', marginTop: '2rem' }}>{error}</div>}

      <AnimatePresence>
        <div style={styles.grid}>
          {filtered.map((gem, i) => <GemCard key={gem.id} gem={gem} index={i} />)}
        </div>
      </AnimatePresence>
      </div>
    </div>
  );
}
