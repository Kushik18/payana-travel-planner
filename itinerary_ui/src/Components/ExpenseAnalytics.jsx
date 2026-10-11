/* ================================================================
   ExpenseAnalytics.jsx — Analytics Dashboard with Recharts
================================================================ */
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AllCss/ExpenseAnalytics.css';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import { UserContext } from '../App';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

/* ── Category palette ── */
const CATEGORY_CONFIG = {
  Food:        { icon: '🍽️', color: '#10b981' },
  Fuel:        { icon: '⛽',  color: '#f59e0b' },
  Hotel:       { icon: '🏨',  color: '#8b5cf6' },
  Shopping:    { icon: '🛍️',  color: '#ec4899' },
  Tickets:     { icon: '🎟️',  color: '#f97316' },
  Transport:   { icon: '🚗',  color: '#3b82f6' },
  Activities:  { icon: '🥾',  color: '#06b6d4' },
  Other:       { icon: '📦',  color: '#94a3b8' },
};

function getCatColor(cat) { return CATEGORY_CONFIG[cat]?.color || '#94a3b8'; }
function getCatIcon(cat)  { return CATEGORY_CONFIG[cat]?.icon  || '📦'; }

/* ── Custom Tooltip ── */
function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={{ background: 'rgba(13,26,46,.95)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '8px 14px', fontSize: '.82rem', color: '#e2e8f0' }}>
      <div style={{ fontWeight: 700 }}>{getCatIcon(name)} {name}</div>
      <div style={{ color: getCatColor(name) }}>₹{Number(value).toLocaleString('en-IN')}</div>
    </div>
  );
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(13,26,46,.95)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '8px 14px', fontSize: '.82rem', color: '#e2e8f0' }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.fill }}>₹{Number(p.value).toLocaleString('en-IN')}</div>
      ))}
    </div>
  );
}

/* ── Custom Pie Label ── */
function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="700">
      {(percent * 100).toFixed(0)}%
    </text>
  );
}

/* ── Process daily spending from raw expenses ── */
function buildDailyData(expenses) {
  const map = {};
  expenses.forEach(e => {
    const day = e.expenseDate || 'Unknown';
    map[day] = (map[day] || 0) + Number(e.amount || 0);
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date: date.slice(5), amount: Math.round(amount) }));
}

/* ── PDF Export ── */
async function downloadPDF(expenses, summary) {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = 20;

  // Header
  doc.setFillColor(10, 15, 30);
  doc.rect(0, 0, pageW, 35, 'F');
  doc.setTextColor(201, 168, 76);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Payana — Expense Report', margin, 16);
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} | Total: ₹${expenses.reduce((s,e)=>s+Number(e.amount||0),0).toLocaleString('en-IN')}`, margin, 26);

  y = 45;
  doc.setTextColor(30, 30, 30);

  // Category summary table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(5, 150, 105);
  doc.text('Category Summary', margin, y);
  y += 6;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(.3);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  summary.forEach(s => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    doc.text(`${s.category}`, margin, y);
    doc.text(`₹${Number(s.total).toLocaleString('en-IN')}`, pageW - margin - 30, y);
    doc.text(`${s.count} txn`, pageW - margin, y, { align: 'right' });
    y += 7;
  });

  y += 6;

  // Transactions
  if (y > 220) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(5, 150, 105);
  doc.text('All Transactions', margin, y);
  y += 6;
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  expenses.forEach(e => {
    if (y > 270) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    const desc = (e.description || e.category || '').slice(0, 40);
    doc.text(`${e.expenseDate || ''}`, margin, y);
    doc.text(`[${e.category}]`, margin + 28, y);
    doc.text(desc, margin + 52, y);
    doc.text(`₹${Number(e.amount).toLocaleString('en-IN')}`, pageW - margin, y, { align: 'right' });
    y += 6.5;
  });

  doc.setFontSize(7);
  doc.setTextColor(180);
  doc.text('Generated by Payana AI', margin, 290);
  doc.save(`Payana_Expenses_${new Date().toISOString().split('T')[0]}.pdf`);
}

/* ================================================================
   MAIN COMPONENT
================================================================ */
export default function ExpenseAnalytics() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const userId = user?.useremail || 'guest';

  const [expenses,  setExpenses]  = useState([]);
  const [summary,   setSummary]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('overview');  // overview | daily | transactions

  useEffect(() => {
    const load = async () => {
      try {
        const [expRes, sumRes] = await Promise.all([
          axiosInstance.get(`/api/expenses/user/${encodeURIComponent(userId)}`),
          axiosInstance.get(`/api/expenses/summary/${encodeURIComponent(userId)}`),
        ]);
        setExpenses(expRes.data);
        setSummary(sumRes.data);
      } catch {
        // Silent fail — show empty state
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  const pieData = summary.map(s => ({
    name: s.category,
    value: Number(s.total),
  }));

  const dailyData = buildDailyData(expenses);

  const styles = {
    wrap: { position: 'relative', minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(160deg,#0a0f1e 0%,#0d1a2e 55%,#0a0f1e 100%)', fontFamily: "'Inter',sans-serif", color: '#e2e8f0', padding: '2rem 1.5rem 4rem' },
    header: { textAlign: 'center', marginBottom: '2.5rem' },
    tabs: { display: 'flex', gap: '.5rem', maxWidth: 500, margin: '0 auto 2rem', background: 'rgba(255,255,255,.04)', borderRadius: 14, padding: '.3rem', border: '1px solid rgba(255,255,255,.08)' },
    tab: (active) => ({ flex: 1, padding: '.55rem', borderRadius: 10, border: 'none', fontFamily: "'Inter',sans-serif", fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all .2s', background: active ? 'rgba(168,85,247,.25)' : 'transparent', color: active ? '#c4b5fd' : '#64748b' }),
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem', maxWidth: 1100, margin: '0 auto' },
    card: { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: '1.5rem', backdropFilter: 'blur(16px)' },
    cardTitle: { fontSize: '.9rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '.4rem' },
    fullCard: { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: '1.5rem', backdropFilter: 'blur(16px)', maxWidth: 1100, margin: '0 auto', marginBottom: '1.25rem' },
    exportBtn: { background: 'linear-gradient(135deg,#92400e,#C9A84C)', border: 'none', borderRadius: 10, padding: '.55rem 1.2rem', color: '#0a0f1e', fontWeight: 700, fontFamily: "'Inter',sans-serif", fontSize: '.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '.4rem' },
  };

  if (loading) {
    return (
      <div className="ea">
        <div className="ea__column" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', zIndex: 10 }}>← Back</button>
          Loading analytics…
        </div>
      </div>
    );
  }

  return (
    <div className="ea">
      <div className="ea__column">
      <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', zIndex: 10 }}>← Back</button>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: '#a855f7', marginBottom: '.5rem' }}>📊 Spending Intelligence</div>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-.03em', margin: '0 0 .4rem' }}>
          Expense <span style={{ color: '#a855f7' }}>Analytics</span>
        </h1>
        <p style={{ color: '#64748b', maxWidth: 520, margin: '0 auto', fontSize: '.9rem' }}>
          Visual breakdown of your travel spending — understand where your budget goes.
        </p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['overview', 'daily', 'transactions'].map(tab => (
          <button key={tab} style={styles.tab(activeTab === tab)} onClick={() => setActiveTab(tab)}>
            {tab === 'overview' ? '📊 Overview' : tab === 'daily' ? '📅 Daily' : '📋 Transactions'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {expenses.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#475569', padding: '4rem', fontSize: '.9rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: .4 }}>📊</div>
                No expense data yet. <a href="/Main/expenses" style={{ color: '#a855f7' }}>Add some expenses</a> to see your analytics.
              </div>
            ) : (
              <>
                {/* Total Banner */}
                <div style={{ ...styles.fullCard, textAlign: 'center', marginBottom: '1.25rem', background: 'linear-gradient(135deg,rgba(168,85,247,.12),rgba(168,85,247,.04))', borderColor: 'rgba(168,85,247,.25)' }}>
                  <div style={{ fontSize: '.75rem', color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.3rem' }}>Total Spend</div>
                  <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-.03em' }}>₹{total.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '.82rem', color: '#64748b', marginTop: '.3rem' }}>{expenses.length} transactions across {new Set(expenses.map(e=>e.category)).size} categories</div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <button style={styles.exportBtn} onClick={() => downloadPDF(expenses, summary)}>
                      📄 Export PDF Report
                    </button>
                  </div>
                </div>

                {/* Charts grid */}
                <div style={styles.grid}>
                  {/* Pie Chart */}
                  <div style={{ ...styles.card, gridColumn: 'span 1' }}>
                    <div style={styles.cardTitle}>🍩 Spending by Category</div>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" labelLine={false} label={renderPieLabel}>
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={getCatColor(entry.name)} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip content={<PieTooltip />} />
                        <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: '.76rem' }}>{getCatIcon(v)} {v}</span>} iconSize={8} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category Bar Chart */}
                  <div style={{ ...styles.card }}>
                    <div style={styles.cardTitle}>📊 Category Breakdown</div>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={summary.map(s => ({ name: s.category, total: Number(s.total) }))} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                        <Tooltip content={<BarTooltip />} />
                        <Bar dataKey="total" radius={[6,6,0,0]}>
                          {summary.map((s, i) => (
                            <Cell key={i} fill={getCatColor(s.category)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category table */}
                  <div style={styles.card}>
                    <div style={styles.cardTitle}>📋 Category Totals</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                      {summary.map((s, i) => {
                        const pct = total ? Math.round((Number(s.total)/total)*100) : 0;
                        const color = getCatColor(s.category);
                        return (
                          <motion.div key={s.category} initial={{ opacity:0,x:8 }} animate={{ opacity:1,x:0 }} transition={{ delay: i*.05 }}>
                            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'.25rem' }}>
                              <span style={{ fontSize:'.82rem',color:'#cbd5e1',display:'flex',alignItems:'center',gap:'.4rem' }}>
                                {getCatIcon(s.category)} {s.category}
                              </span>
                              <span style={{ fontSize:'.82rem',fontWeight:700,color:'#f1f5f9' }}>₹{Number(s.total).toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ height:5,background:'rgba(255,255,255,.05)',borderRadius:999,overflow:'hidden' }}>
                              <motion.div
                                style={{ height:'100%',background:color,borderRadius:999 }}
                                initial={{ width:0 }}
                                animate={{ width:`${pct}%` }}
                                transition={{ duration:.8,delay:i*.05 }}
                              />
                            </div>
                            <div style={{ fontSize:'.7rem',color:'#475569',marginTop:'.15rem',display:'flex',justifyContent:'space-between' }}>
                              <span>{s.count} transaction{s.count>1?'s':''}</span>
                              <span>{pct}%</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* ── DAILY TAB ── */}
        {activeTab === 'daily' && (
          <motion.div key="daily" initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
            {dailyData.length === 0 ? (
              <div style={{ textAlign:'center',color:'#475569',padding:'4rem',fontSize:'.9rem' }}>
                <div style={{ fontSize:'3rem',marginBottom:'1rem',opacity:.4 }}>📅</div>
                No daily data yet. Add expenses to see your spending trend.
              </div>
            ) : (
              <div style={styles.fullCard}>
                <div style={{ ...styles.cardTitle, marginBottom:'1.5rem' }}>📅 Daily Spending Trend</div>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={dailyData} margin={{ top:5,right:20,bottom:5,left:20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
                    <XAxis dataKey="date" tick={{ fill:'#64748b',fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:'#64748b',fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}`} />
                    <Tooltip content={<BarTooltip />} />
                    <Line type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={3} dot={{ fill:'#a855f7',r:5 }} activeDot={{ r:7,fill:'#c4b5fd' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        )}

        {/* ── TRANSACTIONS TAB ── */}
        {activeTab === 'transactions' && (
          <motion.div key="txns" initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}>
            <div style={{ ...styles.fullCard }}>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.25rem',flexWrap:'wrap',gap:'.5rem' }}>
                <div style={styles.cardTitle}>📋 All Transactions ({expenses.length})</div>
                {expenses.length > 0 && (
                  <button style={styles.exportBtn} onClick={() => downloadPDF(expenses, summary)}>
                    📄 Export PDF
                  </button>
                )}
              </div>

              {expenses.length === 0 ? (
                <div style={{ textAlign:'center',color:'#475569',padding:'3rem',fontSize:'.9rem' }}>No transactions yet.</div>
              ) : (
                <div style={{ display:'flex',flexDirection:'column',gap:'.5rem' }}>
                  {[...expenses].sort((a,b) => (b.expenseDate||'').localeCompare(a.expenseDate||'')).map((e,i) => {
                    const cat = CATEGORY_CONFIG[e.category] || CATEGORY_CONFIG.Other;
                    return (
                      <motion.div key={e.id} initial={{ opacity:0,x:-8 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.03 }}
                        style={{ display:'flex',alignItems:'center',gap:'.75rem',padding:'.75rem 1rem',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.07)',borderRadius:12 }}>
                        <span style={{ fontSize:'1.3rem' }}>{cat.icon}</span>
                        <div style={{ flex:1,minWidth:0 }}>
                          <div style={{ fontSize:'.85rem',fontWeight:600,color:'#e2e8f0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                            {e.description || e.category}
                          </div>
                          <div style={{ display:'flex',gap:'.5rem',marginTop:'.2rem' }}>
                            <span style={{ fontSize:'.7rem',padding:'2px 8px',borderRadius:999,background:`${cat.color}22`,color:cat.color,fontWeight:600 }}>{e.category}</span>
                            <span style={{ fontSize:'.7rem',color:'#475569' }}>📅 {e.expenseDate}</span>
                          </div>
                        </div>
                        <div style={{ fontSize:'.95rem',fontWeight:800,color:'#f1f5f9',flexShrink:0 }}>₹{Number(e.amount).toLocaleString('en-IN')}</div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
