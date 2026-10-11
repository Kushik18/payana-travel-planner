import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faServer, faUsers, faMapMarkerAlt, faStar, faMicrochip, 
  faShieldAlt, faSave, faCogs, faWrench, faBell, faExclamationTriangle, faTrashRestore, faTimes, faEye, faArrowUp, faClock, faLock, faCheck, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import ModernDropdown from '../Components/ModernDropdown';
import '../Components/AllCss/Admin.css';

const CustomDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <div 
        className="adm-input" 
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {value}
        <span style={{ fontSize: '0.8em', opacity: 0.7 }}>▼</span>
      </div>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: 'var(--pcc-bg-card)', backdropFilter: 'blur(10px)', background: 'transparent', borderRadius: '0', border: 'none', borderBottom: '1px solid var(--pcc-border)', marginTop: '5px', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          {options.map(opt => (
            <div 
              key={opt} 
              style={{ padding: '10px 15px', color: 'var(--pcc-text-primary)', cursor: 'pointer', transition: 'background 0.2s ease' }} 
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
              onClick={() => { onChange(opt); setIsOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function SystemSettings() {
  const [status, setStatus] = useState(null);
  const [settings, setSettings] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginActivity, setShowLoginActivity] = useState(false);
  const [showDangerModal, setShowDangerModal] = useState(false);
  const [dangerConfirmText, setDangerConfirmText] = useState('');
  const [showForceLogoutModal, setShowForceLogoutModal] = useState(false);
  const [forceLogoutConfirmText, setForceLogoutConfirmText] = useState('');
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceConfirmText, setMaintenanceConfirmText] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [saveState, setSaveState] = useState('idle'); // 'idle', 'saving', 'success'
  const [maintenanceStatus, setMaintenanceStatus] = useState({
    backup: '',
    cache: '',
    analytics: '',
    index: ''
  });
  const [maintenanceLoading, setMaintenanceLoading] = useState({
    backup: false,
    cache: false,
    analytics: false,
    index: false
  });

  // Mock Data for Login Activity
  const mockLoginActivity = [
    { id: 1, user: "admin@payana.com", ip: "192.168.1.45", device: "Chrome / Windows 11", status: "Success", time: "10 mins ago" },
    { id: 2, user: "system_service", ip: "10.0.0.12", device: "API / Server", status: "Success", time: "2 hours ago" },
    { id: 3, user: "admin@payana.com", ip: "45.22.11.9", device: "Safari / iPhone 15", status: "Failed", time: "Yesterday" },
    { id: 4, user: "admin@payana.com", ip: "192.168.1.45", device: "Chrome / Windows 11", status: "Success", time: "Yesterday" },
    { id: 5, user: "admin@payana.com", ip: "192.168.1.100", device: "Firefox / MacOS", status: "Success", time: "2 days ago" }
  ];

  useEffect(() => {
    fetchSettings();
    const logs = localStorage.getItem('payana_admin_activity');
    if (logs) {
      setActivityLog(JSON.parse(logs));
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosInstance.get('/api/admin/settings');
      setStatus(res.data.status);
      setSettings(JSON.parse(res.data.settingsJson));
      setHasChanges(false);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (text) => {
    if (text.toLowerCase().includes('clear') || text.toLowerCase().includes('logout') || text.toLowerCase().includes('reset')) return faShieldAlt;
    if (text.toLowerCase().includes('backup') || text.toLowerCase().includes('rebuild') || text.toLowerCase().includes('refresh')) return faWrench;
    return faCogs;
  };

  const addActivity = (actionText) => {
    // Attempt to pull real admin user from local storage or default to System Admin
    let currentUser = localStorage.getItem('userEmail') || localStorage.getItem('username') || "System Admin";
    const newActivity = { id: Date.now(), text: actionText, user: currentUser, time: new Date().toLocaleTimeString() };
    const updated = [newActivity, ...activityLog].slice(0, 20);
    setActivityLog(updated);
    localStorage.setItem('payana_admin_activity', JSON.stringify(updated));
  };

  const handleToggle = (category, key) => {
    if (!settings) return;
    const updated = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: !settings[category][key]
      }
    };
    setSettings(updated);
    setHasChanges(true);
  };

  const handleChange = (category, key, value) => {
    if (!settings) return;
    const updated = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    };
    setSettings(updated);
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setSaveState('saving');
    try {
      await axiosInstance.put('/api/admin/settings', { settingsJson: JSON.stringify(settings) });
      toast.success('Settings Saved Successfully');
      addActivity('Settings Updated');
      setHasChanges(false);
      setSaveState('success');
      setTimeout(() => {
        setSaveState('idle');
      }, 2500);
    } catch (err) {
      toast.error('Failed to save settings');
      setSaveState('idle');
    }
  };

  const triggerSystemAction = async (endpoint, actionName, stateKey) => {
    setMaintenanceLoading(prev => ({ ...prev, [stateKey]: true }));
    const toastId = toast.loading("Processing...");
    try {
      await axiosInstance.post(`/api/admin/settings/${endpoint}`);
      toast.update(toastId, { render: `${actionName} Completed`, type: "success", isLoading: false, autoClose: 3000 });
      addActivity(actionName);
      setMaintenanceStatus(prev => ({ ...prev, [stateKey]: `Last run: Just now` }));
    } catch (err) {
      toast.update(toastId, { render: `Failed to execute ${actionName}`, type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setMaintenanceLoading(prev => ({ ...prev, [stateKey]: false }));
    }
  };

  const handleDangerReset = () => {
    const DEFAULT_SETTINGS = {
      general: { platformName: "Payana", supportEmail: "support@payana.com", defaultLanguage: "English", maintenanceMode: false },
      ai: { enableAiTripPlanner: true, enableAiGuide: true, enableHiddenGems: true, enableRouteOptimizer: false },
      registration: { allowRegistration: true, allowReviews: true, allowItinerarySaving: true, maxSavedTrips: 20 },
      content: { enableReviewModeration: true, autoApproveReviews: false, showHiddenGems: true, showFestivals: true },
      notifications: { adminAlerts: true, reviewAlerts: true, festivalAlerts: false, userRegistrationAlerts: false }
    };
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
    toast.info("Settings reset to defaults. Remember to save.");
    addActivity("Reset Settings to Defaults");
    setShowDangerModal(false);
    setDangerConfirmText('');
  };

  if (loading) return <div className="adm-dash"><h3 style={{color: 'var(--adm-text-primary)', padding: '20px'}}>Loading Control Center...</h3></div>;

  return (
    <div className="adm-dash payana-theme">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: 0, fontWeight: 400, color: 'var(--pcc-text-primary)' }}>Payana control center</h1>
          <p style={{ margin: 0, marginTop: '8px', color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>Platform-wide rules, integrations, security and operations.</p>
        </div>
        <button 
          className="pcc-btn-save"
          onClick={saveSettings} 
          disabled={!hasChanges && saveState !== 'success'}
          style={{ opacity: (!hasChanges && saveState !== 'success') ? 0.5 : 1, cursor: (!hasChanges && saveState !== 'success') ? 'not-allowed' : 'pointer' }}
        >
          <span style={{ 
            display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', 
            backgroundColor: saveState === 'success' ? 'var(--pcc-success)' : (hasChanges ? 'var(--pcc-accent)' : 'var(--pcc-neutral)'),
            transition: 'background-color 0.3s'
          }}></span>
          {saveState === 'saving' ? 'saving...' : (saveState === 'success' ? 'all changes saved' : (hasChanges ? 'save changes' : 'all changes saved'))}
        </button>
      </div>

      {/* Stats Strip */}
      {status && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '10px' }}>
          {[
            { label: 'Users', value: status.users },
            { label: 'Places', value: status.places },
            { label: 'Reviews', value: status.feedbacks },
            { label: 'Uptime', value: '99.9%' }
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--pcc-bg-card)', padding: '16px', borderRadius: '6px', border: '1px solid var(--pcc-border)' }}>
              <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ color: 'var(--pcc-text-primary)', fontSize: '20px', fontWeight: '500' }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {settings && (
        <>
          <div className="pcc-section-title">CONFIGURATION</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            
            {/* General Card */}
            <div className="pcc-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--pcc-text-primary)' }}>General</h3>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Platform name</label>
                <input 
                  type="text" 
                  className="pcc-input" 
                  value={settings.general.platformName} 
                  onChange={(e) => handleChange('general', 'platformName', e.target.value)} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Support email</label>
                <input 
                  type="text" 
                  className="pcc-input" 
                  value={settings.general.supportEmail} 
                  onChange={(e) => handleChange('general', 'supportEmail', e.target.value)} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Default language</label>
                <div style={{ position: 'relative' }}>
                  <ModernDropdown
                    options={['English', 'Spanish', 'French']}
                    value={settings.general.defaultLanguage}
                    onChange={val => handleChange('general', 'defaultLanguage', val)}
                    grouped={false}
                  />
                </div>
              </div>

              <div style={{ 
                marginTop: '10px', background: 'transparent', border: '1px solid var(--pcc-border)', 
                borderRadius: '6px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
              }}>
                <div>
                  <div style={{ color: 'var(--pcc-caution)', fontSize: '13px', fontWeight: '500' }}>Maintenance mode</div>
                  <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', marginTop: '2px' }}>Takes the platform offline for users</div>
                </div>
                <label className="pcc-toggle caution"><input type="checkbox" checked={settings.general.maintenanceMode} onChange={() => handleToggle('general', 'maintenanceMode')} /><span className="pcc-slider"></span></label>
              </div>
            </div>

            {/* Users and Content Card */}
            <div className="pcc-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--pcc-text-primary)' }}>Users and content</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Allow registration', cat: 'registration', key: 'allowRegistration' },
                  { label: 'Allow reviews', cat: 'registration', key: 'allowReviews' },
                  { label: 'Allow itinerary saving', cat: 'registration', key: 'allowItinerarySaving' }
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--pcc-text-primary)' }}>{item.label}</span>
                    <label className="pcc-toggle"><input type="checkbox" checked={settings[item.cat][item.key]} onChange={() => handleToggle(item.cat, item.key)} /><span className="pcc-slider"></span></label>
                  </div>
                ))}
                
                <div style={{ height: '1px', background: 'var(--adm-border)', margin: '4px 0' }}></div>
                
                {[
                  { label: 'Review moderation', cat: 'content', key: 'enableReviewModeration' },
                  { label: 'Show hidden gems', cat: 'content', key: 'showHiddenGems' }
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: 'var(--pcc-text-primary)' }}>{item.label}</span>
                    <label className="pcc-toggle"><input type="checkbox" checked={settings[item.cat][item.key]} onChange={() => handleToggle(item.cat, item.key)} /><span className="pcc-slider"></span></label>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--pcc-neutral)' }}>Auto-approve reviews</span>
                  <label className="pcc-toggle caution"><input type="checkbox" checked={settings.content.autoApproveReviews} onChange={() => handleToggle('content', 'autoApproveReviews')} /><span className="pcc-slider"></span></label>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

      <div className="pcc-section-title">CONTROL AND OVERSIGHT</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {/* Login Activity */}
        <div className="pcc-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pcc-text-secondary)' }}>
              <FontAwesomeIcon icon={faEye} />
            </div>
            <div>
              <div style={{ color: 'var(--pcc-text-primary)', fontSize: '15px', fontWeight: 500 }}>Login activity</div>
              <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '13px', marginTop: '4px' }}>View every authentication event on the platform.</div>
            </div>
          </div>
          <button className="btn" style={{ background: 'transparent', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)', fontSize: '13px' }} onClick={() => setShowLoginActivity(true)}>View log</button>
        </div>

        {/* Session Management */}
        <div className="pcc-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pcc-neutral)' }}>
              <FontAwesomeIcon icon={faLock} />
            </div>
            <div>
              <div style={{ color: 'var(--pcc-text-primary)', fontSize: '15px', fontWeight: 500 }}>Session management</div>
              <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '13px', marginTop: '4px' }}>Sign out every other session. Yours stays open.</div>
            </div>
          </div>
          <button className="btn" style={{ background: 'transparent', border: '1px solid #D97757', color: 'var(--pcc-neutral)', fontSize: '13px' }} onClick={() => {toast.success('All other sessions cleared'); addActivity('Cleared Other Sessions');}}>Clear sessions</button>
        </div>

        {/* Maintenance Tools */}
        <div className="pcc-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pcc-text-secondary)' }}>
              <FontAwesomeIcon icon={faWrench} />
            </div>
            <div>
              <div style={{ color: 'var(--pcc-text-primary)', fontSize: '15px', fontWeight: 500 }}>Maintenance tools</div>
              <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '13px', marginTop: '4px' }}>Backup, cache, analytics and destination index.</div>
            </div>
          </div>
          <button className="btn" style={{ background: 'transparent', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)', fontSize: '13px' }} onClick={() => setShowMaintenanceModal(true)}>Open tools</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {/* Force Logout */}
        <div className="pcc-destructive-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--pcc-neutral)', textTransform: 'uppercase', marginBottom: '8px' }}><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />irreversible</div>
              <div className="pcc-destructive-title">Force logout all users</div>
              <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>Ends every active session immediately, including yours.</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                className="pcc-input pcc-mono-input" 
                placeholder="Type FORCE LOGOUT to enable" 
                value={forceLogoutConfirmText}
                onChange={e => setForceLogoutConfirmText(e.target.value)}
                style={{ flex: 1, border: '1px solid var(--pcc-danger)' }}
              />
              <button 
                className="btn" 
                style={{ 
                  background: forceLogoutConfirmText === 'FORCE LOGOUT' ? 'var(--pcc-danger)' : 'transparent', 
                  border: forceLogoutConfirmText === 'FORCE LOGOUT' ? 'none' : '1px solid var(--pcc-danger)',
                  color: forceLogoutConfirmText === 'FORCE LOGOUT' ? '#fff' : 'var(--pcc-danger)',
                  minWidth: '120px', fontSize: '13px', transition: 'all 0.2s'
                }}
                disabled={forceLogoutConfirmText !== 'FORCE LOGOUT'}
                onClick={() => {toast.error('Forced logout initiated'); addActivity('Forced Logout All Users'); setForceLogoutConfirmText('');}}
              >
                Force logout
              </button>
            </div>
          </div>
        </div>

        {/* Reset to Defaults */}
        <div className="pcc-destructive-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--pcc-neutral)', textTransform: 'uppercase', marginBottom: '8px' }}><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />irreversible</div>
              <div className="pcc-destructive-title">Reset to defaults</div>
              <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>Overrides every current configuration with platform defaults.</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                className="pcc-input pcc-mono-input" 
                placeholder="Type RESET to enable" 
                value={dangerConfirmText}
                onChange={e => setDangerConfirmText(e.target.value)}
                style={{ flex: 1, border: '1px solid var(--pcc-danger)' }}
              />
              <button 
                className="btn" 
                style={{ 
                  background: dangerConfirmText === 'RESET' ? 'var(--pcc-danger)' : 'transparent', 
                  border: dangerConfirmText === 'RESET' ? 'none' : '1px solid var(--pcc-danger)',
                  color: dangerConfirmText === 'RESET' ? '#fff' : 'var(--pcc-danger)',
                  minWidth: '120px', fontSize: '13px', transition: 'all 0.2s'
                }}
                disabled={dangerConfirmText !== 'RESET'}
                onClick={handleDangerReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pcc-section-title">ACTIVITY LOG</div>
      
      <div className="pcc-terminal">
        {activityLog.map((log, i) => (
          <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--pcc-text-secondary)' }}>{log.time.split(' ')[0]} <span style={{ color: 'var(--pcc-neutral)', margin: '0 8px' }}>{log.user}</span> -> {log.text.toLowerCase().replace(/ /g, '_')}</span>
            <span style={{ color: (log.text.includes('Logout') || log.text.includes('Reset')) ? 'var(--pcc-danger)' : 'var(--pcc-accent)' }}>
              {(log.text.includes('Logout') || log.text.includes('Reset')) ? 'danger' : 'ok'}
            </span>
          </div>
        ))}
        {activityLog.length === 0 && <span style={{ color: 'var(--pcc-text-secondary)' }}>Waiting for system events...</span>}
      </div>

      {/* Login Activity Modal */}
      {showLoginActivity && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="pcc-card" style={{ width: '100%', maxWidth: '800px', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--pcc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, color: 'var(--pcc-text-primary)', fontSize: '18px' }}>Login Activity</h4>
              <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-text-secondary)' }} onClick={() => setShowLoginActivity(false)}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <table className="table table-borderless table-hover pcc-table" style={{ background: 'transparent', margin: 0 }}>
                <thead>
                  <tr style={{ color: 'var(--pcc-text-secondary)', fontSize: '0.85rem', borderBottom: '1px solid var(--pcc-border)' }}>
                    <th>User</th><th>IP Address</th><th>Device</th><th>Status</th><th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLoginActivity.map(log => (
                    <tr key={log.id} style={{ verticalAlign: 'middle' }}>
                      <td>{log.user}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{log.ip}</td>
                      <td style={{ color: 'var(--pcc-text-secondary)', fontFamily: 'var(--font-mono)' }}>{log.device}</td>
                      <td><span style={{ color: log.status === 'Success' ? 'var(--pcc-success)' : 'var(--pcc-danger)' }}>{log.status}</span></td>
                      <td style={{ color: 'var(--pcc-text-secondary)' }}>{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Tools Modal */}
      {showMaintenanceModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="pcc-card" style={{ width: '100%', maxWidth: '600px', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--pcc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, color: 'var(--pcc-text-primary)', fontSize: '18px' }}>Maintenance Tools</h4>
              <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-text-secondary)' }} onClick={() => setShowMaintenanceModal(false)}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'transparent', borderRadius: '0', border: 'none', borderBottom: '1px solid var(--pcc-border)' }}>
                <div>
                  <div style={{ color: 'var(--pcc-text-primary)', fontSize: '14px', fontWeight: 500 }}><FontAwesomeIcon icon={faSave} className="me-2" style={{ color: 'var(--pcc-neutral)' }} />Backup Database</div>
                  <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '12px', marginTop: '4px' }}>{maintenanceStatus.backup || 'Full encrypted snapshot'}</div>
                </div>
                <button className="btn btn-sm" style={{ border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)' }} disabled={maintenanceLoading.backup} onClick={() => triggerSystemAction('backup', 'Database Backup', 'backup')}>
                  {maintenanceLoading.backup ? <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> : 'Run Backup'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'transparent', borderRadius: '0', border: 'none', borderBottom: '1px solid var(--pcc-border)' }}>
                <div>
                  <div style={{ color: 'var(--pcc-text-primary)', fontSize: '14px', fontWeight: 500 }}><FontAwesomeIcon icon={faTrashRestore} className="me-2" style={{ color: 'var(--pcc-neutral)' }} />Clear Cache</div>
                  <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '12px', marginTop: '4px' }}>{maintenanceStatus.cache || 'Frees up Redis memory'}</div>
                </div>
                <button className="btn btn-sm" style={{ border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)' }} disabled={maintenanceLoading.cache} onClick={() => triggerSystemAction('clear-cache', 'Cache Cleared', 'cache')}>
                  {maintenanceLoading.cache ? <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> : 'Clear Cache'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default SystemSettings;
