import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI } from '../services/api';
import FileUpload from './FileUpload';
import ResumeResults from './ResumeResults';
import ResumeHistory from './ResumeHistory';
import JobMatches from './JobMatches';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'history', or 'jobs'
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchResumes();
    }
  }, [activeTab]);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await resumeAPI.getMyResumes();
      setResumes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (analysisData) => {
    // Extract analysis object from resume data
    setCurrentAnalysis(analysisData.analysis || analysisData);
    // Refresh resume history
    fetchResumes();
  };

  const handleViewResume = async (resumeId) => {
    try {
      const response = await resumeAPI.getResumeById(resumeId);
      // Extract analysis object from resume data
      setCurrentAnalysis(response.data.data.analysis || response.data.data);
      setActiveTab('upload'); // Switch to upload tab to show results
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await resumeAPI.deleteResume(resumeId);
      fetchResumes(); // Refresh list
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <h1>AI Resume Analyzer</h1>
          </div>
          <div className="user-menu">
            {user?.role === 'admin' && (
              <button onClick={() => navigate('/admin')} className="btn btn-admin">
                Admin Panel
              </button>
            )}
            <span className="user-name">Hello, {user?.name}!</span>
            <button onClick={logout} className="btn btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          New Analysis
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History ({resumes.length})
        </button>
        <button
          className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Job Matches 💼
        </button>
      </div>

      {/* Main Content */}
      <main className="dashboard-content">
        {activeTab === 'upload' && (
          <div className="upload-section">
            {!currentAnalysis ? (
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            ) : (
              <ResumeResults
                analysis={currentAnalysis}
                onNewAnalysis={handleNewAnalysis}
              />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <ResumeHistory
              resumes={resumes}
              loading={loading}
              onView={handleViewResume}
              onDelete={handleDeleteResume}
            />
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <JobMatches />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
