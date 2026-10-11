import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, LabelList } from 'recharts';
import CountUp from 'react-countup';
import '../Components/AllCss/Admin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faRoute, faMapMarkerAlt, faStar, faClock, faUndo, faComments, faHeart, faServer, faDatabase, faImage, faBookmark, faStarHalfAlt, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#00E6B8', '#EF4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'var(--adm-bg-panel)',
        border: '1px solid var(--adm-border-light)',
        borderRadius: '8px',
        padding: '12px 16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        color: 'var(--adm-text-primary)',
        transition: 'all 0.2s ease',
        transform: 'scale(1)',
        animation: 'scaleIn 0.2s ease-out',
        zIndex: 10
      }}>
        <div style={{ color: 'var(--adm-text-muted)', fontSize: '12px', marginBottom: '8px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color || entry.payload.fill || 'var(--adm-brand-primary)' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--adm-text-primary)' }}>
              {entry.value}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--adm-text-secondary)' }}>
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MOOD_PALETTES = [
  ['#FFBB28', '#FF8042'], // Amber to Coral
  ['#00C49F', '#00E6B8'], // Teal to Cyan
  ['#0088FE', '#3b82f6'], // Blue
  ['#AF19FF', '#8b5cf6'], // Purple
  ['#FF19A3', '#f43f5e']  // Pink/Rose
];

const RadialProgressRing = ({ value, max, label, colorStops, delay }) => {
  const [offset, setOffset] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(100 - (value / max) * 100);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, max, delay]);

  const r = 36;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - ((100 - offset) / 100) * circumference;
  
  const gradientId = `grad-${label.replace(/\s+/g, '-')}`;

  return (
    <div 
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'pointer', transform: isHovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.2s ease' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorStops[0]} />
            <stop offset="100%" stopColor={colorStops[1]} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--adm-border-light)" strokeWidth="8" />
        <circle 
          cx="50" cy="50" r={r} fill="none" stroke={`url(#${gradientId})`} strokeWidth="8" 
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out', filter: isHovered ? `drop-shadow(0 0 8px ${colorStops[1]}80)` : 'none' }} 
        />
      </svg>
      <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: isHovered ? 'var(--adm-text-primary)' : 'var(--adm-text-primary)', opacity: isHovered ? 1 : 0.9, transition: 'all 0.2s ease', lineHeight: 1 }}>{value}</div>
      </div>
      <div style={{ fontSize: '13px', color: isHovered ? 'var(--adm-text-primary)' : 'var(--adm-text-secondary)', marginTop: '8px', fontWeight: 500, transition: 'color 0.2s ease' }}>{label}</div>
      
      {isHovered && (
        <div style={{
          position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'var(--adm-bg-panel)', border: '1px solid var(--adm-border-light)',
          borderRadius: '8px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          color: 'var(--adm-text-primary)', zIndex: 10, animation: 'scaleIn 0.2s ease-out',
          whiteSpace: 'nowrap', pointerEvents: 'none'
        }}>
          <div style={{ color: 'var(--adm-text-muted)', fontSize: '11px', marginBottom: '6px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colorStops[1] }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--adm-text-primary)' }}>{value}</span>
            <span style={{ fontSize: '12px', color: 'var(--adm-text-secondary)' }}>({Math.round((value / max) * 100)}% of top)</span>
          </div>
        </div>
      )}
    </div>
  );
};

function Statistics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axiosInstance.get('/api/admin/analytics');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
        setError('Failed to load analytics data.');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="adm-dash payana-theme">
        <h3 style={{color: 'var(--pcc-text-primary)', padding: '20px'}}>Loading Analytics...</h3>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="adm-dash payana-theme">
        <h3 style={{color: 'var(--pcc-danger)', padding: '20px'}}>{error || 'No data available'}</h3>
      </div>
    );
  }

  const { overview, growth, categories, moods, destinations, engagement, systemHealth } = data;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} color="#ffc107" size="sm" style={{ marginRight: '2px' }} />);
    }
    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} color="#ffc107" size="sm" style={{ marginRight: '2px' }} />);
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} color="#444" size="sm" style={{ marginRight: '2px' }} />);
    }
    return stars;
  };

  const renderRankBadge = (rank) => {
    if (rank === 1) return <span style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)', color: '#FFD700', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid rgba(255, 215, 0, 0.4)' }}>#1</span>;
    if (rank === 2) return <span style={{ backgroundColor: 'rgba(192, 192, 192, 0.15)', color: '#C0C0C0', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid rgba(192, 192, 192, 0.4)' }}>#2</span>;
    if (rank === 3) return <span style={{ backgroundColor: 'rgba(205, 127, 50, 0.15)', color: '#CD7F32', padding: '4px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', border: '1px solid rgba(205, 127, 50, 0.4)' }}>#3</span>;
    return <span style={{ color: 'var(--pcc-text-secondary)', fontWeight: 'bold', padding: '4px 10px' }}>#{rank}</span>;
  };

  const renderTrend = (value, isPositive) => {
    const color = isPositive ? 'var(--pcc-success)' : 'var(--pcc-danger)';
    const icon = isPositive ? faArrowUp : faArrowDown;
    return (
      <span style={{ color, marginLeft: '4px', fontWeight: '600' }}>
        <FontAwesomeIcon icon={icon} size="sm" style={{ marginRight: '2px' }} />
        {value}
      </span>
    );
  };

  let growthSubtitle = "";
  if (growth && growth.length > 0) {
    const firstMonth = growth[0];
    const lastMonth = growth[growth.length - 1];
    const initialUsers = firstMonth.users || 1;
    const growthPercentage = Math.round(((lastMonth.users - initialUsers) / initialUsers) * 100);
    growthSubtitle = `${firstMonth.month} – ${lastMonth.month} · +${growthPercentage > 0 ? growthPercentage : 0}% growth`;
  }

  return (
    <div className="adm-dash payana-theme">
      <style>{`
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: 0, fontWeight: 400, color: 'var(--pcc-text-primary)' }}>Travel analytics dashboard</h1>
          <p style={{ margin: 0, marginTop: '8px', color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>Advanced user and platform insights.</p>
        </div>
      </div>

      {/* Row 1 — KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {[
          { label: 'Total Users', value: overview.totalUsers, emptyText: 'Growing soon!' },
          { label: 'Total Trips', value: overview.totalItineraries, emptyText: 'Waiting for first trip' },
          { label: 'Places Database', value: overview.totalPlaces, emptyText: '' },
          { label: 'Total Reviews', value: overview.totalReviews, emptyText: 'Be the first!' }
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--pcc-bg-card)', padding: '16px', borderRadius: '6px', border: '1px solid var(--pcc-border)' }}>
            <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ color: 'var(--pcc-text-primary)', fontSize: '20px', fontWeight: '500' }}>
               {stat.value === 0 ? '0' : <CountUp end={stat.value} duration={2} />}
            </div>
            {stat.value === 0 && stat.emptyText && <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', marginTop: '4px' }}>{stat.emptyText}</div>}
          </div>
        ))}
      </div>

      {/* Row 2 — User Growth */}
      <div className="pcc-section-title">GROWTH & ENGAGEMENT</div>
      <div className="pcc-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--pcc-text-primary)', margin: 0 }}>User Registrations Growth</h3>
            <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '13px', marginTop: '5px' }}>{growthSubtitle}</div>
          </div>
          {growth && growth.length > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--pcc-text-primary)' }}><CountUp end={growth[growth.length - 1].users} duration={2} /></div>
              <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px' }}>Total Users</div>
            </div>
          )}
        </div>
        <div style={{ width: '100%', height: 300, paddingRight: '10px' }}>
          <ResponsiveContainer>
            <AreaChart data={growth}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0088FE" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} opacity={0.1} />
              <XAxis dataKey="month" stroke="var(--pcc-neutral)" axisLine={false} tickLine={false} tick={{ fill: 'var(--pcc-neutral)' }} />
              <YAxis stroke="var(--pcc-neutral)" axisLine={false} tickLine={false} tick={{ fill: 'var(--pcc-neutral)' }} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#0088FE" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorUsers)" 
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                animationDuration={1500}
                dot={(props) => {
                  const { cx, cy, index } = props;
                  const isLast = index === growth.length - 1;
                  if (isLast) {
                    return <circle key={`dot-${index}`} cx={cx} cy={cy} r={5} stroke="#fff" strokeWidth={2} fill="#0088FE" />;
                  }
                  return null;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3 — Categories & Moods */}
      <div className="pcc-section-title">CONTENT PERFORMANCE</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="pcc-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--pcc-text-primary)', margin: '0 0 20px 0' }}>Travel Categories</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={[...categories].sort((a, b) => b.value - a.value)} layout="vertical" margin={{ top: 5, right: 40, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCategories" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--pcc-accent)" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#00C49F" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" horizontal={true} vertical={false} opacity={0.1} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="var(--pcc-neutral)" width={100} axisLine={false} tickLine={false} tick={{ fill: 'var(--pcc-neutral)' }} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="value" fill="url(#colorCategories)" radius={[0, 20, 20, 0]} barSize={25} animationDuration={1500}>
                  <LabelList dataKey="value" position="right" fill="var(--pcc-text-secondary)" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pcc-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--pcc-text-primary)', margin: '0' }}>Top Travel Moods</h3>
          <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '13px', marginBottom: '24px', marginTop: '4px' }}>Ranked by saved trips this month</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '10px 0' }}>
            {[...moods].sort((a, b) => b.usage - a.usage).map((mood, idx, arr) => (
              <RadialProgressRing 
                key={mood.mood}
                value={mood.usage}
                max={arr[0].usage}
                label={mood.mood}
                colorStops={MOOD_PALETTES[idx % MOOD_PALETTES.length]}
                delay={idx * 100}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 4 & 5 Container */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'stretch', marginBottom: '32px' }}>
        {/* Row 4 — Popular Destinations */}
        <div className="pcc-card" style={{ padding: '20px', flex: '2 1 500px', display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--pcc-text-primary)', margin: '0 0 20px 0' }}>Popular Destinations</h3>
          <table className="table table-borderless table-hover pcc-table" style={{ background: 'transparent', margin: 0 }}>
            <thead>
              <tr style={{ color: 'var(--pcc-text-secondary)', fontSize: '0.85rem', borderBottom: '1px solid var(--pcc-border)' }}>
                <th style={{ width: '10%' }}>Rank</th>
                <th style={{ width: '50%' }}>Place</th>
                <th style={{ textAlign: 'right' }}>Saves</th>
                <th style={{ textAlign: 'right' }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((dest) => (
                <tr key={dest.rank} style={{ verticalAlign: 'middle' }}>
                  <td>{renderRankBadge(dest.rank)}</td>
                  <td style={{ color: 'var(--pcc-text-primary)', fontWeight: 500 }}>{dest.place}</td>
                  <td style={{ textAlign: 'right', color: 'var(--pcc-text-primary)' }}>
                    <FontAwesomeIcon icon={faBookmark} color="var(--pcc-accent)" size="sm" style={{ marginRight: '6px' }} />
                    {dest.saves}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--pcc-text-primary)' }}>
                    <span style={{ marginRight: '8px', fontWeight: 'bold' }}>{dest.rating.toFixed(1)}</span>
                    {renderStars(dest.rating)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {destinations.length > 0 && destinations.length < 5 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', color: 'var(--pcc-neutral)', fontSize: '13px', textAlign: 'center', gap: '16px', minHeight: '150px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'transparent', border: '1px solid var(--pcc-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" style={{ opacity: 0.4 }} />
              </div>
              <div style={{ maxWidth: '250px', lineHeight: 1.5 }}>
                More destinations will appear here as users continue to save their trips.
              </div>
            </div>
          )}
        </div>

        {/* Row 5 & Extra — User Engagement & System Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '1 1 300px' }}>
          
          <div className="pcc-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--pcc-text-primary)', margin: '0 0 20px 0' }}>User Engagement</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 15px' }}>
              
              <div style={{ textAlign: 'center', padding: '18px 15px', background: 'transparent', borderRadius: '10px', border: '1px solid var(--pcc-border)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(0, 136, 254, 0.15)', marginBottom: '12px' }}>
                  <FontAwesomeIcon icon={faClock} color="#0088FE" size="lg" />
                </div>
                <h4 style={{ color: 'var(--pcc-text-primary)', margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold' }}>{engagement.avgSessionTime}</h4>
                <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', opacity: 0.85 }}>
                  Avg Session {renderTrend("2m", true)}
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '18px 15px', background: 'transparent', borderRadius: '10px', border: '1px solid var(--pcc-border)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(0, 196, 159, 0.15)', marginBottom: '12px' }}>
                  <FontAwesomeIcon icon={faUndo} color="#00C49F" size="lg" />
                </div>
                <h4 style={{ color: 'var(--pcc-text-primary)', margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold' }}>{engagement.returnRate}</h4>
                <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', opacity: 0.85 }}>
                  Return Rate {renderTrend("1%", false)}
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '18px 15px', background: 'transparent', borderRadius: '10px', border: '1px solid var(--pcc-border)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(255, 187, 40, 0.15)', marginBottom: '12px' }}>
                  <FontAwesomeIcon icon={faComments} color="#FFBB28" size="lg" />
                </div>
                <h4 style={{ color: 'var(--pcc-text-primary)', margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold' }}>{engagement.reviewsPerUser}</h4>
                <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', opacity: 0.85 }}>
                  Reviews/User {renderTrend("0.3", true)}
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '18px 15px', background: 'transparent', borderRadius: '10px', border: '1px solid var(--pcc-border)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(255, 128, 66, 0.15)', marginBottom: '12px' }}>
                  <FontAwesomeIcon icon={faHeart} color="#FF8042" size="lg" />
                </div>
                <h4 style={{ color: 'var(--pcc-text-primary)', margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold' }}>{engagement.savedTripsPerUser}</h4>
                <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', opacity: 0.85 }}>
                  Saves/User {renderTrend("1.1", true)}
                </div>
              </div>

            </div>
          </div>

          <div className="pcc-card" style={{ padding: '20px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '24px', right: '20px', fontSize: '11px', color: 'var(--pcc-text-secondary)' }}>Last checked: Just now</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--pcc-text-primary)', margin: '0 0 20px 0' }}>System Health</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--pcc-text-primary)' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--pcc-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(0, 196, 159, 0.15)', marginRight: '12px' }}>
                    <FontAwesomeIcon icon={faDatabase} color="#00C49F" size="sm" />
                  </div>
                  <span style={{ fontSize: '14px' }}>Database Status</span>
                </div>
                <span style={{ backgroundColor: 'rgba(0, 196, 159, 0.15)', color: '#00C49F', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', border: '1px solid rgba(0, 196, 159, 0.3)' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#00C49F', borderRadius: '50%', marginRight: '6px' }}></span>
                  {systemHealth.databaseStatus}
                </span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--pcc-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(0, 136, 254, 0.15)', marginRight: '12px' }}>
                    <FontAwesomeIcon icon={faServer} color="#0088FE" size="sm" />
                  </div>
                  <span style={{ fontSize: '14px' }}>API Status</span>
                </div>
                <span style={{ backgroundColor: 'rgba(0, 136, 254, 0.15)', color: '#0088FE', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', border: '1px solid rgba(0, 136, 254, 0.3)' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#0088FE', borderRadius: '50%', marginRight: '6px' }}></span>
                  {systemHealth.apiStatus}
                </span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--pcc-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255, 187, 40, 0.15)', marginRight: '12px' }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} color="#FFBB28" size="sm" />
                  </div>
                  <span style={{ fontSize: '14px' }}>Total Districts</span>
                </div>
                <span style={{ fontWeight: 'bold', color: 'var(--pcc-text-primary)' }}>{systemHealth.totalDistricts}</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(0, 230, 184, 0.15)', marginRight: '12px' }}>
                    <FontAwesomeIcon icon={faImage} color="#00E6B8" size="sm" />
                  </div>
                  <span style={{ fontSize: '14px' }}>Total Images</span>
                </div>
                <span style={{ fontWeight: 'bold', color: 'var(--pcc-text-primary)' }}>{systemHealth.totalImages}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
