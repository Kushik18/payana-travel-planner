import React from 'react';
import { TbFileDescription, TbEye, TbDownload, TbCopy, TbTrash } from 'react-icons/tb';

export default function SavedReports() {
  const reports = [
    { name: 'Monthly User Analytics', date: '25 Jun 2026', size: '2.4 MB', expires: '25 Jul 2026' },
    { name: 'Q2 Travel Destination Report', date: '24 Jun 2026', size: '1.1 MB', expires: '24 Jul 2026' },
    { name: 'Festival Revenue Summary', date: '20 Jun 2026', size: '540 KB', expires: '20 Jul 2026' }
  ];

  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--pcc-text-primary)', marginBottom: '24px' }}>Saved Reports</h2>
      <div className="pcc-card" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--pcc-border)', color: 'var(--pcc-text-secondary)', textAlign: 'left' }}>
              <th style={{ padding: '16px 12px' }}>Report</th>
              <th style={{ padding: '16px 12px' }}>Created</th>
              <th style={{ padding: '16px 12px' }}>Size</th>
              <th style={{ padding: '16px 12px' }}>Expires</th>
              <th style={{ padding: '16px 12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px 12px', color: 'var(--pcc-text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TbFileDescription style={{ color: 'var(--pcc-accent)' }} size={18} /> {r.name}
                </td>
                <td style={{ padding: '16px 12px', color: 'var(--pcc-text-secondary)' }}>{r.date}</td>
                <td style={{ padding: '16px 12px', color: 'var(--pcc-text-secondary)' }}>{r.size}</td>
                <td style={{ padding: '16px 12px', color: 'var(--pcc-text-secondary)' }}>{r.expires}</td>
                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', color: 'var(--pcc-text-secondary)' }}>
                    <TbEye style={{ cursor: 'pointer' }} size={20} title="View" />
                    <TbDownload style={{ cursor: 'pointer' }} size={20} title="Download" />
                    <TbCopy style={{ cursor: 'pointer' }} size={20} title="Duplicate" />
                    <TbTrash style={{ cursor: 'pointer', color: '#ef4444' }} size={20} title="Delete" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}