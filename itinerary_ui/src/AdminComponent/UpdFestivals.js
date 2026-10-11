import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ModernDropdown from '../Components/ModernDropdown';
import '../Components/AllCss/Admin.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

function UpdFestivals() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    startDate: '',
    endDate: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/api/festivals/all');
      setFestivals(res.data || []);
    } catch (err) {
      toast.error('Failed to load festivals');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosInstance.put(`/api/festivals/update/${editingId}`, formData);
        toast.success('Festival updated successfully!');
      } else {
        await axiosInstance.post('/api/festivals/create', formData);
        toast.success('Festival created successfully!');
      }
      handleCloseModal();
      fetchFestivals();
    } catch (err) {
      toast.error(editingId ? 'Error updating festival' : 'Error creating festival');
    }
  };

  const handleEdit = (fest) => {
    setFormData({
      name: fest.name || '',
      district: fest.district || '',
      startDate: fest.startDate || '',
      endDate: fest.endDate || '',
      description: fest.description || '',
      image: fest.image || ''
    });
    setEditingId(fest.id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', district: '', startDate: '', endDate: '', description: '', image: '' });
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this festival?")) return;
    try {
      await axiosInstance.delete(`/api/festivals/delete/${id}`);
      toast.success('Festival deleted successfully');
      setFestivals(festivals.filter(f => f.id !== id));
    } catch (err) {
      toast.error('Failed to delete festival');
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatRange = (start, end) => {
    if (!start || !end) return '';
    if (start === end) return formatDate(start);
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  const toTitleCase = (str) => {
    if (!str) return '';
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const filteredFestivals = useMemo(() => {
    let result = festivals;
    if (filterDistrict !== 'All' && filterDistrict !== 'All Districts') {
      result = result.filter(f => f.district?.toLowerCase() === filterDistrict.toLowerCase());
    }
    if (searchTerm) {
      result = result.filter(f => f.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return result;
  }, [festivals, filterDistrict, searchTerm]);

  const totalPages = Math.ceil(filteredFestivals.length / rowsPerPage) || 1;
  const currentFestivals = filteredFestivals.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDistrict]);

  return (
    <div className="adm-dash payana-theme">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: 0, fontWeight: 400, color: 'var(--pcc-text-primary)' }}>Festival management</h1>
          <p style={{ margin: 0, marginTop: '8px', color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>Manage Karnataka's cultural events and festivals.</p>
        </div>
        <button className="pcc-btn-save" onClick={() => {
          setFormData({ name: '', district: '', startDate: '', endDate: '', description: '', image: '' });
          setEditingId(null);
          setShowModal(true);
        }}>
          + Add Festival
        </button>
      </div>

      <div className="pcc-card" style={{ padding: '0', overflow: 'visible' }}>
        <div style={{ display: 'flex', gap: '16px', padding: '20px', borderBottom: '1px solid var(--pcc-border)', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pcc-text-secondary)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Search festivals..." 
              value={searchTerm}
              className="pcc-input"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px', paddingRight: '16px', height: '40px' }}
            />
          </div>
          
          <div style={{ position: 'relative', width: '200px' }}>
            <ModernDropdown
              options={['All Districts', ...[...new Set(festivals.map(f => toTitleCase(f.district)))].filter(d => d && d !== 'All Districts').sort()]}
              value={filterDistrict}
              onChange={val => setFilterDistrict(val)}
              grouped={false}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '20px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ height: '40px', background: 'var(--pcc-bg-card)', marginBottom: '10px', borderRadius: '4px', opacity: 0.5 }}></div>
            ))}
          </div>
        ) : filteredFestivals.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--pcc-text-secondary)' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--pcc-text-primary)' }}>No festivals found</h3>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <>
            <table className="table table-borderless table-hover pcc-table" style={{ background: 'transparent', margin: 0 }}>
              <thead>
                <tr style={{ color: 'var(--pcc-text-secondary)', fontSize: '0.85rem', borderBottom: '1px solid var(--pcc-border)' }}>
                  <th style={{ paddingLeft: '20px' }}>ID</th>
                  <th>FESTIVAL NAME</th>
                  <th>DISTRICT</th>
                  <th>DATES</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentFestivals.map((fest, index) => (
                  <tr key={fest.id} style={{ verticalAlign: 'middle', borderBottom: '1px solid var(--pcc-border)', height: '64px' }}>
                    <td style={{ paddingLeft: '20px' }}><span style={{ color: 'var(--pcc-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{(currentPage - 1) * rowsPerPage + index + 1}</span></td>
                    <td style={{fontWeight: '500', color: 'var(--pcc-text-primary)'}}>{fest.name}</td>
                    <td>
                      {fest.district === 'All Districts' || fest.district === 'All'
                        ? <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'var(--pcc-bg-card)', color: 'var(--pcc-text-primary)', border: '1px solid var(--pcc-border)' }}>All Districts</span>
                        : <span style={{ color: 'var(--pcc-text-primary)' }}>{fest.district}</span>}
                    </td>
                    <td style={{ color: 'var(--pcc-text-secondary)', fontSize: '14px' }}>
                      {formatRange(fest.startDate, fest.endDate)}
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-text-primary)', border: '1px solid var(--pcc-border)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', marginRight: '8px' }} onClick={() => handleEdit(fest)}>Edit</button>
                      <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-danger)', border: '1px solid var(--pcc-border)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDelete(fest.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--pcc-border)' }}>
              <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredFestivals.length)} of {filteredFestivals.length} festivals
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn" 
                  style={{ background: 'var(--pcc-bg-card)', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)', fontSize: '13px', padding: '6px 16px', borderRadius: '6px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <button 
                  className="btn" 
                  style={{ background: 'var(--pcc-bg-card)', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)', fontSize: '13px', padding: '6px 16px', borderRadius: '6px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="pcc-card" style={{ width: '100%', maxWidth: '600px', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--pcc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, color: 'var(--pcc-text-primary)', fontSize: '18px' }}>{editingId ? 'Edit Festival' : 'Create New Festival'}</h4>
              <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-text-secondary)', fontSize: '20px', padding: 0 }} onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{display: 'flex', gap: '15px'}}>
                  <div style={{flex: 1}}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Festival Name</label>
                    <input type="text" className="pcc-input" name="name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>District</label>
                    <div style={{ position: 'relative' }}>
                      <ModernDropdown
                        options={['Bagalkot', 'Bangalore Rural', 'Bangalore Urban', 'Belgaum', 'Bellary', 'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Gulbarga', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shimoga', 'Tumkur', 'Udupi', 'Uttara Kannada', 'Bijapur', 'Yadgir', 'Vijayanagar']}
                        value={formData.district}
                        onChange={(val) => setFormData({ ...formData, district: val })}
                        placeholder="Select District"
                        grouped={false}
                      />
                    </div>
                  </div>
                </div>
                
                <div style={{display: 'flex', gap: '15px'}}>
                  <div style={{flex: 1}}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Start Date</label>
                    <DatePicker 
                      selected={formData.startDate ? new Date(formData.startDate) : null}
                      onChange={(date) => setFormData({ ...formData, startDate: date ? date.toISOString().split('T')[0] : '' })}
                      dateFormat="MMM d, yyyy"
                      placeholderText="Select start date"
                      className="pcc-input"
                      wrapperClassName="w-100"
                    />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>End Date</label>
                    <DatePicker 
                      selected={formData.endDate ? new Date(formData.endDate) : null}
                      onChange={(date) => setFormData({ ...formData, endDate: date ? date.toISOString().split('T')[0] : '' })}
                      dateFormat="MMM d, yyyy"
                      placeholderText="Select end date"
                      className="pcc-input"
                      wrapperClassName="w-100"
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Description</label>
                  <textarea className="pcc-input" name="description" value={formData.description} onChange={handleChange} required rows={3}></textarea>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Image URL</label>
                  <input type="text" className="pcc-input" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                  {formData.image && (
                    <img src={formData.image} alt="Preview" style={{ marginTop: '8px', maxHeight: '120px', borderRadius: '8px', objectFit: 'cover', width: '100%' }} onError={(e) => e.target.style.display = 'none'} />
                  )}
                </div>
              </div>
              <div style={{ padding: '20px', borderTop: '1px solid var(--pcc-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn" style={{ background: 'transparent', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)', fontSize: '13px' }} onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="pcc-btn-save">{editingId ? 'Save Changes' : 'Save Festival'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdFestivals;
