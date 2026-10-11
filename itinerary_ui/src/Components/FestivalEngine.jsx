/* ================================================================
   FestivalEngine.jsx — Karnataka Festival Recommendation Engine
================================================================ */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './AllCss/FestivalEngine.css';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function getDaysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return null;
  if (days === 0) return 'Today!';
  if (days === 1) return 'Tomorrow!';
  if (days <= 30) return `In ${days} days`;
  const months = Math.floor(days / 30);
  return `In ~${months} month${months > 1 ? 's' : ''}`;
}

function FestivalCard({ festival, index }) {
  const countdown = getDaysUntil(festival.startDate);
  const isUpcoming = countdown !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      style={{
        background: isUpcoming ? 'rgba(201,168,76,.06)' : 'rgba(255,255,255,.04)',
        border: `1px solid ${isUpcoming ? 'rgba(201,168,76,.25)' : 'rgba(255,255,255,.08)'}`,
        borderRadius: 16,
        padding: '1.4rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {countdown && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'linear-gradient(135deg,#92400e,#C9A84C)',
          color: '#0a0f1e', fontSize: '.7rem', fontWeight: 800,
          padding: '3px 10px', borderRadius: 999,
        }}>{countdown}</div>
      )}

      <div style={{ fontSize: '1.6rem', marginBottom: '.5rem' }}>🎉</div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 .3rem' }}>{festival.name}</h3>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '.6rem' }}>
        <span style={{ fontSize: '.72rem', color: '#C9A84C', background: 'rgba(201,168,76,.1)', padding: '2px 10px', borderRadius: 999, fontWeight: 600 }}>
          📍 {festival.district}
        </span>
        <span style={{ fontSize: '.72rem', color: '#94a3b8', background: 'rgba(255,255,255,.06)', padding: '2px 10px', borderRadius: 999 }}>
          📅 {formatDate(festival.startDate)}{festival.startDate !== festival.endDate ? ` – ${formatDate(festival.endDate)}` : ''}
        </span>
      </div>
      <p style={{ fontSize: '.83rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
        {festival.description?.length > 160 ? festival.description.slice(0, 160) + '…' : festival.description}
      </p>
    </motion.div>
  );
}

export default function FestivalEngine() {
  const navigate = useNavigate();
  const [allFestivals, setAllFestivals] = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [filter, setFilter]             = useState('all');   // all | upcoming
  const [search, setSearch]             = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosInstance.get('/api/festivals/all');
        setAllFestivals(data);
        setFiltered(data);
      } catch {
        setError('Could not load festival data. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let list = [...allFestivals];
    if (filter === 'upcoming') {
      const today = new Date();
      list = list.filter(f => f.endDate && new Date(f.endDate) >= today);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        f.name?.toLowerCase().includes(q) ||
        f.district?.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [filter, search, allFestivals]);

  const styles = {
    wrap: { position: 'relative', minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(160deg,#0a0f1e 0%,#0d1a2e 55%,#0a0f1e 100%)', fontFamily: "'Inter',sans-serif", color: '#e2e8f0', padding: '2rem 1.5rem 4rem' },
    header: { textAlign: 'center', marginBottom: '2.5rem' },
    controls: { display: 'flex', gap: '.75rem', maxWidth: 700, margin: '0 auto 2rem', flexWrap: 'wrap', alignItems: 'center' },
    searchInput: { flex: 1, minWidth: 200, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '.7rem 1rem', color: '#e2e8f0', fontFamily: "'Inter',sans-serif", fontSize: '.88rem', outline: 'none' },
    filterBtn: (active) => ({ padding: '.5rem 1.1rem', borderRadius: 999, border: '1px solid', fontFamily: "'Inter',sans-serif", fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s', background: active ? 'linear-gradient(135deg,#92400e,#C9A84C)' : 'rgba(255,255,255,.05)', borderColor: active ? 'transparent' : 'rgba(255,255,255,.1)', color: active ? '#0a0f1e' : '#94a3b8' }),
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem', maxWidth: 1100, margin: '0 auto' },
  };

  return (
    <div className="fe">
      <div className="fe__column">
      <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', zIndex: 10 }}>← Back</button>
      <div style={styles.header}>
        <div style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '.5rem' }}>🎊 Karnataka Intelligence</div>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-.03em', margin: '0 0 .5rem' }}>
          Festival <span style={{ color: '#C9A84C' }}>Engine</span>
        </h1>
        <p style={{ color: '#64748b', maxWidth: 540, margin: '0 auto', fontSize: '.9rem' }}>
          Discover Karnataka's vibrant festivals and plan your trip around them for an unforgettable cultural experience.
        </p>
      </div>

      <div style={styles.controls}>
        <input
          style={styles.searchInput}
          placeholder="Search festivals, districts…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button style={styles.filterBtn(filter === 'all')} onClick={() => setFilter('all')}>All Festivals</button>
        <button style={styles.filterBtn(filter === 'upcoming')} onClick={() => setFilter('upcoming')}>🗓️ Upcoming</button>
      </div>

      {loading && <div style={{ textAlign: 'center', color: '#64748b', marginTop: '3rem' }}>Loading festivals…</div>}
      {error && <div style={{ textAlign: 'center', color: '#f87171', marginTop: '2rem' }}>{error}</div>}

      {!loading && filtered.length === 0 && !error && (
        <div style={{ textAlign: 'center', color: '#475569', marginTop: '3rem', fontSize: '.9rem' }}>
          No festivals found. Try a different search or filter.
        </div>
      )}

      <AnimatePresence>
        <div style={styles.grid}>
          {filtered.map((festival, i) => (
            <FestivalCard key={festival.id} festival={festival} index={i} />
          ))}
        </div>
      </AnimatePresence>
      </div>
    </div>
  );
}
