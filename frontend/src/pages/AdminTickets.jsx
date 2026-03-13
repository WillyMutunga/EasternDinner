import { useState, useEffect } from 'react';
import api from '../api/api';
import { LogIn, Check, X, User, Phone, Mail, Filter } from 'lucide-react';
import './AdminTickets.css';

const AdminTickets = () => {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));
    const [tickets, setTickets] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (token) {
            fetchTickets();
        }
    }, [token]);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/api/tickets/admin', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                handleLogout();
            }
            setError('Failed to fetch tickets');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/api/auth/login', { username, password });
            localStorage.setItem('adminToken', res.data.token);
            setToken(res.data.token);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
        setTickets([]);
    };

    const approveTicket = async (id) => {
        try {
            await api.patch(`/api/tickets/admin/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTickets();
        } catch (err) {
            setError('Failed to approve ticket');
        }
    };

    const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

    if (!token) {
        return (
            <main className="container admin-login-container">
                <div className="login-card">
                    <h1>Admin Login</h1>
                    {error && <div className="error-msg">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary login-btn">
                            <LogIn size={20} /> Login
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="container admin-dashboard">
            <div className="dashboard-header">
                <h1>Ticket Management</h1>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>

            <div className="filter-bar">
                <Filter size={20} />
                <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
                <button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
                <button className={filter === 'paid' ? 'active' : ''} onClick={() => setFilter('paid')}>Paid</button>
            </div>

            <div className="ticket-list">
                {filteredTickets.map(ticket => (
                    <div key={ticket.id} className={`admin-ticket-item ${ticket.status}`}>
                        <div className="ticket-user-info">
                            <div className="info-row">
                                <User size={16} /> <strong>{ticket.name}</strong>
                            </div>
                            <div className="info-row">
                                <Mail size={16} /> {ticket.email}
                            </div>
                            <div className="info-row">
                                <Phone size={16} /> {ticket.phone}
                            </div>
                        </div>
                        <div className="ticket-status-actions">
                            <span className={`status-text ${ticket.status}`}>{ticket.status}</span>
                            {ticket.status === 'pending' && (
                                <button onClick={() => approveTicket(ticket.id)} className="btn-approve">
                                    <Check size={16} /> Approve Cash
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default AdminTickets;
