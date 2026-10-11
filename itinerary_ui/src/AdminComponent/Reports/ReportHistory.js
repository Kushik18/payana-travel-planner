import React from 'react';
import { TbCheck } from 'react-icons/tb';

export default function ReportHistory() {
  const history = [
    { date: 'Today', events: ['User Report Generated', 'Travel Report Downloaded (PDF)', 'Festival Report Exported (Excel)'] },
    { date: 'Yesterday', events: ['Review Analytics Generated', 'Monthly Scheduled Backup Ran'] }
  ];

  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--pcc-text-primary)', marginBottom: '24px' }}>Report History</h2>
      <div className="pcc-card" style={{ padding: '32px' }}>
        {history.map((group, i) => (
          <div key={i} style={{ marginBottom: i === history.length - 1 ? 0 : '32px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--pcc-text-primary)', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{group.date}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {group.events.map((ev, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--pcc-success)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TbCheck size={14} />
                  </div>
                  <span style={{ fontSize: '14px', color: 'var(--pcc-text-secondary)' }}>{ev}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}