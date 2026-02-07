import React, { useState, useRef } from 'react';
import { resumeAPI } from '../services/api';
import './FileUpload.css';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (selectedFile) => {
    setError('');

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }

      const response = await resumeAPI.upload(formData);

      // Pass the analysis data to parent component
      onUploadSuccess(response.data.data);

      // Reset form
      setFile(null);
      setJobDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Upload failed. Please try again.';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-header">
        <h2>Upload Your Resume</h2>
        <p>Get AI-powered insights to improve your resume</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="upload-form">
        {/* File Drop Zone */}
        <div
          className={`drop-zone ${dragActive ? 'drag-active' : ''} ${
            file ? 'has-file' : ''
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />

          <div className="drop-zone-content">
            {file ? (
              <>
                <svg
                  className="icon icon-file"
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
                <p className="file-name">{file.name}</p>
                <p className="file-size">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  className="btn-change-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Change File
                </button>
              </>
            ) : (
              <>
                <svg
                  className="icon icon-upload"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="drop-text">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="drop-hint">PDF or DOCX (max 5MB)</p>
              </>
            )}
          </div>
        </div>

        {/* Job Description (Optional) */}
        <div className="form-group">
          <label htmlFor="jobDescription">
            Job Description (Optional)
            <span className="label-hint">
              - Get tailored suggestions for a specific role
            </span>
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to get resume matching insights..."
            rows={6}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-analyze"
          disabled={!file || uploading}
        >
          {uploading ? (
            <>
              <span className="spinner"></span>
              Analyzing... This may take a few seconds
            </>
          ) : (
            'Analyze Resume'
          )}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
