import { useState, useEffect } from 'react';
import api, { API_URL } from '../api/api';
import { FileText, Download, Search, AlertCircle } from 'lucide-react';
import './DocumentSection.css';

const DocumentSection = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/documents');
                setDocuments(response.data);
            } catch (err) {
                console.error('Failed to load documents');
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, []);

    if (!loading && documents.length === 0) return null;

    return (
        <section className="document-section">
            <div className="container">
                <h2 className="section-title">Event Documentation</h2>
                <p className="section-subtitle">Download important materials for the Eastern Region Dinner.</p>

                {loading ? (
                    <div className="loading-spinner">Loading materials...</div>
                ) : (
                    <div className="document-grid">
                        {documents.map((doc) => (
                            <div key={doc.id} className="document-card">
                                <div className="doc-icon-wrapper">
                                    <FileText size={32} />
                                </div>
                                <div className="doc-details">
                                    <h4>{doc.name}</h4>
                                    <span className="doc-meta">
                                        {(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.mimetype.split('/')[1].toUpperCase()}
                                    </span>
                                </div>
                                <a 
                                    href={`${API_URL}/${doc.path.replace(/\\/g, '/')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="action-btn download"
                                    title="Download"
                                >
                                    <Download size={20} />
                                    Download
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DocumentSection;
