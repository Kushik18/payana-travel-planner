import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ScheduledReports() {
  const [schedules, setSchedules] = useState([
    { id: 1, name: 'Weekly User Report', freq: 'Every Monday', next: '29 Jun 2026, 09:00 AM', last: '22 Jun 2026', active: true },
    { id: 2, name: 'Monthly Tourism Update', freq: 'Every Month', next: '01 Jul 2026, 09:00 AM', last: '01 Jun 2026', active: true }
  ]);

  const toggleStatus = (id) => {
    setSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
  };

  const handleRunNow = (name) => {
    alert(`Running ${name} immediately...`);
  };

  const handleEdit = (name) => {
    alert(`Editing configuration for ${name}...`);
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--pcc-text-primary)', marginBottom: '24px' }}>Scheduled Reports</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {schedules.map((s) => (
          <motion.div key={s.id} whileHover={{ y: -4, borderColor: 'var(--pcc-accent)' }} className="pcc-card" style={{ padding: '24px', transition: 'border-color 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--pcc-text-primary)', marginBottom: '4px' }}>{s.name}</div>
                <div style={{ fontSize: '14px', color: 'var(--pcc-text-secondary)' }}>{s.freq}</div>
              </div>
              <div style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, backgroundColor: s.active ? 'var(--pcc-success)' : 'var(--pcc-caution)', color: '#fff' }}>
                {s.active ? 'Active' : 'Paused'}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--pcc-text-secondary)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Next Run:</span> 
                <strong style={{color: s.active ? 'var(--pcc-text-primary)' : 'var(--pcc-text-secondary)'}}>
                  {s.active ? s.next : '---'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Last Run:</span> 
                <span>{s.last}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <motion.button 
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(s.name)}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--pcc-text-primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
              >
                Edit
              </motion.button>
              
              <motion.button 
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleStatus(s.id)}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--pcc-text-primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
              >
                {s.active ? 'Pause' : 'Resume'}
              </motion.button>
              
              <motion.button 
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRunNow(s.name)}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', backgroundColor: 'var(--pcc-accent)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
              >
                Run Now
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}