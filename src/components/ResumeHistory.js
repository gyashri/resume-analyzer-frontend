import React from 'react';
import './ResumeHistory.css';

const ResumeHistory = ({ resumes, loading, onView, onDelete }) => {
  if (loading) {
    return (
      <div className="history-loading">
        <div className="spinner"></div>
        <p>Loading your resumes...</p>
      </div>
    );
  }

  if (!resumes || resumes.length === 0) {
    return (
      <div className="history-empty">
        <svg
          className="empty-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3>No Resumes Yet</h3>
        <p>Upload your first resume to get started!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    return 'score-poor';
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>Your Resume History</h3>
        <p>{resumes.length} total resumes analyzed</p>
      </div>

      <div className="history-grid">
        {resumes.map((resume) => (
          <div key={resume._id} className="history-card">
            <div className="card-header">
              <div className="card-title">
                <svg className="card-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h4>{resume.originalFileName || 'Resume'}</h4>
                  <p className="card-date">{formatDate(resume.createdAt)}</p>
                </div>
              </div>
              <div className={`card-score ${getScoreClass(resume.analysis?.matchScore || 0)}`}>
                {resume.analysis?.matchScore || 0}%
              </div>
            </div>

            <div className="card-summary">
              <p>
                {resume.analysis?.aiSummary?.substring(0, 120)}
                {resume.analysis?.aiSummary?.length > 120 ? '...' : ''}
              </p>
            </div>

            <div className="card-stats">
              <div className="stat">
                <span className="stat-label">Found Skills</span>
                <span className="stat-value">
                  {(resume.analysis?.foundKeywords?.hardSkills?.length || 0) +
                    (resume.analysis?.foundKeywords?.softSkills?.length || 0)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Missing Skills</span>
                <span className="stat-value">
                  {(resume.analysis?.missingKeywords?.hardSkills?.length || 0) +
                    (resume.analysis?.missingKeywords?.softSkills?.length || 0)}
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Tips</span>
                <span className="stat-value">
                  {resume.analysis?.actionableTips?.length || 0}
                </span>
              </div>
            </div>

            <div className="card-actions">
              <button
                onClick={() => onView(resume._id)}
                className="btn btn-view"
              >
                View Details
              </button>
              <button
                onClick={() => onDelete(resume._id)}
                className="btn btn-delete"
              >
                <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeHistory;
