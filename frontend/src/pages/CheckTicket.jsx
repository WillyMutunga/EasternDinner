import { useState } from 'react';
import api from '../api/api';
import Hero from '../components/Hero';
import TicketCard from '../components/TicketCard';
import './CheckTicket.css';

const CheckTicket = () => {
    const [contact, setContact] = useState('');
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setTicket(null);

        try {
            const response = await api.get(`/api/tickets/verify?contact=${contact}`);
            setTicket(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to verify ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="check-ticket-page">
            <Hero />
            <div className="check-ticket-container" style={{ paddingBottom: '6rem' }}>
            <div className="check-ticket-card">
                <h2>Ticket Verification Portal</h2>
                <p>Enter your email or phone number to check your ticket status and view your card.</p>

                <form onSubmit={handleVerify} className="verify-form">
                    <input
                        type="text"
                        placeholder="Email or Phone Number"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Check Status'}
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}

                {ticket && (
                    <div className="result-container">
                        {ticket.status === 'paid' ? (
                            <TicketCard ticket={ticket} />
                        ) : (
                            <div className="pending-status">
                                <h3>Status: {ticket.status.toUpperCase()}</h3>
                                <p>Your ticket is currently pending admin approval. Please ensure you have made the payment.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default CheckTicket;
