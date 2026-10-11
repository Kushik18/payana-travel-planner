import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import './AllCss/PackingAssistant.css';
import { generatePackingList, DESTINATION_INTELLIGENCE } from './PackingEngine';

const ACTIVITIES = [
  { id: 'trek', label: '🥾 Trekking' },
  { id: 'swim', label: '🏊 Swimming' },
  { id: 'temple', label: '🛕 Temples' },
  { id: 'wildlife', label: '🦁 Wildlife' },
];

const TEMPLATES = [
  { id: 'weekend', label: 'Weekend Trip', days: 2, activities: [] },
  { id: 'family', label: 'Family Vacation', days: 5, activities: ['temple'], travelers: 4 },
  { id: 'adventure', label: 'Adventure Trip', days: 3, activities: ['trek', 'swim'] },
];

const CAPACITIES = [
  { id: 'cabin', label: 'Cabin Bag (7kg)', limit: 7000 },
  { id: 'medium', label: 'Medium Bag (15kg)', limit: 15000 },
  { id: 'large', label: 'Large Bag (25kg)', limit: 25000 },
  { id: 'backpack', label: 'Backpack (40L)', limit: 12000 },
];

export default function PackingAssistant() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    destination: '',
    days: '',
    weatherTemp: 25,
    weatherRainProb: 20,
    activities: [],
    travelers: 1,
    bagCapacity: 'medium'
  });
  const [checklist, setChecklist] = useState([]);
  const [aiTips, setAiTips] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [lastSaved, setLastSaved] = useState(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('payana_packing');
    if (saved) {
      const data = JSON.parse(saved);
      setForm(data.form);
      setChecklist(data.checklist);
      setAiTips(data.aiTips);
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (checklist.length > 0) {
      localStorage.setItem('payana_packing', JSON.stringify({ form, checklist, aiTips }));
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [checklist, form, aiTips]);

  const toggleActivity = (id) => {
    setForm(f => ({ ...f, activities: f.activities.includes(id) ? f.activities.filter(a => a !== id) : [...f.activities, id] }));
  };

  const applyTemplate = (t) => {
    setForm(f => ({ ...f, days: t.days, activities: t.activities || [], travelers: t.travelers || 1 }));
  };

  const handleGenerate = async () => {
    if (!form.days || !form.destination) return;
    setGenerating(true);
    try {
      const weather = { temp: form.weatherTemp, rainProb: form.weatherRainProb };
      const { checklist: newList, aiTips: newTips } = await generatePackingList({ ...form, weather });
      setChecklist(newList);
      setAiTips(newTips);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const toggleItem = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const clearAll = () => {
    setChecklist(prev => prev.map(item => ({ ...item, checked: false })));
  };

  const toggleCollapse = (cat) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Metrics
  const totalWeight = checklist.reduce((sum, item) => sum + (item.checked ? 0 : (item.weight * item.qty)), 0);
  const capacityLimit = CAPACITIES.find(c => c.id === form.bagCapacity)?.limit || 15000;
  const isOverweight = totalWeight > capacityLimit;

  // Group items
  let filteredList = checklist;
  if (filter === 'missing') filteredList = checklist.filter(i => !i.checked);
  if (filter === 'packed') filteredList = checklist.filter(i => i.checked);
  if (filter === 'important') filteredList = checklist.filter(i => i.priority === 'Mandatory');
  
  if (search) {
    const s = search.toLowerCase();
    filteredList = filteredList.filter(i => i.name.toLowerCase().includes(s) || (i.tags && i.tags.some(t => t.toLowerCase().includes(s))));
  }

  const grouped = filteredList.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Destination Intelligence
  const destInfo = DESTINATION_INTELLIGENCE[form.destination];

  // PDF Export
  const handleDownloadPDF = () => {
    if (!checklist.length) return;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 18;
    let y = 20;

    doc.setFillColor(10, 15, 30);
    doc.rect(0, 0, pageW, 40, 'F');
    doc.setTextColor(201, 168, 76);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYANA', margin, 18);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('Smart Packing Report', margin, 26);
    
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Destination: ${form.destination} | Duration: ${form.days} Days | Travelers: ${form.travelers}`, margin, 34);

    y = 50;
    doc.setTextColor(30, 30, 30);
    
    // AI Tips Section
    if (aiTips.length > 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text('🤖 AI Recommendations', margin, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      aiTips.forEach(tip => {
        doc.text(`• ${tip}`, margin, y);
        y += 5;
      });
      y += 8;
    }

    // Emergency Section
    if (destInfo) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(239, 68, 68);
      doc.text('🚨 Emergency Information', margin, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(`Police: ${destInfo.police} | Ambulance: ${destInfo.emergency}`, margin, y);
      y += 10;
    }

    Object.entries(grouped).forEach(([category, items]) => {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.text(category, margin, y);
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.line(margin, y + 2, pageW - margin, y + 2);
      y += 8;

      items.forEach(item => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setDrawColor(180, 180, 180);
        doc.rect(margin, y - 3.5, 4, 4);
        if (item.checked) {
          doc.setTextColor(5, 150, 105);
          doc.setFontSize(7);
          doc.text('✓', margin + 0.5, y - 0.2);
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(item.checked ? 150 : 55, item.checked ? 150 : 65, item.checked ? 150 : 81);
        doc.text(`${item.name} (x${item.qty}) - ${item.priority}`, margin + 7, y);
        y += 6.5;
      });
      y += 4;
    });

    doc.save(`Payana_Packing_${form.destination}.pdf`);
  };

  return (
    <div className="pa">
      <div className="pa__column">
      <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', zIndex: 10 }}>← Back</button>
      <motion.div className="pa__header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="pa__eyebrow">🎒 Smart Packing Engine</div>
        <h1 className="pa__title">Packing <span>Assistant</span></h1>
        <p className="pa__subtitle">Intelligent packing recommendations powered by weather, activities, and destination logic.</p>
      </motion.div>

      <div className="pa__layout">
        {/* Input Panel */}
        <motion.div className="pa__card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="pa__card-title"><span>📋</span> Trip Details</div>
          
          <div className="pa__templates" style={{display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap'}}>
            {TEMPLATES.map(t => (
               <button key={t.id} onClick={() => applyTemplate(t)} style={{fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer'}}>
                 {t.label}
               </button>
            ))}
          </div>

          <div className="pa__field">
            <label className="pa__label">Destination</label>
            <select className="pa__select" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}>
              <option value="" disabled>Select a District</option>
              {['Bagalkot', 'Bangalore Rural', 'Bangalore Urban', 'Belgaum', 'Bellary', 'Bidar', 'Bijapur', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Gulbarga', 'Hassan', 'Haveri', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shimoga', 'Tumkur', 'Udupi', 'Uttara Kannada', 'Vijayanagara', 'Yadgir'].sort().map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="pa__field">
              <label className="pa__label">Duration (days)</label>
              <input className="pa__input" type="number" min="1" max="30" value={form.days} onChange={e => setForm(f => ({ ...f, days: e.target.value }))} />
            </div>
            <div className="pa__field">
              <label className="pa__label">Travelers</label>
              <input className="pa__input" type="number" min="1" max="20" value={form.travelers} onChange={e => setForm(f => ({ ...f, travelers: parseInt(e.target.value) || 1 }))} />
            </div>
          </div>

          <div className="pa__field">
            <label className="pa__label">Bag Capacity</label>
            <select className="pa__select" value={form.bagCapacity} onChange={e => setForm(f => ({ ...f, bagCapacity: e.target.value }))}>
              {CAPACITIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div className="pa__field">
            <label className="pa__label">Weather Conditions</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input className="pa__input" type="number" title="Temp °C" placeholder="°C" value={form.weatherTemp} onChange={e => setForm(f => ({ ...f, weatherTemp: e.target.value }))} style={{width: '50%'}} />
              <input className="pa__input" type="number" title="Rain %" placeholder="Rain %" value={form.weatherRainProb} onChange={e => setForm(f => ({ ...f, weatherRainProb: e.target.value }))} style={{width: '50%'}} />
            </div>
          </div>

          <div className="pa__field">
            <label className="pa__label">Activities</label>
            <div className="pa__activities">
              {ACTIVITIES.map(act => (
                <label key={act.id} className={`pa__activity-chip ${form.activities.includes(act.id) ? 'pa__activity-chip--active' : ''}`}>
                  <input type="checkbox" checked={form.activities.includes(act.id)} onChange={() => toggleActivity(act.id)} />
                  {act.label}
                </label>
              ))}
            </div>
          </div>

          <button className="pa__gen-btn" onClick={handleGenerate} disabled={!form.days || !form.destination || generating}>
            {generating ? '⏳ Generating…' : '✨ Generate Smart Checklist'}
          </button>
          
          {destInfo && (
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(16,185,129,0.1)', borderRadius: '10px', fontSize: '0.85rem' }}>
              <h4 style={{ margin: '0 0 10px', color: '#10b981' }}>📍 Destination Intel: {form.destination}</h4>
              <p style={{ margin: '4px 0' }}><strong>Best Time:</strong> {destInfo.bestTime}</p>
              <p style={{ margin: '4px 0' }}><strong>Emergency:</strong> 🚨 {destInfo.emergency} | 🚓 {destInfo.police}</p>
              <p style={{ margin: '4px 0' }}><strong>Notes:</strong> {destInfo.notes}</p>
            </div>
          )}
        </motion.div>

        {/* Checklist Panel */}
        <motion.div className="pa__card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <AnimatePresence mode="wait">
            {!checklist.length ? (
              <motion.div key="empty" className="pa__empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="pa__empty-icon">🎒</div>
                <div className="pa__empty-text">Select your destination and trip details to generate an intelligent packing list.</div>
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Header */}
                <div className="pa__checklist-header">
                  <div className="pa__card-title" style={{ margin: 0 }}><span>✅</span> Checklist generated</div>
                  <div className="pa__actions-row">
                    <button className="pa__pdf-btn" onClick={handleDownloadPDF}>📄 Download PDF</button>
                    <button className="pa__clear-btn" onClick={clearAll}>↺ Reset Checks</button>
                  </div>
                </div>

                {/* AI Recommendations */}
                {aiTips.length > 0 && (
                  <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '8px' }}>🤖 AI Recommendations</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                      {aiTips.map((tip, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{tip}</li>)}
                    </ul>
                  </div>
                )}

                {/* Capacity Warning */}
                {isOverweight && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '12px', borderRadius: '8px', marginBottom: '16px', color: '#fca5a5', fontSize: '0.85rem' }}>
                    ⚠ <strong>Warning:</strong> Estimated weight ({(totalWeight / 1000).toFixed(1)}kg) exceeds your {CAPACITIES.find(c=>c.id===form.bagCapacity)?.label} limit! Consider removing Optional items.
                  </div>
                )}

                {/* Smart Filters & Search */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  <input type="text" placeholder="🔍 Search packing list..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', flexGrow: 1 }} />
                  {['all', 'missing', 'packed', 'important'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${filter === f ? '#10b981' : 'rgba(255,255,255,0.1)'}`, background: filter === f ? 'rgba(16,185,129,0.1)' : 'transparent', color: filter === f ? '#10b981' : '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                      {f}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right', marginBottom: '12px' }}>
                  {lastSaved && `✔ Auto Saved: ${lastSaved}`}
                </div>

                {/* Categories */}
                {Object.entries(grouped).map(([category, items]) => {
                  const packedCount = items.filter(i => i.checked).length;
                  const isCollapsed = collapsedCategories[category];
                  const progressPct = Math.round((packedCount / items.length) * 100) || 0;

                  return (
                    <div key={category} className="pa__section" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="pa__section-title" onClick={() => toggleCollapse(category)} style={{ cursor: 'pointer', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ marginRight: '8px' }}>{isCollapsed ? '▶' : '▼'}</span> {category}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>{packedCount} / {items.length}</span>
                          <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progressPct}%`, background: progressPct === 100 ? '#10b981' : '#3b82f6' }} />
                          </div>
                        </div>
                      </div>
                      
                      {!isCollapsed && (
                        <div className="pa__items" style={{ marginTop: '12px' }}>
                          {items.map(item => (
                            <div key={item.id} className="pa__item" onClick={() => toggleItem(item.id)}>
                              <div className={`pa__item-check ${item.checked ? 'pa__item-check--checked' : ''}`}>{item.checked && '✓'}</div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className={`pa__item-name ${item.checked ? 'pa__item-name--checked' : ''}`}>
                                  {item.name} <span style={{ color: '#64748b', fontSize: '0.75rem' }}>(x{item.qty})</span>
                                </span>
                                {item.reason && <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ⓘ {item.reason}</span>}
                              </div>
                              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: item.priority === 'Mandatory' ? 'rgba(239,68,68,0.1)' : item.priority === 'Recommended' ? 'rgba(245,158,11,0.1)' : 'rgba(148,163,184,0.1)', color: item.priority === 'Mandatory' ? '#fca5a5' : item.priority === 'Recommended' ? '#fcd34d' : '#cbd5e1' }}>
                                {item.priority}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
