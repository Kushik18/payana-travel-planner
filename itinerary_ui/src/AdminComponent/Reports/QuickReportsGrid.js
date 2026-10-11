import React from 'react';
import { motion } from 'framer-motion';
import { TbUsers, TbMapPin, TbStar, TbMoneybag, TbChartBar, TbServer } from 'react-icons/tb';

export default function QuickReportsGrid({ onGenerate, onPreview, setActiveReportType }) {
  const reports = [
    { title: 'User Analytics', icon: TbUsers, desc: 'Analyze user registrations, active sessions, and growth.' },
    { title: 'Travel Analytics', icon: TbMapPin, desc: 'Detailed breakdown of generated trips and popular routes.' },
    { title: 'Review Analytics', icon: TbStar, desc: 'Monitor average ratings and review sentiment across places.' },
    { title: 'Revenue Analytics', icon: TbMoneybag, desc: 'Platform revenue, bookings, and financial projections.' },
    { title: 'AI Planner', icon: TbChartBar, desc: 'Usage metrics for the AI itinerary generation engine.' },
    { title: 'Platform Health', icon: TbServer, desc: 'API status, database health, and storage utilization.' }
  ];

  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--pcc-text-primary)', marginBottom: '24px' }}>Quick Reports</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {reports.map((report, i) => {
          const Icon = report.icon;
          return (
            <motion.div key={i} whileHover={{ y: -4, borderColor: 'var(--pcc-accent)' }} className="pcc-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Icon size={24} style={{ color: 'var(--pcc-accent)' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--pcc-text-primary)', margin: 0 }}>{report.title}</h3>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--pcc-text-secondary)', marginBottom: '24px', flex: 1 }}>{report.desc}</p>
              
              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--pcc-border)', paddingTop: '16px' }}>
                <button 
                  className="btn btn-sm" 
                  style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)' }}
                  onClick={() => {
                    setActiveReportType(report.title);
                    onGenerate({ type: report.title });
                  }}
                >
                  Generate
                </button>
                <button 
                  className="btn btn-sm" 
                  style={{ flex: 1, backgroundColor: 'var(--pcc-bg-page)', border: '1px solid var(--pcc-border)', color: 'var(--pcc-accent)' }}
                  onClick={() => {
                    setActiveReportType(report.title);
                    onGenerate({ type: report.title });
                    onPreview();
                  }}
                >
                  View Report
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}