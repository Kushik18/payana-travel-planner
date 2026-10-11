import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "../Components/AllCss/Admin.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ModernDropdown from "../Components/ModernDropdown";

function UpdEvents() {
  const [isEditing, setIsEditing] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    district: '',
    description: '',
    locationUrl: '',
    eventDate: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => { 
    fetchDistricts(); 
    fetchEvents(); 
  }, []);

  const fetchDistricts = () => {
    axiosInstance.get("/api/itinerary/districts")
      .then(res => setDistricts(res.data))
      .catch(() => toast.error("Failed to load districts."));
  };
  
  const fetchEvents = () => {
    setLoading(true);
    axiosInstance.get("/api/events/getevent")
      .then(res => setEvents(res.data))
      .catch(() => toast.error("Failed to load events."))
      .finally(() => setLoading(false));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = { 
      district: formData.district, 
      description: formData.description, 
      locationUrl: formData.locationUrl, 
      eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : null 
    };

    if (editId) {
      axiosInstance.put(`/api/events/update/${editId}`, eventData)
        .then(() => { 
          toast.success("Event updated successfully!"); 
          fetchEvents(); 
          handleCloseModal(); 
        })
        .catch(() => toast.error("Failed to update event."));
    } else {
      axiosInstance.post("/api/events/events", eventData)
        .then(() => { 
          toast.success("Event added successfully!"); 
          fetchEvents(); 
          handleCloseModal(); 
        })
        .catch(() => toast.error("Failed to add event."));
    }
  };

  const handleEditClick = (event) => {
    setFormData({
      district: event.district || '',
      description: event.description || '',
      locationUrl: event.locationUrl || '',
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : ''
    });
    setEditId(event.id);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (confirmed) {
      axiosInstance.delete(`/api/events/delete/${id}`)
        .then(() => { 
          toast.success("Event deleted successfully!"); 
          fetchEvents(); 
        })
        .catch(() => toast.error("Failed to delete event."));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ district: '', description: '', locationUrl: '', eventDate: '' });
  };

  const toTitleCase = (str) => {
    if (!str) return '';
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const filteredEvents = React.useMemo(() => {
    let result = events;
    if (filterDistrict !== 'All' && filterDistrict !== 'All Districts') {
      result = result.filter(e => e.district?.toLowerCase() === filterDistrict.toLowerCase());
    }
    if (searchTerm) {
      result = result.filter(e => 
        (e.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.district || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [events, filterDistrict, searchTerm]);

  const totalPages = Math.ceil(filteredEvents.length / rowsPerPage) || 1;
  const currentEvents = filteredEvents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDistrict]);

  return (
    <div className="adm-dash payana-theme">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: 0, fontWeight: 400, color: 'var(--pcc-text-primary)' }}>Event management</h1>
          <p style={{ margin: 0, marginTop: '8px', color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>Add, edit, and remove district events and updates.</p>
        </div>
        <button className="pcc-btn-save" onClick={() => {
          setFormData({ district: '', description: '', locationUrl: '', eventDate: '' });
          setEditId(null);
          setShowModal(true);
        }}>
          + Add Event
        </button>
      </div>

      <div className="pcc-card" style={{ padding: '0', overflow: 'visible' }}>
        <div style={{ display: 'flex', gap: '16px', padding: '20px', borderBottom: '1px solid var(--pcc-border)', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pcc-text-secondary)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchTerm}
              className="pcc-input"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px', paddingRight: '16px', height: '40px' }}
            />
          </div>
          
          <div style={{ position: 'relative', width: '200px' }}>
            <ModernDropdown
              options={['All Districts', ...[...new Set(events.map(e => toTitleCase(e.district)))].filter(d => d && d !== 'All Districts').sort()]}
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
        ) : filteredEvents.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--pcc-text-secondary)' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--pcc-text-primary)' }}>No events found</h3>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <>
            <table className="table table-borderless table-hover pcc-table" style={{ background: 'transparent', margin: 0 }}>
              <thead>
                <tr style={{ color: 'var(--pcc-text-secondary)', fontSize: '0.85rem', borderBottom: '1px solid var(--pcc-border)' }}>
                  <th style={{ paddingLeft: '20px' }}>ID</th>
                  <th>DISTRICT</th>
                  <th>DESCRIPTION</th>
                  <th>DATE</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.map((event, index) => (
                  <tr key={event.id} style={{ verticalAlign: 'middle', borderBottom: '1px solid var(--pcc-border)', height: '64px' }}>
                    <td style={{ paddingLeft: '20px' }}><span style={{ color: 'var(--pcc-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{(currentPage - 1) * rowsPerPage + index + 1}</span></td>
                    <td style={{fontWeight: '500', color: 'var(--pcc-text-primary)'}}>{event.district}</td>
                    <td>
                      <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--pcc-text-secondary)', fontSize: '14px' }}>
                        {event.description}
                      </div>
                    </td>
                    <td style={{ color: 'var(--pcc-text-secondary)', fontSize: '14px' }}>
                      {event.eventDate ? new Date(event.eventDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : "N/A"}
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                      {event.locationUrl && (
                        <a href={event.locationUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'transparent', color: 'var(--pcc-accent)', border: '1px solid var(--pcc-border)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', marginRight: '8px', textDecoration: 'none' }}>Link</a>
                      )}
                      <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-text-primary)', border: '1px solid var(--pcc-border)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', marginRight: '8px' }} onClick={() => handleEditClick(event)}>Edit</button>
                      <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-danger)', border: '1px solid var(--pcc-border)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px' }} onClick={() => handleDeleteClick(event.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--pcc-border)' }}>
              <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredEvents.length)} of {filteredEvents.length} events
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
              <h4 style={{ margin: 0, color: 'var(--pcc-text-primary)', fontSize: '18px' }}>{editId ? 'Edit Event' : 'Create New Event'}</h4>
              <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-text-secondary)', fontSize: '20px', padding: 0 }} onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>District</label>
                  <div style={{ position: 'relative' }}>
                    <ModernDropdown
                      options={(districts.length > 0 ? districts : ['Bagalkot', 'Bangalore Rural', 'Bangalore Urban', 'Belgaum', 'Bellary', 'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Gulbarga', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shimoga', 'Tumkur', 'Udupi', 'Uttara Kannada', 'Bijapur', 'Yadgir', 'Vijayanagar']).map(d => d.district || d)}
                      value={formData.district}
                      onChange={val => setFormData({ ...formData, district: val })}
                      placeholder="Select District"
                      grouped={false}
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Event Description</label>
                  <input type="text" className="pcc-input" name="description" value={formData.description} onChange={handleInputChange} placeholder="E.g., Local Art Exhibition" required />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Location URL</label>
                  <input type="url" className="pcc-input" name="locationUrl" value={formData.locationUrl} onChange={handleInputChange} placeholder="https://maps.google.com/..." />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Event Date & Time</label>
                  <input type="datetime-local" className="pcc-input" name="eventDate" value={formData.eventDate} onChange={handleInputChange} />
                </div>

              </div>
              <div style={{ padding: '20px', borderTop: '1px solid var(--pcc-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn" style={{ background: 'transparent', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)', fontSize: '13px' }} onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="pcc-btn-save">{editId ? 'Save Changes' : 'Add Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdEvents;
