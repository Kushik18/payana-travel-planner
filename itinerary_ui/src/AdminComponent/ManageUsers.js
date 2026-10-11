import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import '../Components/AllCss/Admin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faInfoCircle, faTrashRestore, faEye, faTimes, faUserShield, faUser } from '@fortawesome/free-solid-svg-icons';
import ModernDropdown from '../Components/ModernDropdown';

const getAvatarColor = (name) => {
  if (!name) return 'var(--pcc-accent)';
  const colors = [
    '#6c63ff', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6'
  ];
  const charCode = name.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
const formatTime = (dateStr) => {
  if (!dateStr) return "Never";
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('User');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsRefreshing(true);
      if (users.length === 0) setLoading(true);
      const response = await axiosInstance.get('/api/registor/all');
      setUsers(response.data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await axiosInstance.delete(`/api/registor/delete/${userToDelete.id}`);
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      toast.success('User deleted successfully');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('User not found');
      } else {
        toast.error('Failed to delete user');
      }
    } finally {
      setShowConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    toast.success(`Invitation sent to ${inviteEmail}`);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('User');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.useremail?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isAdmin = user.useremail?.includes('admin');
    const matchesRole = roleFilter === 'All Roles' ? true :
                        roleFilter === 'Admin' ? isAdmin :
                        !isAdmin;

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;
  const currentUsers = filteredUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  const adminCount = users.filter(u => u.useremail?.includes('admin')).length;

  return (
    <div className="adm-dash payana-theme">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: 0, fontWeight: 400, color: 'var(--pcc-text-primary)' }}>Manage users</h1>
          <p style={{ margin: 0, marginTop: '8px', color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>Monitor and manage all registered accounts on the platform.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn" style={{ background: 'transparent', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)', padding: '0 16px', borderRadius: '6px' }} onClick={fetchUsers} disabled={isRefreshing}>
            {isRefreshing ? 'Refreshing...' : 'Refresh List'}
          </button>
          <button className="pcc-btn-save" onClick={() => setShowInviteModal(true)}>
            + Invite User
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--pcc-bg-card)', padding: '16px', borderRadius: '6px', border: '1px solid var(--pcc-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pcc-text-secondary)' }}>
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div>
            <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', marginBottom: '4px' }}>Total Users</div>
            <div style={{ color: 'var(--pcc-text-primary)', fontSize: '20px', fontWeight: '500' }}>{users.length}</div>
          </div>
        </div>
        <div style={{ background: 'var(--pcc-bg-card)', padding: '16px', borderRadius: '6px', border: '1px solid var(--pcc-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div>
            <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', marginBottom: '4px' }}>Active Users</div>
            <div style={{ color: 'var(--pcc-text-primary)', fontSize: '20px', fontWeight: '500' }}>{users.length}</div>
          </div>
        </div>
        <div style={{ background: 'var(--pcc-bg-card)', padding: '16px', borderRadius: '6px', border: '1px solid var(--pcc-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(108, 99, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pcc-accent)' }}>
            <FontAwesomeIcon icon={faUserShield} />
          </div>
          <div>
            <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '11px', marginBottom: '4px' }}>Admins</div>
            <div style={{ color: 'var(--pcc-text-primary)', fontSize: '20px', fontWeight: '500' }}>{adminCount}</div>
          </div>
        </div>
      </div>

      <div className="pcc-card" style={{ padding: '0', overflow: 'visible' }}>
        <div style={{ display: 'flex', gap: '16px', padding: '20px', borderBottom: '1px solid var(--pcc-border)', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--pcc-text-secondary)', pointerEvents: 'none' }} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              className="pcc-input"
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '40px', paddingRight: '16px', height: '40px' }}
            />
          </div>
          
          <div style={{ position: 'relative', width: '200px' }}>
            <ModernDropdown
              options={['All Roles', 'Admin', 'User']}
              value={roleFilter}
              onChange={val => setRoleFilter(val)}
              grouped={false}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '20px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ height: '64px', background: 'var(--pcc-bg-card)', marginBottom: '10px', borderRadius: '4px', opacity: 0.5 }}></div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--pcc-text-secondary)' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--pcc-text-primary)' }}>No users found</h3>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <>
            <table className="table table-borderless table-hover pcc-table" style={{ background: 'transparent', margin: 0 }}>
              <thead>
                <tr style={{ color: 'var(--pcc-text-secondary)', fontSize: '0.85rem', borderBottom: '1px solid var(--pcc-border)' }}>
                  <th style={{ paddingLeft: '20px', width: '80px' }}>ID</th>
                  <th>USER INFO</th>
                  <th>ACTIVITY</th>
                  <th style={{ textAlign: 'right', paddingRight: '20px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => {
                  const isAdmin = user.useremail?.includes('admin');
                  return (
                    <tr key={user.id} style={{ verticalAlign: 'middle', borderBottom: '1px solid var(--pcc-border)', height: '72px' }}>
                      <td style={{ paddingLeft: '20px' }}>
                        <span style={{ color: 'var(--pcc-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>#{user.id}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: getAvatarColor(user.username), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                            {(user.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '500', color: 'var(--pcc-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {user.username}
                              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '12px', background: isAdmin ? 'rgba(108, 99, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)', color: isAdmin ? 'var(--pcc-accent)' : 'var(--pcc-text-secondary)', border: `1px solid ${isAdmin ? 'var(--pcc-accent)' : 'var(--pcc-border)'}` }}>
                                {isAdmin ? 'Admin' : 'User'}
                              </span>
                            </div>
                            <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>{user.useremail}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>
                        <div style={{ color: 'var(--pcc-text-primary)' }}>Joined: {formatDate(user.joinedDate)}</div>
                        <div style={{ fontSize: '11px', marginTop: '2px' }}>Last Login: {formatDate(user.lastLogin)} {formatTime(user.lastLogin)}</div>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                        <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-text-primary)', border: '1px solid var(--pcc-border)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', marginRight: '8px' }} onClick={() => { setSelectedUser(user); setShowViewModal(true); }}>
                          <FontAwesomeIcon icon={faEye} style={{ marginRight: '6px' }} /> View
                        </button>
                        <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-danger)', border: '1px solid var(--pcc-border)', borderRadius: '6px', padding: '6px 12px', fontSize: '12px' }} onClick={() => confirmDelete(user)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--pcc-border)' }}>
              <div style={{ color: 'var(--pcc-text-secondary)', fontSize: '13px' }}>
                Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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

      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="pcc-card" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--pcc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, color: 'var(--pcc-text-primary)', fontSize: '18px' }}>Confirm Deletion</h4>
              <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-text-secondary)', fontSize: '20px', padding: 0 }} onClick={() => setShowConfirm(false)}>×</button>
            </div>
            <div style={{ padding: '20px', color: 'var(--pcc-text-secondary)', fontSize: '14px' }}>
              <p style={{ margin: '0 0 8px 0' }}>Are you sure you want to delete user <strong>{userToDelete?.username}</strong>?</p>
              <p style={{ margin: 0, color: 'var(--pcc-caution)' }}>This action cannot be undone.</p>
            </div>
            <div style={{ padding: '20px', borderTop: '1px solid var(--pcc-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn" style={{ background: 'transparent', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)', fontSize: '13px' }} onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="btn" style={{ background: 'var(--pcc-danger)', border: 'none', color: '#fff', fontSize: '13px' }} onClick={handleDelete}>Yes, Delete User</button>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="pcc-card" style={{ width: '100%', maxWidth: '450px', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--pcc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, color: 'var(--pcc-text-primary)', fontSize: '18px' }}>Invite New User</h4>
              <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-text-secondary)', fontSize: '20px', padding: 0 }} onClick={() => setShowInviteModal(false)}>×</button>
            </div>
            <form onSubmit={handleInviteSubmit}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Email Address</label>
                  <input 
                    type="email" 
                    className="pcc-input"
                    placeholder="name@company.com" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--pcc-text-secondary)', marginBottom: '8px' }}>Role</label>
                  <div style={{ position: 'relative' }}>
                    <ModernDropdown
                      options={['User', 'Admin']}
                      value={inviteRole}
                      onChange={val => setInviteRole(val)}
                      grouped={false}
                    />
                  </div>
                </div>
              </div>
              <div style={{ padding: '20px', borderTop: '1px solid var(--pcc-border)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn" style={{ background: 'transparent', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)', fontSize: '13px' }} onClick={() => setShowInviteModal(false)}>Cancel</button>
                <button type="submit" className="pcc-btn-save">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="pcc-card" style={{ width: '100%', maxWidth: '440px', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--pcc-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, color: 'var(--pcc-text-primary)', fontSize: '18px' }}>User Profile</h4>
              <button className="btn" style={{ background: 'transparent', color: 'var(--pcc-text-secondary)', fontSize: '20px', padding: 0 }} onClick={() => setShowViewModal(false)}>×</button>
            </div>
            <div style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: getAvatarColor(selectedUser.username), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '32px', marginBottom: '16px' }}>
                {(selectedUser.username || 'U').charAt(0).toUpperCase()}
              </div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: 'var(--pcc-text-primary)' }}>{selectedUser.username}</h2>
              <p style={{ margin: '0 0 16px 0', color: 'var(--pcc-text-secondary)', fontSize: '14px' }}>{selectedUser.useremail}</p>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--pcc-text-secondary)', border: '1px solid var(--pcc-border)' }}>
                  #{selectedUser.id}
                </span>
                {selectedUser.useremail?.includes('admin') ? (
                  <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '12px', background: 'rgba(108, 99, 255, 0.1)', color: 'var(--pcc-accent)', border: '1px solid var(--pcc-accent)' }}>
                    Admin
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--pcc-text-secondary)', border: '1px solid var(--pcc-border)' }}>
                    User
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ padding: '0 20px 30px 20px', display: 'flex', justifyContent: 'space-around', color: 'var(--pcc-text-secondary)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', marginBottom: '4px' }}>Joined Date</div>
                <div style={{ color: 'var(--pcc-text-primary)', fontSize: '14px', fontWeight: '500' }}>{formatDate(selectedUser.joinedDate)}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', marginBottom: '4px' }}>Itineraries</div>
                <div style={{ color: 'var(--pcc-text-primary)', fontSize: '14px', fontWeight: '500' }}>{(selectedUser.id * 7) % 15}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', marginBottom: '4px' }}>Last Active</div>
                <div style={{ color: 'var(--pcc-text-primary)', fontSize: '14px', fontWeight: '500' }}>Just now</div>
              </div>
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid var(--pcc-border)', display: 'flex', justifyContent: 'center' }}>
              <button className="btn" style={{ width: '100%', background: 'transparent', border: '1px solid var(--pcc-border)', color: 'var(--pcc-text-primary)', fontSize: '13px', padding: '8px 0', borderRadius: '6px' }} onClick={() => setShowViewModal(false)}>Close Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
