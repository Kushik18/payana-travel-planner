import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import '../Components/AllCss/Admin.css';
import '../Components/AllCss/AdminFeedbacks.css';

// Reusable avatar color generator
const getAvatarColor = (name) => {
  return 'rgba(255, 255, 255, 0.05)';
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setIsRefreshing(true);
      const response = await axiosInstance.get("/api/trip-places/all");
      // Only keep items that actually have a review
      const validFeedbacks = (response.data || []).filter(item => item.review != null && item.review.trim() !== "");
      setFeedbacks(validFeedbacks);
    } catch (error) {
      console.error("Failed to load feedbacks:", error);
      toast.error("Failed to load feedbacks.");
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const filteredFeedbacks = feedbacks.filter(item => {
    const query = searchQuery.toLowerCase();
    const userMatch = (item.user || "Anonymous").toLowerCase().includes(query);
    const districtMatch = (item.district || "").toLowerCase().includes(query);
    const categoryMatch = (item.category || "").toLowerCase().includes(query);
    const reviewMatch = (item.review || "").toLowerCase().includes(query);
    return userMatch || districtMatch || categoryMatch || reviewMatch;
  });

  return (
    <div className="adm-dash payana-theme">
      {/* 1. Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: 0, fontWeight: 400, color: 'var(--pcc-text-primary)' }}>User feedbacks</h1>
          <p style={{ margin: 0, marginTop: '8px', color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>Review and monitor user opinions and experiences.</p>
        </div>
        <button className="btn" onClick={fetchFeedbacks} disabled={isRefreshing} style={{ background: 'transparent', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)', fontSize: '13px' }}>
          {isRefreshing ? 'Refreshing...' : 'Refresh Feedbacks'}
        </button>
      </div>

      {/* 2. Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
        {[
          { label: 'Total Feedbacks', value: feedbacks.length },
          { label: 'Named Users', value: feedbacks.filter(f => f.user).length },
          { label: 'Anonymous', value: feedbacks.filter(f => !f.user).length }
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--pcc-bg-card)', padding: '16px', borderRadius: '6px', border: '1px solid var(--pcc-border)' }}>
            <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ color: 'var(--pcc-text-primary)', fontSize: '20px', fontWeight: '500' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* 3. Search Bar */}
      <div className="pcc-card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input 
          type="text" 
          className="pcc-input" 
          placeholder="Search by user, district, category, or review content..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {/* 4. Feedback Grid */}
      <div className="pcc-section-title">ALL FEEDBACKS</div>
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
           {[1, 2, 3].map(n => (
             <div key={n} className="pcc-card" style={{ height: '200px', opacity: 0.5 }}></div>
           ))}
        </div>
      ) : filteredFeedbacks.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredFeedbacks.map((item, idx) => {
            const isAnon = !item.user;
            const displayName = isAnon ? 'Anonymous User' : item.user;
            const avatarLetter = isAnon ? '?' : displayName.charAt(0).toUpperCase();
            
            return (
              <div key={idx} className="pcc-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    background: isAnon ? 'var(--pcc-bg-card)' : 'var(--pcc-accent)',
                    border: '1px solid var(--pcc-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isAnon ? 'var(--pcc-text-secondary)' : '#fff',
                    fontWeight: 'bold', fontSize: '18px'
                  }}>
                    {avatarLetter}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--pcc-text-primary)' }}>{displayName}</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--pcc-text-secondary)' }}>User Feedback</p>
                  </div>
                </div>
                
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--pcc-text-primary)', fontStyle: 'italic', lineHeight: '1.5' }}>"{item.review}"</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                  {item.district && (
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--pcc-text-secondary)', border: '1px solid var(--pcc-border)' }}>{item.district}</span>
                  )}
                  {item.category && (
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--pcc-text-secondary)', border: '1px solid var(--pcc-border)' }}>{item.category}</span>
                  )}
                  {!item.district && !item.category && (
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--pcc-text-secondary)', border: '1px solid var(--pcc-border)' }}>General App Feedback</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="pcc-card" style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'transparent', border: '1px solid var(--pcc-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pcc-neutral)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--pcc-text-primary)' }}>No feedbacks found</h3>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--pcc-text-secondary)' }}>We couldn't find any feedbacks matching your search criteria. Try adjusting your search query.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFeedbacks;
