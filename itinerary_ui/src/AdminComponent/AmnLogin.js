import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../Components/AllCss/Admin.css';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

function AmnLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!username || !password) { toast.error('Please fill in all fields'); return; }
    try {
      const response = await axiosInstance.post("/api/admin/login", { username, password });
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('adminFlag', 'true');
      toast.success("Login successful");
      navigate("/admin");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="adm-login">
      <div className="adm-login__overlay"></div>
      
      <div className="adm-login__card">
        <div className="adm-login__brand">Payana.</div>
        <div className="adm-login__label">Admin Portal</div>
        
        <hr className="adm-login__rule" />
        
        <h2 className="adm-login__title">Sign In</h2>
        
        <form onSubmit={handleLogin} autoComplete="off">
          {/* Hidden inputs to prevent aggressive browser autofill */}
          <input type="text" name="dummy_email_admin" style={{ display: 'none' }} aria-hidden="true" tabIndex="-1" />
          <input type="password" name="dummy_password_admin" style={{ display: 'none' }} aria-hidden="true" tabIndex="-1" />

          <div>
            <label className="adm-login__label-text">EMAIL</label>
            <input 
              className="adm-login__input" 
              type="text" 
              name="admin_email_unique"
              id="admin_email_unique"
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              autoComplete="off"
            />
          </div>
          <div>
            <label className="adm-login__label-text">PASSWORD</label>
            <input 
              className="adm-login__input" 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="adm-login__submit">Login</button>
        </form>
        
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/Login')} className="adm-login__back">
            &larr; Back to User Login
          </button>
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AmnLogin;