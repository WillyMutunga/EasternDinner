import { useState, useEffect } from 'react';
import api, { API_URL } from '../api/api';
import { Upload, Trash2, FileText, Download, AlertCircle, LogOut } from 'lucide-react';
import './AdminDocuments.css';

const AdminDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [token, setToken] = useState(localStorage.getItem('adminToken'));

    // If not logged in, show login prompt
    if (!token) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <h2>Admin Access Required</h2>
                <p>Please log in at <a href="/admin/tickets">/admin/tickets</a> first</p>
            </div>
        );
    }

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

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/tickets';
    };

    return (
        <div className="admin-documents-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Event Documentation Management</h1>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>
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
