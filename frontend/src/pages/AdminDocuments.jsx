import { useState, useEffect } from 'react';
import api, { API_URL } from '../api/api';
import { Upload, Trash2, FileText, Download, AlertCircle } from 'lucide-react';
import './AdminDocuments.css';

const AdminDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/documents');
            setDocuments(response.data);
        } catch (err) {
            setError('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('document', file);
        formData.append('name', name);

        try {
            await api.post('/api/documents/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess('Document uploaded successfully');
            setFile(null);
            setName('');
            fetchDocuments();
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        try {
            await api.delete(`/api/documents/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSuccess('Document deleted successfully');
            fetchDocuments();
        } catch (err) {
            setError('Failed to delete document');
        }
    };

    return (
        <div className="admin-documents-container">
            <h1>Event Documentation Management</h1>
            <p className="subtitle">Upload and manage materials for the attendees.</p>

            <div className="upload-section card">
                <h3>Upload New Document</h3>
                <form onSubmit={handleUpload}>
                    <div className="form-group">
                        <label>Display Name (optional)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Event Agenda" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="file-input-wrapper">
                        <input type="file" onChange={handleFileChange} id="file-upload" />
                        <label htmlFor="file-upload" className="file-label">
                            <Upload size={20} />
                            {file ? file.name : 'Choose File (PDF, DOC, Images)'}
                        </label>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload Document'}
                    </button>
                </form>
                {error && <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
            </div>

            <div className="documents-list card">
                <h3>Current Documents</h3>
                {loading ? (
                    <p>Loading documents...</p>
                ) : documents.length === 0 ? (
                    <p>No documents uploaded yet.</p>
                ) : (
                    <div className="docs-grid">
                        {documents.map((doc) => (
                            <div key={doc.id} className="doc-item">
                                <FileText className="doc-icon" />
                                <div className="doc-info">
                                    <span className="doc-name">{doc.name}</span>
                                    <span className="doc-meta">
                                        {(doc.size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="doc-actions">
                                    <a 
                                        href={`${API_URL}/${doc.path.replace(/\\/g, '/')}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="action-btn download"
                                        title="Download"
                                    >
                                        <Download size={18} />
                                    </a>
                                    <button 
                                        onClick={() => handleDelete(doc.id)} 
                                        className="action-btn delete"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDocuments;
