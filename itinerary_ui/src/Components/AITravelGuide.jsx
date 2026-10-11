/* ================================================================
   AI Travel Guide — Payana AI Chat Component
   A full-page conversational AI interface for Karnataka travel
================================================================ */
import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../App';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './AllCss/AITravelGuide.css';

/* ── Suggested Quick Prompts ── */
const QUICK_PROMPTS = [
  { text: "Best places to visit in Coorg", color: "var(--accent-green)", icon: "🌿" },
  { text: "What is the best time to visit Hampi?", color: "var(--accent-gold)", icon: "🏛️" },
  { text: "Hidden waterfalls near Bangalore", color: "var(--accent-green)", icon: "💧" },
  { text: "Mysuru Dasara festival details", color: "var(--accent-gold)", icon: "🎉" },
  { text: "Budget trip to Gokarna", color: "var(--accent-primary)", icon: "🌊" },
  { text: "Top trekking spots in Karnataka", color: "var(--accent-primary)", icon: "🥾" },
];

/* ── Markdown Parser ── */
const renderMarkdown = (text) => {
  const paragraphs = text.split('\n\n');
  return paragraphs.map((p, i) => {
    if (p.includes('\n* ') || p.startsWith('* ')) {
      const items = p.split('\n').filter(line => line.trim() !== '').map(line => line.replace(/^\*\s*/, ''));
      return <ul key={i}>{items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}</ul>;
    }
    return <p key={i} style={{ margin: p === '' ? '0.4em 0' : '0 0 0.5em' }}>{renderInline(p)}</p>;
  });
};

const renderInline = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

/* ── Payana monogram avatar ── */
const PAvatar = ({ size = 32 }) => (
  <div className="atg__avatar atg__avatar--ai" style={{ width: size, height: size, minWidth: size, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #B8860B, #C9A227)', borderRadius: '50%', color: '#fff', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1.2rem', flexShrink: 0 }}>
    <span>P</span>
  </div>
);

/* ── Message Bubble ── */
function MessageBubble({ msg, isNew }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      className={`atg__bubble-wrap ${isUser ? 'atg__bubble-wrap--user' : 'atg__bubble-wrap--ai'}`}
      initial={isNew ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {!isUser && <PAvatar />}
      <div className={`atg__bubble ${isUser ? 'atg__bubble--user' : 'atg__bubble--ai'}`}>
        {isUser ? <p style={{ margin: 0 }}>{msg.text}</p> : renderMarkdown(msg.text)}
        <div className="atg__bubble-time">
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Typing Indicator ── */
function TypingIndicator() {
  return (
    <motion.div
      className="atg__bubble-wrap atg__bubble-wrap--ai"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <PAvatar />
      <div className="atg__bubble atg__bubble--ai atg__bubble--typing">
        <span></span><span></span><span></span>
      </div>
    </motion.div>
  );
}

/* ================================================================
   MAIN COMPONENT
================================================================ */
export default function AITravelGuide() {
  const { user } = useContext(UserContext);
  const userId = user?.useremail || 'guest';
  const navigate = useNavigate();

  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [newMsgIndex, setNewMsgIndex]     = useState(-1);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  /* ── Load chat history on mount ── */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/chat/history/${encodeURIComponent(userId)}`);
        const loaded = data.flatMap(h => ([
          { role: 'user', text: h.message, timestamp: h.timestamp, id: `u-${h.id}` },
          { role: 'ai',   text: h.response, timestamp: h.timestamp, id: `a-${h.id}` },
        ]));
        setMessages(loaded);
      } catch {
        // No history or not logged in yet — start fresh
        setMessages([]);
      } finally {
        setHistoryLoaded(true);
      }
    };
    loadHistory();
  }, [userId]);

  /* ── Auto-scroll to bottom ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* ── Send a message ── */
  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', text: trimmed, timestamp: new Date().toISOString(), id: `u-${Date.now()}` };
    setMessages(prev => [...prev, userMsg]);
    setNewMsgIndex(messages.length);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axiosInstance.post('/api/chat/send', {
        userId,
        message: trimmed,
      });
      const aiMsg = {
        role: 'ai',
        text: data.response,
        timestamp: new Date().toISOString(),
        id: `a-${Date.now()}`,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: "Oops! I couldn't connect to the server. Please check that the backend is running and your Foursquare API key is configured.",
        timestamp: new Date().toISOString(),
        id: `err-${Date.now()}`,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  /* ── Clear history ── */
  const clearHistory = async () => {
    try {
      await axiosInstance.delete(`/api/chat/history/${encodeURIComponent(userId)}`);
    } catch {}
    setMessages([]);
  };

  if (!historyLoaded) {
    return (
      <div className="atg atg--loading">
        <div className="atg__spinner" />
        <p>Loading your travel conversations…</p>
      </div>
    );
  }

  return (
    <div className="atg">
      <div className="atg__column">
      {/* ── Header ── */}
      <div className="atg__header">
        <div className="atg__header-left">
          <button className="atg__ghost-btn" onClick={() => navigate(-1)} title="Go back">
            ⬅ Back
          </button>
          <div className="atg__header-icon"><PAvatar size={40} /></div>
          <div>
            <div className="atg__header-title">Payana AI Travel Guide</div>
            <div className="atg__header-sub">Your Karnataka expert · Powered by Foursquare</div>
          </div>
        </div>
        <button className="atg__ghost-btn" onClick={clearHistory} title="Clear history">
          🗑️ Clear
        </button>
      </div>

      {/* ── Messages Area or Hero ── */}
      {messages.length === 0 && !loading ? (
        <div className="atg__hero">
          <div className="atg__hero-icon" style={{ display: 'flex', justifyContent: 'center' }}><PAvatar size={80} /></div>
          <div className="atg__hero-title">Payana AI Travel Guide</div>
          <div className="atg__hero-sub">Your Karnataka expert · Powered by Foursquare</div>
        </div>
      ) : (
        <div className="atg__messages">
          {messages.map((msg, i) => (
            <MessageBubble key={msg.id} msg={msg} isNew={i >= newMsgIndex && newMsgIndex !== -1} />
          ))}
          <AnimatePresence>
            {loading && <TypingIndicator key="typing" />}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      )}

      {/* ── Quick Prompts ── */}
      {messages.length === 0 && !loading && (
        <motion.div
          className="atg__quick-prompts"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="atg__quick-label">✨ Try asking:</div>
          <div className="atg__quick-chips">
            {QUICK_PROMPTS.map((p, i) => (
              <motion.button 
                key={p.text} 
                className="atg__chip" 
                onClick={() => sendMessage(p.text)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.04) }}
              >
                <div className="atg__chip-badge" style={{ backgroundColor: p.color }}>{p.icon}</div>
                {p.text}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Input Bar ── */}
      <div className="atg__input-container">
        <div className="atg__input-bar">
          <input
            ref={inputRef}
            className="atg__input"
            type="text"
            placeholder="Ask about Karnataka — places, food, festivals, routes…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
            disabled={loading}
            maxLength={500}
          />
          <button
            className={`atg__send-btn ${loading ? 'atg__send-btn--loading' : ''}`}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            {loading ? '⏳' : '🚀'}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
