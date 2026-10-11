import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Components/AllCss/Admin.css';

function Admin() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminFlag');
    toast.success("Logging out...");
    setTimeout(() => {
      navigate('/AdminLogin');
    }, 1500);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className={`adm ${theme === 'light' ? 'light-mode' : ''}`}>
      <div className="adm__content">
        
        {/* Mobile Sidebar Toggle */}
        <button className="adm__mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>

        {/* Sidebar */}
        <nav className={`adm__sidebar ${sidebarOpen ? 'adm__sidebar--open' : ''}`}>
          <div className="adm__sidebar-header">
            <Link to="/admin" className="adm__sidebar-brand">
              <div className="adm__sidebar-logo">P</div>
              <div className="adm__sidebar-brand-text">
                <span className="adm__sidebar-brand-name">Payana</span>
                <span className="adm__sidebar-brand-sub">admin</span>
              </div>
            </Link>
          </div>
          <div className="adm__sidebar-nav">
            <div className="adm__sidebar-group">DASHBOARD</div>
            <Link to="/admin" className={`adm__sidebar-link${!location.pathname.includes('/admin/') && !location.pathname.includes('upditinerary') && !location.pathname.includes('viewitineraries') && !location.pathname.includes('updevents') && !location.pathname.includes('adminprofile') && !location.pathname.includes('manageusers') && !location.pathname.includes('feedbacks') && !location.pathname.includes('updfestivals') && !location.pathname.includes('updhiddengems') && !location.pathname.includes('statistics') && !location.pathname.includes('reports') && !location.pathname.includes('adminreviews') && !location.pathname.includes('systemsettings') ? ' adm__sidebar-link--active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              <span>Overview</span>
            </Link>
            
            <div className="adm__sidebar-group" style={{ marginTop: '16px' }}>MANAGEMENT</div>
            <Link to="manageusers" className={`adm__sidebar-link${isActive('manageusers') ? ' adm__sidebar-link--active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              <span>Users</span>
            </Link>
            <Link to="viewitineraries" className={`adm__sidebar-link${isActive('viewitineraries') || isActive('upditinerary') ? ' adm__sidebar-link--active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>Destinations</span>
            </Link>
            <Link to="updevents" className={`adm__sidebar-link${isActive('updevents') ? ' adm__sidebar-link--active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>Events</span>
            </Link>
            <Link to="updfestivals" className={`adm__sidebar-link${isActive('updfestivals') ? ' adm__sidebar-link--active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M2 12a10 10 0 1020 0M2 12a10 10 0 1120 0"/></svg>
              <span>Festivals</span>
            </Link>
            <Link to="updhiddengems" className={`adm__sidebar-link${isActive('updhiddengems') ? ' adm__sidebar-link--active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>Hidden Gems</span>
            </Link>

            <div className="adm__sidebar-group" style={{ marginTop: '16px' }}>ANALYTICS</div>
            <Link to="statistics" className={`adm__sidebar-link${isActive('statistics') ? ' adm__sidebar-link--active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              <span>Statistics</span>
            </Link>
            <Link to="reports" className={`adm__sidebar-link${isActive('reports') ? ' adm__sidebar-link--active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span>Reports</span>
            </Link>

            <div className="adm__sidebar-group" style={{ marginTop: '16px' }}>MODERATION</div>
            <Link to="feedbacks" className={`adm__sidebar-link${isActive('feedbacks') ? ' adm__sidebar-link--active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <span>Feedbacks</span>
            </Link>


            <div className="adm__sidebar-group" style={{ marginTop: '16px' }}>SYSTEM</div>
            <Link to="systemsettings" className={`adm__sidebar-link${isActive('systemsettings') ? ' adm__sidebar-link--active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              <span>System Settings</span>
            </Link>
            <Link to="adminprofile" className={`adm__sidebar-link${isActive('adminprofile') ? ' adm__sidebar-link--active' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Profile</span>
            </Link>
            <Link to="/" className="adm__sidebar-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              <span>Go to User Site</span>
            </Link>
          </div>

          <div className="adm__sidebar-bottom">
            <div className="adm__user-chip">
              <div className="adm__user-avatar">A</div>
              <div className="adm__user-info">
                <div className="adm__user-name">Administrator</div>
                <div className="adm__user-email">admin@payana.com</div>
              </div>
              <button className="adm__user-logout" onClick={handleLogout} title="Logout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Page Content Wrapper */}
        <div className="adm__page-wrapper">
          {/* Top Header Bar */}
          <header className="adm__topbar">
            <div className="adm__topbar-left">
              <span className="adm__breadcrumb" style={{ fontSize: '18px', fontWeight: '600' }}>
                Admin
              </span>
            </div>
            <div className="adm__topbar-right">

              <button className="adm__bell-btn" onClick={toggleTheme} title="Toggle Theme">
                {theme === 'dark' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button>
              <button className="adm__bell-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                <span className="adm__bell-badge"></span>
              </button>
              <div className="adm__avatar-wrapper">
                <div className="adm__topbar-pill" style={{ gap: '8px', padding: '4px 14px 4px 4px' }} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="adm__topbar-avatar-circle">
                    AD
                    <span className="adm__topbar-status-dot"></span>
                  </div>
                  <div className="adm__topbar-user-info" style={{ display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <span className="adm__topbar-name" style={{ margin: 0, lineHeight: 1, fontSize: '12px', fontWeight: 600 }}>admin</span>
                    <span className="adm__topbar-role" style={{ background: 'var(--adm-brand-tint)', color: 'var(--adm-brand-primary)', padding: '2px 5px', borderRadius: '4px', fontSize: '8px', fontWeight: 700, lineHeight: 1, letterSpacing: '0.05em' }}>SUPER ADMIN</span>
                  </div>
                </div>
                {dropdownOpen && (
                  <div className="adm__avatar-dropdown">
                    <button className="adm__avatar-dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/admin/adminprofile'); }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Profile
                    </button>
                    <button className="adm__avatar-dropdown-item adm__avatar-dropdown-item--danger" onClick={handleLogout}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="adm__page">
            <Outlet />
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Admin;