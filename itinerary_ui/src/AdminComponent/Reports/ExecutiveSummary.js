import React from 'react';
import { motion } from 'framer-motion';

export default function ExecutiveSummary({ metrics, setActiveReportType }) {
  const cards = [
    { title: 'Users', value: metrics.isLoading ? '...' : metrics.users, trend: '▲ +240 Today', type: 'User Analytics' },
    { title: 'Trips Generated', value: metrics.isLoading ? '...' : metrics.trips, trend: '▲ +7.5%', type: 'Travel Analytics' },
    { title: 'Destinations', value: metrics.isLoading ? '...' : metrics.destinations, trend: '▲ +12', type: 'Destination Analytics' },
    { title: 'Reviews', value: '4,102', trend: '▲ +110', type: 'Review Analytics' },
    { title: 'Avg Rating', value: '4.6', trend: '▲ +0.2', type: 'Review Analytics' },
    { title: 'System Health', value: '99.8%', trend: '🟢', type: 'Platform Health' }
  ];

  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--pcc-text-primary)', marginBottom: '24px' }}>Executive Summary</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
        {cards.map((card, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -4, borderColor: 'var(--rc-accent-blue)' }} 
            onClick={() => {
              setActiveReportType(card.type);
              document.getElementById('report-builder-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="pcc-card" 
            style={{ padding: '20px', cursor: 'pointer', transition: 'border-color 0.3s' }}
          >
            <div style={{ fontSize: '13px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>{card.title}</div>
            <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--pcc-text-primary)', marginBottom: '8px' }}>{card.value}</div>
            <div style={{ fontSize: '12px', color: card.trend.includes('🟢') || card.trend.includes('▲') ? 'var(--pcc-success)' : 'var(--pcc-text-secondary)' }}>{card.trend}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}