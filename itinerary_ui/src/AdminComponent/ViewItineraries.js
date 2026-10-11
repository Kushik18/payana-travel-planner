import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faInfoCircle, faChevronDown, faCheck, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import ModernDropdown from "../Components/ModernDropdown";
import "../Components/AllCss/Admin.css";

function ViewItineraries() {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterDistrict, setFilterDistrict] = useState("All Districts");

  useEffect(() => { fetchItineraries(); }, []);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/itinerary/all");
      setItineraries(response.data); setError(null);
    } catch (err) {
      console.error("Error fetching itineraries:", err);
      setError("Failed to load itineraries. Please try again later.");
    } finally { setLoading(false); }
  };

  const toTitleCase = (str) => {
    if (!str) return '';
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const uniqueCategories = useMemo(() => {
    const cats = new Set(itineraries.map(i => i.category).filter(Boolean).map(toTitleCase));
    cats.delete('All Categories');
    return Array.from(cats).sort();
  }, [itineraries]);

  const uniqueDistricts = useMemo(() => {
    const dists = new Set(itineraries.map(i => i.district).filter(Boolean).map(toTitleCase));
    dists.delete('All Districts');
    return Array.from(dists).sort();
  }, [itineraries]);

  const filteredItineraries = useMemo(() => {
    return itineraries.filter(item => {
      const matchSearch = item.place?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = filterCategory && filterCategory !== 'All Categories' 
          ? item.category?.toLowerCase() === filterCategory.toLowerCase() 
          : true;
      const matchDist = filterDistrict && filterDistrict !== 'All Districts' 
          ? item.district?.toLowerCase() === filterDistrict.toLowerCase() 
          : true;
      return matchSearch && matchCat && matchDist;
    });
  }, [itineraries, searchTerm, filterCategory, filterDistrict]);

  if (loading) {
    return (
      <div className="adm-dash payana-theme">
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--pcc-text-secondary)' }}>
          Loading itineraries...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adm-dash payana-theme">
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--pcc-danger)' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="adm-dash payana-theme">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: 0, fontWeight: 400, color: 'var(--pcc-text-primary)' }}>Stored itineraries</h1>
          <p style={{ margin: 0, marginTop: '8px', color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>Explore and manage the entire destination database.</p>
        </div>
        <button className="pcc-btn-save" onClick={() => navigate('/admin/upditinerary')}>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} /> Add Destination
        </button>
      </div>

      <div className="pcc-card" style={{ padding: '0', overflow: 'visible', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', padding: '20px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pcc-text-secondary)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              placeholder="Search places by name..." 
              value={searchTerm}
              className="pcc-input"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px', paddingRight: '16px', height: '40px' }}
            />
          </div>
          
          <div style={{ position: 'relative', width: '200px' }}>
            <ModernDropdown
              options={['All Categories', ...uniqueCategories]}
              value={filterCategory}
              onChange={val => setFilterCategory(val)}
              grouped={false}
            />
          </div>

          <div style={{ position: 'relative', width: '200px' }}>
            <ModernDropdown
              options={['All Districts', ...uniqueDistricts]}
              value={filterDistrict}
              onChange={val => setFilterDistrict(val)}
              grouped={false}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '16px', color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>
        Showing {filteredItineraries.length} destinations
      </div>

      {filteredItineraries.length === 0 ? (
        <div className="pcc-card" style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--pcc-text-secondary)' }}>
          No places found matching your filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredItineraries.map((item, index) => (
            <div key={item.id || index} className="pcc-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.place}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      if (!e.target.dataset.error) {
                        e.target.dataset.error = "true";
                        e.target.src = 'https://via.placeholder.com/300x200?text=Missing+Photo';
                      }
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--pcc-bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pcc-text-secondary)' }}>
                    No Photo
                  </div>
                )}
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }} title={`Lat: ${item.latitude || 'N/A'}\nLng: ${item.longitude || 'N/A'}`}>
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
              </div>
              
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--pcc-text-primary)' }}>{item.place}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--pcc-text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'var(--pcc-accent)' }} /> {item.district}
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                  {item.category && (
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'var(--pcc-bg-main)', color: 'var(--pcc-text-primary)', border: '1px solid var(--pcc-border)' }}>
                      {item.category}
                    </span>
                  )}
                  {item.tripWith && (
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'var(--pcc-bg-main)', color: 'var(--pcc-text-primary)', border: '1px solid var(--pcc-border)' }}>
                      {item.tripWith}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewItineraries;