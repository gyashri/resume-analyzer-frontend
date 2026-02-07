import React, { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';
import './JobMatches.css';

const JobMatches = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('in'); // Default to India

  const fetchMatchedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobAPI.getMatchedJobs({ location });
      setJobs(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to fetch job matches. Please try again.'
      );
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const getMatchScoreClass = (score) => {
    if (score >= 70) return 'match-excellent';
    if (score >= 50) return 'match-good';
    return 'match-fair';
  };

  const getMatchScoreLabel = (score) => {
    if (score >= 70) return 'Excellent Match';
    if (score >= 50) return 'Good Match';
    return 'Fair Match';
  };

  if (loading) {
    return (
      <div className="jobs-loading">
        <div className="spinner-large"></div>
        <p>Finding jobs that match your resume...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-error">
        <div className="error-icon">⚠️</div>
        <h3>Unable to Fetch Jobs</h3>
        <p>{error}</p>
        <button onClick={fetchMatchedJobs} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="job-matches-container">
      <div className="jobs-header">
        <div>
          <h2>Recommended Jobs</h2>
          <p>{jobs.length} jobs matched to your resume</p>
        </div>
        <div className="jobs-filters">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="location-select"
          >
            <option value="in">India</option>
            <option value="us">United States</option>
            <option value="gb">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
          </select>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="jobs-empty">
          <div className="empty-icon">💼</div>
          <h3>No Job Matches Yet</h3>
          <p>Upload a resume to get personalized job recommendations</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <div className="job-title-section">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="job-company">{job.company}</p>
                  <p className="job-location">📍 {job.location}</p>
                </div>
                <div
                  className={`job-match-badge ${getMatchScoreClass(
                    job.matchScore
                  )}`}
                >
                  <div className="match-score">{job.matchScore}%</div>
                  <div className="match-label">
                    {getMatchScoreLabel(job.matchScore)}
                  </div>
                </div>
              </div>

              <div className="job-salary">
                <span className="salary-icon">💰</span>
                <span>{job.salary}</span>
              </div>

              <div className="job-description">
                <p>
                  {job.description.substring(0, 200)}
                  {job.description.length > 200 ? '...' : ''}
                </p>
              </div>

              {job.matchedSkills && job.matchedSkills.length > 0 && (
                <div className="matched-skills">
                  <h4>Your Matching Skills:</h4>
                  <div className="skill-tags">
                    {job.matchedSkills.slice(0, 5).map((skill, index) => (
                      <span key={index} className="skill-tag">
                        ✓ {skill}
                      </span>
                    ))}
                    {job.matchedSkills.length > 5 && (
                      <span className="skill-tag-more">
                        +{job.matchedSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="job-footer">
                <span className="job-category">{job.category}</span>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-apply"
                >
                  Apply Now →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobMatches;
