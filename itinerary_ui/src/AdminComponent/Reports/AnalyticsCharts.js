import React from 'react';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const data = Array.from({ length: 12 }, (_, i) => ({ name: `M${i+1}`, value: Math.floor(Math.random() * 100) + 20 }));
const barData = [
  { name: 'Coorg', val: 400 }, { name: 'Mysuru', val: 300 }, 
  { name: 'Hampi', val: 200 }, { name: 'Chikkamagaluru', val: 280 }
];

export default function AnalyticsCharts({ reportType }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
      <div style={{ flex: '1 1 400px', backgroundColor: 'var(--pcc-bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--pcc-border)' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--pcc-text-secondary)', margin: '0 0 16px 0' }}>Growth Trends</h4>
        <div style={{ height: '220px', width: '100%' }}>
          <ResponsiveContainer>
            <AreaChart data={data}>
              <XAxis dataKey="name" hide />
              <Tooltip contentStyle={{ backgroundColor: '#1A1D23', border: 'none', color: '#fff' }} />
              <Area type="monotone" dataKey="value" stroke="var(--pcc-accent)" fill="var(--pcc-accent)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div style={{ flex: '1 1 300px', backgroundColor: 'var(--pcc-bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--pcc-border)' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--pcc-text-secondary)', margin: '0 0 16px 0' }}>Distribution</h4>
        <div style={{ height: '220px', width: '100%' }}>
          <ResponsiveContainer>
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9AA0AC' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1A1D23', border: 'none' }} />
              <Bar dataKey="val" fill="var(--pcc-accent)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}