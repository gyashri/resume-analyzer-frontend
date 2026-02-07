import React from 'react';
import './ResumeResults.css';

const ResumeResults = ({ analysis, onNewAnalysis }) => {
  if (!analysis) return null;

  const { matchScore, missingKeywords, foundKeywords, actionableTips, aiSummary } =
    analysis;

  // Get score color based on percentage
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  // Get score label
  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  // Priority badge colors
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Resume Analysis Results</h2>
        <button onClick={onNewAnalysis} className="btn btn-secondary">
          New Analysis
        </button>
      </div>

      {/* Match Score Card */}
      <div className="score-card">
        <div className="score-content">
          <div
            className="score-circle"
            style={{
              background: `conic-gradient(${getScoreColor(
                matchScore
              )} ${matchScore}%, #e5e7eb ${matchScore}%)`,
            }}
          >
            <div className="score-inner">
              <div className="score-value">{matchScore}%</div>
              <div className="score-label">{getScoreLabel(matchScore)}</div>
            </div>
          </div>
          <div className="score-summary">
            <h3>Overall Match Score</h3>
            <p>{aiSummary}</p>
          </div>
        </div>
      </div>

      {/* Keywords Section */}
      <div className="keywords-section">
        <div className="keywords-grid">
          {/* Found Keywords */}
          <div className="keywords-card found-keywords">
            <h3>
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Found Skills
            </h3>
            <div className="keywords-content">
              {foundKeywords?.hardSkills?.length > 0 && (
                <div className="keyword-group">
                  <h4>Hard Skills</h4>
                  <div className="keyword-tags">
                    {foundKeywords.hardSkills.map((skill, index) => (
                      <span key={index} className="tag tag-green">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {foundKeywords?.softSkills?.length > 0 && (
                <div className="keyword-group">
                  <h4>Soft Skills</h4>
                  <div className="keyword-tags">
                    {foundKeywords.softSkills.map((skill, index) => (
                      <span key={index} className="tag tag-blue">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {foundKeywords?.certifications?.length > 0 && (
                <div className="keyword-group">
                  <h4>Certifications</h4>
                  <div className="keyword-tags">
                    {foundKeywords.certifications.map((cert, index) => (
                      <span key={index} className="tag tag-purple">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="keywords-card missing-keywords">
            <h3>
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Missing Skills
            </h3>
            <div className="keywords-content">
              {missingKeywords?.hardSkills?.length > 0 && (
                <div className="keyword-group">
                  <h4>Hard Skills</h4>
                  <div className="keyword-tags">
                    {missingKeywords.hardSkills.map((skill, index) => (
                      <span key={index} className="tag tag-red">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {missingKeywords?.softSkills?.length > 0 && (
                <div className="keyword-group">
                  <h4>Soft Skills</h4>
                  <div className="keyword-tags">
                    {missingKeywords.softSkills.map((skill, index) => (
                      <span key={index} className="tag tag-orange">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {missingKeywords?.certifications?.length > 0 && (
                <div className="keyword-group">
                  <h4>Recommended Certifications</h4>
                  <div className="keyword-tags">
                    {missingKeywords.certifications.map((cert, index) => (
                      <span key={index} className="tag tag-yellow">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Tips */}
      {actionableTips && actionableTips.length > 0 && (
        <div className="tips-section">
          <h3>Improvement Suggestions</h3>
          <div className="tips-list">
            {actionableTips.map((tip, index) => (
              <div key={index} className="tip-card">
                <div className="tip-header">
                  <span
                    className="tip-priority"
                    style={{
                      backgroundColor: getPriorityColor(tip.priority),
                    }}
                  >
                    {tip.priority || 'Medium'}
                  </span>
                  <span className="tip-category">
                    {tip.category || 'General'}
                  </span>
                </div>
                <p className="tip-suggestion">{tip.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeResults;
