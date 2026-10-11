import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
// Lazy load charts to keep initial dashboard render fast
const AnalyticsCharts = lazy(() => import('./AnalyticsCharts'));

export default function ReportPreview({ report, metrics }) {
  // Determine which data to show based on report type
  let primaryLabel = 'Total Records';
  let primaryValue = 0;
  let recentRecords = [];
  
  if (report.type.includes('User')) {
    primaryLabel = 'Total Users';
    primaryValue = metrics.users;
    recentRecords = metrics.rawUsers.slice(0, 5).map(u => ({ id: u.id || 'U-'+Math.floor(Math.random()*1000), name: u.username || u.name || 'User', date: 'Recent' }));
  } else if (report.type.includes('Travel')) {
    primaryLabel = 'Trips Generated';
    primaryValue = metrics.trips;
    recentRecords = metrics.rawTrips.slice(0, 5).map(t => ({ id: t.id || 'T-'+Math.floor(Math.random()*1000), name: t.placeName || t.title || 'Trip', date: 'Recent' }));
  } else if (report.type.includes('Destination')) {
    primaryLabel = 'Destinations Listed';
    primaryValue = metrics.destinations;
    recentRecords = metrics.rawDestinations.slice(0, 5).map(d => ({ id: d.id || 'D-'+Math.floor(Math.random()*1000), name: d.name || d.title || 'Place', date: 'Recent' }));
  } else if (report.type.includes('Festival')) {
    primaryLabel = 'Active Festivals';
    primaryValue = metrics.festivals;
    recentRecords = metrics.rawFestivals.slice(0, 5).map(f => ({ id: f.id || 'F-'+Math.floor(Math.random()*1000), name: f.name || f.title || 'Festival', date: 'Recent' }));
  }

  return (
    <div id="report-preview-section" style={{ marginBottom: '48px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--pcc-text-primary)', marginBottom: '24px' }}>Live Report Preview</h2>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pcc-card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--pcc-text-primary)', margin: '0 0 8px 0' }}>{report.type}</h3>
            <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '14px' }}>
              Generated on {report.generatedAt.toLocaleString()} • Filters: {report.district}, {report.category}
            </div>
          </div>
          <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, backgroundColor: 'var(--pcc-success)', color: '#fff' }}>Live Data</span>
        </div>

        {/* Dynamic KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="pcc-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>{primaryLabel}</div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: 'var(--pcc-text-primary)' }}>{primaryValue || 0}</div>
          </div>
          <div className="pcc-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>System Health</div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#10b981' }}>99.8%</div>
          </div>
          <div className="pcc-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Top Performing</div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: 'var(--pcc-text-primary)' }}>Active</div>
          </div>
        </div>

        {/* Charts Container (Lazy Loaded) */}
        <Suspense fallback={<div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pcc-text-secondary)' }}>Loading Charts...</div>}>
          <AnalyticsCharts reportType={report.type} metrics={metrics} />
        </Suspense>

        {/* Recent Records Table */}
        <div style={{ marginTop: '40px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--pcc-text-primary)', marginBottom: '16px' }}>Recent Records</h4>
          {recentRecords.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--pcc-border)', color: 'var(--pcc-text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>ID</th>
                    <th style={{ padding: '12px' }}>Name / Record</th>
                    <th style={{ padding: '12px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.map((rec, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', color: 'var(--pcc-text-primary)' }}>{rec.id}</td>
                      <td style={{ padding: '12px', color: 'var(--pcc-text-primary)' }}>{rec.name}</td>
                      <td style={{ padding: '12px', color: 'var(--pcc-text-secondary)' }}>{rec.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--pcc-text-secondary)', backgroundColor: 'var(--pcc-bg-page)', borderRadius: '8px', border: '1px solid var(--pcc-border)' }}>
              No recent records found for this report type.
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
}
