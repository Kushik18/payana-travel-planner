/* ================================================================
   ExpenseTracker.jsx — Full Expense Management System
================================================================ */
import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import './AllCss/ExpenseTracker.css';

/* ── Categories config ── */
const CATEGORIES = [
  { id: 'Food',        icon: '🍽️', color: '#10b981', bg: 'rgba(16,185,129,.15)'  },
  { id: 'Fuel',        icon: '⛽',  color: '#f59e0b', bg: 'rgba(245,158,11,.15)'  },
  { id: 'Hotel',       icon: '🏨',  color: '#8b5cf6', bg: 'rgba(139,92,246,.15)'  },
  { id: 'Shopping',    icon: '🛍️',  color: '#ec4899', bg: 'rgba(236,72,153,.15)'  },
  { id: 'Tickets',     icon: '🎟️',  color: '#f97316', bg: 'rgba(249,115,22,.15)'  },
  { id: 'Transport',   icon: '🚗',  color: '#3b82f6', bg: 'rgba(59,130,246,.15)'  },
  { id: 'Activities',  icon: '🥾',  color: '#06b6d4', bg: 'rgba(6,182,212,.15)'   },
  { id: 'Other',       icon: '📦',  color: '#94a3b8', bg: 'rgba(148,163,184,.15)' },
];

function getCat(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

const EMPTY_FORM = {
  category: 'Food',
  amount: '',
  description: '',
  expenseDate: new Date().toISOString().split('T')[0],
};

/* ── Expense Item Row ── */
function ExpenseItem({ expense, onEdit, onDelete, isEditing }) {
  const cat = getCat(expense.category);
  return (
    <motion.div
      className={`et__item ${isEditing ? 'et__item--editing' : ''}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      layout
    >
      <div className="et__item-icon">{cat.icon}</div>
      <div className="et__item-body">
        <div className="et__item-top">
          <div className="et__item-desc">{expense.description || expense.category}</div>
          <div className="et__item-amount">₹{Number(expense.amount).toLocaleString('en-IN')}</div>
        </div>
        <div className="et__item-meta">
          <span className="et__item-cat" style={{ background: cat.bg, color: cat.color }}>{cat.icon} {expense.category}</span>
          <span className="et__item-date">📅 {expense.expenseDate}</span>
        </div>
      </div>
      <div className="et__item-actions">
        <button className="et__icon-btn et__icon-btn--edit" onClick={() => onEdit(expense)} title="Edit">✏️</button>
        <button className="et__icon-btn et__icon-btn--del"  onClick={() => onDelete(expense.id)} title="Delete">🗑️</button>
      </div>
    </motion.div>
  );
}

/* ================================================================
   MAIN COMPONENT
================================================================ */
export default function ExpenseTracker() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const userId = user?.useremail || 'guest';

  const [expenses,   setExpenses]   = useState([]);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [editId,     setEditId]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [catFilter,  setCatFilter]  = useState('All');

  /* ── Load expenses ── */
  const loadExpenses = React.useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/api/expenses/user/${encodeURIComponent(userId)}`);
      setExpenses(data);
    } catch {
      toast.error('Could not load expenses. Ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { loadExpenses(); }, [loadExpenses]);

  /* ── Submit (create / update) ── */
  const handleSubmit = async () => {
    if (!form.amount || !form.category) { toast.warn('Please fill in amount and category.'); return; }
    setSaving(true);
    try {
      const payload = { ...form, userId, amount: parseFloat(form.amount) };

      if (editId) {
        await axiosInstance.put(`/api/expenses/update/${editId}`, payload);
        toast.success('Expense updated!');
      } else {
        await axiosInstance.post('/api/expenses/create', payload);
        toast.success('Expense added!');
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      await loadExpenses();
    } catch {
      toast.error('Failed to save expense.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Edit ── */
  const handleEdit = (expense) => {
    setForm({
      category:    expense.category,
      amount:      String(expense.amount),
      description: expense.description || '',
      expenseDate: expense.expenseDate || new Date().toISOString().split('T')[0],
    });
    setEditId(expense.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await axiosInstance.delete(`/api/expenses/delete/${id}`);
      toast.success('Expense deleted');
      await loadExpenses();
    } catch {
      toast.error('Failed to delete expense.');
    }
  };

  const cancelEdit = () => { setForm(EMPTY_FORM); setEditId(null); };

  /* ── Stats ── */
  const totalSpend  = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const avgPerDay   = expenses.length ? (totalSpend / new Set(expenses.map(e => e.expenseDate)).size || 1) : 0;
  const topCategory = (() => {
    const map = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + Number(e.amount || 0); });
    return Object.entries(map).sort((a,b) => b[1]-a[1])[0]?.[0] || '-';
  })();

  /* ── Filter ── */
  const displayed = catFilter === 'All'
    ? expenses
    : expenses.filter(e => e.category === catFilter);

  const allUsedCats = ['All', ...new Set(expenses.map(e => e.category))];

  return (
    <div className="et">
      <div className="et__column">
      <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', zIndex: 10 }}>← Back</button>
      {/* Header */}
      <motion.div className="et__header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
        <div className="et__eyebrow">💰 Travel Finance</div>
        <h1 className="et__title">Expense <span>Tracker</span></h1>
        <p className="et__subtitle">Track every rupee of your Karnataka adventure. Categorize, analyze, and stay on budget.</p>
      </motion.div>

      {/* Stats Band */}
      <motion.div className="et__total-band" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .15 }}>
        <div className="et__stat">
          <div className="et__stat-icon" style={{ background: 'rgba(168,85,247,.15)' }}>💰</div>
          <div>
            <div className="et__stat-value">₹{totalSpend.toLocaleString('en-IN')}</div>
            <div className="et__stat-label">Total Spent</div>
          </div>
        </div>
        <div className="et__stat">
          <div className="et__stat-icon" style={{ background: 'rgba(59,130,246,.15)' }}>📋</div>
          <div>
            <div className="et__stat-value">{expenses.length}</div>
            <div className="et__stat-label">Transactions</div>
          </div>
        </div>
        <div className="et__stat">
          <div className="et__stat-icon" style={{ background: 'rgba(16,185,129,.15)' }}>📆</div>
          <div>
            <div className="et__stat-value">₹{Math.round(avgPerDay).toLocaleString('en-IN')}</div>
            <div className="et__stat-label">Avg per Day</div>
          </div>
        </div>
        <div className="et__stat">
          <div className="et__stat-icon" style={{ background: 'rgba(245,158,11,.15)' }}>🏆</div>
          <div>
            <div className="et__stat-value">{getCat(topCategory).icon} {topCategory}</div>
            <div className="et__stat-label">Top Category</div>
          </div>
        </div>
      </motion.div>

      <div className="et__layout">
        {/* ── Add / Edit Panel ── */}
        <motion.div className="et__card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, delay: .1 }}>
          <div className="et__card-title">
            {editId ? '✏️ Edit Expense' : '➕ Add Expense'}
          </div>

          {/* Category chips */}
          <div className="et__field">
            <label className="et__label">Category</label>
            <div className="et__cat-chips">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`et__cat-chip ${form.category === cat.id ? 'et__cat-chip--active' : ''}`}
                  style={form.category === cat.id ? { background: cat.bg, borderColor: cat.color, color: cat.color } : {}}
                  onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                >
                  {cat.icon} {cat.id}
                </button>
              ))}
            </div>
          </div>

          {/* Amount + Date */}
          <div className="et__form-row">
            <div className="et__field" style={{ margin: 0 }}>
              <label className="et__label">Amount (₹)</label>
              <input
                className="et__input"
                type="number"
                placeholder="e.g. 500"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div className="et__field" style={{ margin: 0 }}>
              <label className="et__label">Date</label>
              <input
                className="et__input"
                type="date"
                value={form.expenseDate}
                onChange={e => setForm(f => ({ ...f, expenseDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="et__field" style={{ marginTop: '.9rem' }}>
            <label className="et__label">Description</label>
            <textarea
              className="et__textarea"
              placeholder="e.g. Dinner at Coorg homestay…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <button
            className={`et__add-btn ${editId ? 'et__update-btn' : ''}`}
            onClick={handleSubmit}
            disabled={saving || !form.amount}
          >
            {saving ? '⏳ Saving…' : editId ? '💾 Update Expense' : '➕ Add Expense'}
          </button>

          {editId && (
            <button className="et__cancel-btn" onClick={cancelEdit}>✕ Cancel Edit</button>
          )}

          {/* Quick-add demo data button */}
          <div style={{ marginTop: '1.25rem', padding: '.9rem', background: 'rgba(168,85,247,.05)', border: '1px solid rgba(168,85,247,.15)', borderRadius: 12 }}>
            <div style={{ fontSize: '.72rem', color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.4rem' }}>💡 Tip</div>
            <div style={{ fontSize: '.8rem', color: '#64748b', lineHeight: 1.6 }}>
              Add expenses as you travel and check the <strong style={{ color: '#c4b5fd' }}>Analytics Dashboard</strong> to see where you're spending the most.
            </div>
          </div>
        </motion.div>

        {/* ── Expense List Panel ── */}
        <motion.div className="et__card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, delay: .2 }}>
          <div className="et__list-header">
            <div className="et__card-title" style={{ margin: 0 }}>
              📋 Transactions ({displayed.length})
            </div>
            <div className="et__filter-row">
              {allUsedCats.map(cat => (
                <button
                  key={cat}
                  className={`et__filter-chip ${catFilter === cat ? 'et__filter-chip--active' : ''}`}
                  onClick={() => setCatFilter(cat)}
                >
                  {cat === 'All' ? '🗂️ All' : `${getCat(cat).icon} ${cat}`}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="et__empty"><div className="et__empty-icon">⏳</div>Loading expenses…</div>
          ) : displayed.length === 0 ? (
            <div className="et__empty">
              <div className="et__empty-icon">💸</div>
              {expenses.length === 0
                ? 'No expenses yet. Start by adding your first trip expense!'
                : 'No expenses in this category.'}
            </div>
          ) : (
            <div className="et__items">
              <AnimatePresence>
                {displayed.map(e => (
                  <ExpenseItem
                    key={e.id}
                    expense={e}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isEditing={editId === e.id}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
      </div>
    </div>
  );
}
