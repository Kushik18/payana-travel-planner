import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbFilter, TbChevronDown, TbChevronUp } from 'react-icons/tb';

const CustomSelect = ({ value, onChange, options, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        className="pcc-input" 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', height: '40px', userSelect: 'none' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        <TbChevronDown style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--pcc-text-secondary)', flexShrink: 0, marginLeft: '8px' }} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -5 }} 
            transition={{ duration: 0.15 }}
            style={{ 
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px', 
              background: 'var(--pcc-bg-card)', border: '1px solid var(--pcc-border)', 
              borderRadius: '8px', zIndex: 50, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              maxHeight: '220px', overflowY: 'auto'
            }}
          >
            {options.map((opt, idx) => (
              <div 
                key={opt}
                onClick={() => { onChange({ target: { name, value: opt } }); setIsOpen(false); }}
                style={{ 
                  padding: '10px 16px', cursor: 'pointer', 
                  color: value === opt ? 'var(--pcc-accent)' : 'var(--pcc-text-primary)',
                  background: value === opt ? 'rgba(108, 99, 255, 0.1)' : 'transparent',
                  fontSize: '14px', 
                  borderBottom: idx === options.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => { if (value !== opt) e.currentTarget.style.background = 'var(--pcc-bg-main)' }}
                onMouseLeave={(e) => { if (value !== opt) e.currentTarget.style.background = 'transparent' }}
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ReportBuilder({ activeReportType, setActiveReportType, onGenerate, onPreview }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    type: activeReportType, dateFrom: '', dateTo: '', district: 'All Districts', category: 'All Categories',
    rating: 'All Ratings', userType: 'All Users', mood: 'All Moods', status: 'All Statuses'
  });

  // Sync state if activeReportType changes externally
  useEffect(() => {
    setFilters(prev => ({ ...prev, type: activeReportType }));
  }, [activeReportType]);

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleGen = () => {
    setActiveReportType(filters.type);
    onGenerate(filters);
  };

  return (
    <div id="report-builder-section" style={{ marginBottom: '48px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 500, color: 'var(--pcc-text-primary)', marginBottom: '24px' }}>Custom Report Builder</h2>
      
      <div className="pcc-card" style={{ padding: '32px' }}>
        {/* Basic Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <div>
            <div className="rc-label" style={{ marginBottom: '8px' }}>Report Type</div>
            <CustomSelect 
              name="type" 
              value={filters.type} 
              onChange={handleChange} 
              options={['User Analytics', 'Travel Analytics', 'Destination Analytics', 'Review Analytics', 'Festival Analytics', 'Revenue Analytics', 'AI Planner']} 
            />
          </div>
          <div>
            <div className="rc-label" style={{ marginBottom: '8px' }}>Date Range</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="date" name="dateFrom" className="pcc-input" value={filters.dateFrom} onChange={handleChange} />
              <input type="date" name="dateTo" className="pcc-input" value={filters.dateTo} onChange={handleChange} />
            </div>
          </div>
          <div>
            <div className="rc-label" style={{ marginBottom: '8px' }}>District</div>
            <CustomSelect 
              name="district" 
              value={filters.district} 
              onChange={handleChange} 
              options={['All Districts', 'Coorg', 'Mysuru', 'Bengaluru']} 
            />
          </div>
          <div>
            <div className="rc-label" style={{ marginBottom: '8px' }}>Category</div>
            <CustomSelect 
              name="category" 
              value={filters.category} 
              onChange={handleChange} 
              options={['All Categories', 'Nature', 'Heritage', 'Adventure']} 
            />
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div style={{ borderTop: '1px solid var(--pcc-border)', paddingTop: '16px', marginBottom: '16px' }}>
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--pcc-accent)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', padding: 0 }}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <TbFilter /> Advanced Filters {showAdvanced ? <TbChevronUp /> : <TbChevronDown />}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', paddingBottom: '24px' }}>
                <div>
                  <div className="rc-label" style={{ marginBottom: '8px' }}>Rating</div>
                  <CustomSelect name="rating" value={filters.rating} onChange={handleChange} options={['All Ratings', '4+ Stars', '3+ Stars']} />
                </div>
                <div>
                  <div className="rc-label" style={{ marginBottom: '8px' }}>User Type</div>
                  <CustomSelect name="userType" value={filters.userType} onChange={handleChange} options={['All Users', 'Premium', 'Standard']} />
                </div>
                <div>
                  <div className="rc-label" style={{ marginBottom: '8px' }}>Travel Mood</div>
                  <CustomSelect name="mood" value={filters.mood} onChange={handleChange} options={['All Moods', 'Relaxing', 'Adventure', 'Romantic']} />
                </div>
                <div>
                  <div className="rc-label" style={{ marginBottom: '8px' }}>Status</div>
                  <CustomSelect name="status" value={filters.status} onChange={handleChange} options={['All Statuses', 'Active', 'Inactive']} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <button className="btn btn-sm" onClick={handleGen} style={{ backgroundColor: 'var(--pcc-accent)', color: '#fff', border: 'none', padding: '12px 32px' }}>Generate Report</button>
          <button className="btn btn-sm" onClick={handleGen} style={{ backgroundColor: 'transparent', color: 'var(--pcc-text-primary)', border: '1px solid var(--pcc-border)', padding: '12px 32px' }}>Reset</button>
        </div>
      </div>
    </div>
  );
}