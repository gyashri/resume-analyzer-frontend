import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'overview') fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'resumes') fetchResumes();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getResumes();
      setResumes(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete "${userName}" and all their data?`)) {
      return;
    }
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter((u) => u._id !== userId));
      if (stats) {
        setStats({
          ...stats,
          stats: { ...stats.stats, totalUsers: stats.stats.totalUsers - 1 },
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change this user's role to "${newRole}"?`)) {
      return;
    }
    try {
      await adminAPI.updateUserRole(userId, newRole);
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusClass = (status) => {
    if (status === 'completed') return 'status-completed';
    if (status === 'failed') return 'status-failed';
    return 'status-processing';
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Admin Panel</h1>
          <span className="admin-badge">ADMIN</span>
        </div>
        <div className="admin-header-right">
          <button onClick={() => navigate('/dashboard')} className="btn btn-back">
            User Dashboard
          </button>
          <span className="admin-user">{user?.name}</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </header>

      <nav className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length || '...'})
        </button>
        <button
          className={`admin-tab ${activeTab === 'resumes' ? 'active' : ''}`}
          onClick={() => setActiveTab('resumes')}
        >
          All Resumes ({resumes.length || '...'})
        </button>
      </nav>

      <main className="admin-content">
        {error && (
          <div className="admin-error">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="btn btn-primary">
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="admin-loading">
            <div className="spinner-large"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && stats && <OverviewTab stats={stats} formatDate={formatDate} getStatusClass={getStatusClass} />}
            {activeTab === 'users' && (
              <UsersTab
                users={users}
                currentUserId={user?._id}
                onDelete={handleDeleteUser}
                onRoleChange={handleRoleChange}
                formatDate={formatDate}
              />
            )}
            {activeTab === 'resumes' && (
              <ResumesTab resumes={resumes} formatDate={formatDate} getStatusClass={getStatusClass} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

// ========== OVERVIEW TAB ==========
const OverviewTab = ({ stats, formatDate, getStatusClass }) => (
  <div className="overview-tab">
    <div className="stats-grid">
      <div className="stat-card stat-users">
        <div className="stat-icon">👥</div>
        <div className="stat-info">
          <h3>{stats.stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
      </div>
      <div className="stat-card stat-resumes">
        <div className="stat-icon">📄</div>
        <div className="stat-info">
          <h3>{stats.stats.totalResumes}</h3>
          <p>Total Resumes</p>
        </div>
      </div>
      <div className="stat-card stat-completed">
        <div className="stat-icon">✅</div>
        <div className="stat-info">
          <h3>{stats.stats.completedResumes}</h3>
          <p>Completed</p>
        </div>
      </div>
      <div className="stat-card stat-failed">
        <div className="stat-icon">❌</div>
        <div className="stat-info">
          <h3>{stats.stats.failedResumes}</h3>
          <p>Failed</p>
        </div>
      </div>
      <div className="stat-card stat-score">
        <div className="stat-icon">📊</div>
        <div className="stat-info">
          <h3>{stats.stats.averageScore}%</h3>
          <p>Avg Score</p>
        </div>
      </div>
    </div>

    <div className="recent-sections">
      <div className="recent-section">
        <h3>Recent Users</h3>
        <div className="recent-list">
          {stats.recentUsers.map((u) => (
            <div key={u._id} className="recent-item">
              <div className="recent-item-info">
                <strong>{u.name}</strong>
                <span>{u.email}</span>
              </div>
              <div className="recent-item-meta">
                <span className={`role-badge role-${u.role}`}>{u.role}</span>
                <span className="recent-date">{formatDate(u.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-section">
        <h3>Recent Analyses</h3>
        <div className="recent-list">
          {stats.recentResumes.map((r) => (
            <div key={r._id} className="recent-item">
              <div className="recent-item-info">
                <strong>{r.originalFileName}</strong>
                <span>{r.user?.name || 'Unknown'}</span>
              </div>
              <div className="recent-item-meta">
                <span className={`status-badge ${getStatusClass(r.status)}`}>{r.status}</span>
                {r.analysis?.matchScore != null && (
                  <span className="score-badge">{r.analysis.matchScore}%</span>
                )}
                <span className="recent-date">{formatDate(r.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ========== USERS TAB ==========
const UsersTab = ({ users, currentUserId, onDelete, onRoleChange, formatDate }) => (
  <div className="users-tab">
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Resumes</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>
                <strong>{u.name}</strong>
                {u._id === currentUserId && <span className="you-badge">You</span>}
              </td>
              <td>{u.email}</td>
              <td>
                <span className={`role-badge role-${u.role}`}>{u.role}</span>
              </td>
              <td>{u.resumeCount}</td>
              <td>{formatDate(u.createdAt)}</td>
              <td>
                {u._id !== currentUserId ? (
                  <div className="action-buttons">
                    <button
                      onClick={() => onRoleChange(u._id, u.role)}
                      className="btn btn-sm btn-role"
                      title={`Make ${u.role === 'admin' ? 'User' : 'Admin'}`}
                    >
                      {u.role === 'admin' ? 'Demote' : 'Promote'}
                    </button>
                    <button
                      onClick={() => onDelete(u._id, u.name)}
                      className="btn btn-sm btn-delete"
                      title="Delete user"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ========== RESUMES TAB ==========
const ResumesTab = ({ resumes, formatDate, getStatusClass }) => (
  <div className="resumes-tab">
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>User</th>
            <th>Status</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {resumes.map((r) => (
            <tr key={r._id}>
              <td><strong>{r.originalFileName}</strong></td>
              <td>{r.user?.name || 'Deleted User'} <span className="text-muted">({r.user?.email})</span></td>
              <td>
                <span className={`status-badge ${getStatusClass(r.status)}`}>{r.status}</span>
              </td>
              <td>
                {r.status === 'completed' && r.analysis?.matchScore != null ? (
                  <span className="score-badge">{r.analysis.matchScore}%</span>
                ) : (
                  '-'
                )}
              </td>
              <td>{formatDate(r.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;
