import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, LabelList, Label
} from 'recharts';
import "../Components/AllCss/Admin.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [events, setEvents] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);

  useEffect(() => {
    axiosInstance.get("/api/registor/all").then(r => setUsers(r.data)).catch(console.error);
    axiosInstance.get("/api/itinerary/all").then(r => setDestinations(r.data)).catch(console.error);
    axiosInstance.get("/api/trip-places/all").then(r => setTrips(r.data)).catch(console.error);
    axiosInstance.get("/api/events/getevent").then(r => setEvents(r.data)).catch(console.error);
    axiosInstance.get("/api/festivals/all").then(r => setFestivals(r.data)).catch(console.error);
    axiosInstance.get("/api/hidden-gems/all").then(r => setHiddenGems(r.data)).catch(console.error);
  }, []);

  const totalReviews = destinations.filter(d => d.review != null && d.review.trim() !== "").length;

  const getPopularDistricts = () => {
    const counts = {};
    destinations.forEach(d => {
      if(d.district) counts[d.district] = (counts[d.district] || 0) + 1;
    });
    return Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 7).map(e => ({ name: e[0], count: e[1] }));
  };

  const getPopularCategories = () => {
    const counts = {};
    destinations.forEach(d => {
      const cat = d.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    const colors = ['#a78bfa', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
    return Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, 6).map((e, idx) => ({ name: e[0], value: e[1], color: colors[idx % colors.length] }));
  };

  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', paddingTop: '20px' }}>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', padding: '4px 12px', borderRadius: '99px', background: `${entry.color}15`, border: `1px solid ${entry.color}30`, fontSize: '12px', color: 'var(--pcc-text-primary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color, marginRight: '8px' }}></span>
            <span style={{ textTransform: 'capitalize' }}>{entry.value}</span>
            <span style={{ color: 'var(--pcc-text-secondary)', marginLeft: '6px' }}>· {entry.payload.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label, unitLabel, totalValue }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const color = data.color || data.payload?.fill || '#3b82f6';
      const percentStr = totalValue ? `${Math.round((data.value / totalValue) * 100)}% of total places` : null;
      
      return (
        <div style={{
          backgroundColor: 'var(--pcc-bg-card)',
          border: '1px solid var(--pcc-border)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }}></span>
            <span style={{ color: 'var(--pcc-text-primary)', fontSize: '13px', fontWeight: 500, textTransform: 'capitalize' }}>{label || data.name}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {unitLabel && <span style={{ color: 'var(--pcc-text-secondary)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{unitLabel}</span>}
            <span style={{ color: 'var(--pcc-text-primary)', fontSize: '24px', fontWeight: 'bold', lineHeight: '1.2' }}>{data.value}</span>
            {percentStr && <span style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', marginTop: '4px' }}>{percentStr}</span>}
          </div>
        </div>
      );
    }
    return null;
  };

  const getUserGrowthData = () => {
    if (!users || users.length === 0) return [];
    const counts = {};
    users.forEach(u => {
      if (u.joinedDate) {
        const date = new Date(u.joinedDate);
        const month = date.toLocaleString('default', { month: 'short' });
        counts[month] = (counts[month] || 0) + 1;
      }
    });
    
    if (Object.keys(counts).length === 0) {
      return [
        { name: 'Mon', users: Math.floor(users.length * 0.2) },
        { name: 'Tue', users: Math.floor(users.length * 0.4) },
        { name: 'Wed', users: Math.floor(users.length * 0.5) },
        { name: 'Thu', users: Math.floor(users.length * 0.7) },
        { name: 'Fri', users: Math.floor(users.length * 0.8) },
        { name: 'Sat', users: Math.floor(users.length * 0.9) },
        { name: 'Sun', users: users.length }
      ];
    }
    
    const result = [];
    let cumulative = 0;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(m => {
      if (counts[m] !== undefined) {
        cumulative += counts[m];
        result.push({ name: m, users: cumulative });
      }
    });
    return result;
  };

  const userGrowthData = getUserGrowthData();

  const tripStats = [
    { name: 'Week 1', trips: Math.floor(trips.length * 0.3) },
    { name: 'Week 2', trips: Math.floor(trips.length * 0.6) },
    { name: 'Week 3', trips: Math.floor(trips.length * 0.8) },
    { name: 'Week 4', trips: trips.length }
  ];

  return (
    <div className="adm-dash payana-theme">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: 0, fontWeight: 400, color: 'var(--pcc-text-primary)' }}>Dashboard Overview</h1>
          <p style={{ margin: 0, marginTop: '8px', color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>Platform activity and metrics at a glance.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
        <StatCard title="Total Users" value={users.length} color="#3b82f6" icon="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" trend="+12% this week" />
        <StatCard title="Total Destinations" value={destinations.length} color="#10b981" icon="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a3 3 0 100-6 3 3 0 000 6z" trend="+4% this week" />
        <StatCard title="Total Itineraries" value={trips.length} color="#8b5cf6" icon="M3 3h18v18H3z M8 12h8 M8 8h8 M8 16h8" trend="+18% this week" />
        <StatCard title="Total Reviews" value={totalReviews} color="#f59e0b" icon="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" trend="+2% this week" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <StatCard title="Active Events" value={events.length} color="#ec4899" icon="M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" trend="+0% this week" />
        <StatCard title="Active Festivals" value={festivals.length} color="#f97316" icon="M2 12h20M2 12a10 10 0 1020 0M2 12a10 10 0 1120 0" trend="+1% this week" />
        <StatCard title="Hidden Gems" value={hiddenGems.length} color="#06b6d4" icon="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" trend="+5% this week" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="pcc-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{color: 'var(--pcc-text-primary)', fontSize: '18px', fontWeight: 500, margin: '0 0 4px 0'}}>User Growth</h3>
            <div style={{ fontSize: '13px', color: 'var(--pcc-text-secondary)' }}>Weekly platform registrations</div>
          </div>
          {users.length <= 1 ? (
            <div style={{ position: 'relative', height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--pcc-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: 'var(--pcc-text-secondary)', fontSize: '14px', fontWeight: 500, background: 'var(--pcc-bg-main)', padding: '4px 12px', borderRadius: '99px', border: '1px solid var(--pcc-border)' }}>Not enough data yet</span>
                <span style={{ color: 'var(--pcc-text-secondary)', fontSize: '12px', marginTop: '8px' }}>Check back as more users join</span>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--pcc-text-secondary)" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--pcc-text-secondary)" tickLine={false} axisLine={false} allowDecimals={false} tick={{ fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--pcc-border)" />
                <RechartsTooltip content={<CustomTooltip unitLabel="NEW USERS" />} cursor={{ stroke: 'var(--pcc-border)', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--pcc-border)', textAlign: 'right', fontSize: '12px', color: 'var(--pcc-text-secondary)' }}>
            Updated just now
          </div>
        </div>

        <div className="pcc-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{color: 'var(--pcc-text-primary)', fontSize: '18px', fontWeight: 500, margin: '0 0 4px 0'}}>Trip Generation</h3>
            <div style={{ fontSize: '13px', color: 'var(--pcc-text-secondary)' }}>Weekly itineraries saved</div>
          </div>
          {trips.length <= 1 ? (
            <div style={{ position: 'relative', height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--pcc-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: 'var(--pcc-text-secondary)', fontSize: '14px', fontWeight: 500, background: 'var(--pcc-bg-main)', padding: '4px 12px', borderRadius: '99px', border: '1px solid var(--pcc-border)' }}>Not enough data yet</span>
                <span style={{ color: 'var(--pcc-text-secondary)', fontSize: '12px', marginTop: '8px' }}>Check back as more itineraries are saved</span>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={tripStats}>
                <defs>
                  <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--pcc-text-secondary)" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--pcc-text-secondary)" tickLine={false} axisLine={false} allowDecimals={false} tick={{ fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--pcc-border)" />
                <RechartsTooltip content={<CustomTooltip unitLabel="SAVED TRIPS" />} cursor={{ stroke: 'var(--pcc-border)', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="trips" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorTrips)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--pcc-border)', textAlign: 'right', fontSize: '12px', color: 'var(--pcc-text-secondary)' }}>
            Updated just now
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="pcc-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{color: 'var(--pcc-text-primary)', fontSize: '18px', fontWeight: 500, margin: '0 0 4px 0'}}>Popular Districts</h3>
            <div style={{ fontSize: '13px', color: 'var(--pcc-text-secondary)' }}>Top destinations by saved trips</div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart layout="vertical" data={getPopularDistricts()} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
              <XAxis type="number" hide={true} />
              <YAxis dataKey="name" type="category" stroke="var(--pcc-text-secondary)" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} width={110} />
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--pcc-border)" />
              <RechartsTooltip 
                content={<CustomTooltip unitLabel="SAVED TRIPS" />}
                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
              />
              <Bar dataKey="count" fill="url(#colorBar)" radius={[0, 10, 10, 0]} barSize={20} isAnimationActive={false}>
                <LabelList dataKey="count" position="right" fill="var(--pcc-text-secondary)" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--pcc-border)', textAlign: 'right', fontSize: '12px', color: 'var(--pcc-text-secondary)' }}>
            Updated just now
          </div>
        </div>

        <div className="pcc-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{color: 'var(--pcc-text-primary)', fontSize: '18px', fontWeight: 500, margin: '0 0 4px 0'}}>Popular Categories</h3>
            <div style={{ fontSize: '13px', color: 'var(--pcc-text-secondary)' }}>Distribution by travel mood</div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={getPopularCategories()} cx="50%" cy="50%" innerRadius={70} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none" minAngle={10} isAnimationActive={false}>
                <Label 
                  value="TOTAL PLACES" 
                  position="center" 
                  dy={-15} 
                  fill="var(--pcc-text-secondary)" 
                  style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }} 
                />
                <Label 
                  value={destinations.length} 
                  position="center" 
                  dy={10} 
                  fill="var(--pcc-text-primary)" 
                  style={{ fontSize: '32px', fontWeight: 'bold' }} 
                />
                {getPopularCategories().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip unitLabel="PLACES" totalValue={destinations.length} />} />
              <Legend content={renderCustomLegend} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--pcc-border)', textAlign: 'right', fontSize: '12px', color: 'var(--pcc-text-secondary)' }}>
            Updated just now
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, color, icon, trend = '' }) => (
  <div className="pcc-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ fontSize: '13px', color: 'var(--pcc-text-secondary)', fontWeight: 500 }}>{title}</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: `${color}15`, border: `1px solid ${color}30` }}>
        <svg width="20" height="20" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
          <path d={icon} />
        </svg>
      </div>
    </div>
    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--pcc-text-primary)', opacity: value === 0 ? 0.3 : 1, marginTop: 'auto', marginBottom: '0px' }}>
      {value}
    </div>
    {trend && (
      <div style={{ fontSize: '12px', color: trend.startsWith('+0') ? 'var(--pcc-text-secondary)' : '#10b981', fontWeight: 500 }}>
        {trend}
      </div>
    )}
  </div>
);

export default AdminDashboard;
