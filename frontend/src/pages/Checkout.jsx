import { useState } from 'react';
import api from '../api/api';
import { User, Mail, Phone, AlertCircle, Clock } from 'lucide-react';
import Hero from '../components/Hero';
import './Checkout.css';

const Checkout = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [ticketId, setTicketId] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.phone) {
            setError('Please fill in all details, including an active mobile number.');
            return;
        }

        setIsProcessing(true);

        try {
            console.log('Submitting registration form with data:', formData);
            const response = await api.post('/api/tickets', formData);
            console.log('Registration successful:', response.data);
            setTicketId(response.data.id);
            setIsProcessing(false);
            setIsSuccess(true);
        } catch (err) {
            console.error('Registration error:', err);
            console.error('Error response:', err.response);
            console.error('Error message:', err.message);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to submit registration. Please try again.';
            console.log('Setting error to:', errorMsg);
            setError(errorMsg);
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="checkout-page">
                <Hero />
                <main className="container checkout-container success-container animate-fade-in">
                <div className="success-card">
                    <Clock size={64} className="pending-icon" style={{ color: '#f59e0b' }} />
                    <h1 className="success-title">Registration Submitted!</h1>
                    <p className="success-message">
                        Thank you, {formData.name.split(' ')[0]}. Your ticket request is now <strong>pending approval</strong>.
                    </p>

                    <div className="payment-instructions animate-slide-up">
                        <h3>Lipa na M-PESA Details</h3>
                        <div className="payment-steps">
                            <div className="step">
                                <span className="step-number">1</span>
                                <p>Go to M-PESA menu, select <strong>Lipa na M-PESA</strong></p>
                            </div>
                            <div className="step">
                                <span className="step-number">2</span>
                                <p>Select <strong>Paybill</strong></p>
                            </div>
                            <div className="payment-details-card">
                                <div className="detail-row">
                                    <span>Business Number:</span>
                                    <strong>542542</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Account Number:</span>
                                    <strong>05508795176151</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Amount:</span>
                                    <strong>Ksh 2,000</strong>
                                </div>
                            </div>
                            <div className="step">
                                <span className="step-number">3</span>
                                <p>Enter amount and M-PESA PIN</p>
                            </div>
                        </div>
                    </div>

                    <p className="validation-note">
                        Once you complete the payment, an admin will verify the transaction and approve your ticket. You can then download your QR code ticket from the <strong>Verification Portal</strong>.
                    </p>
                </div>
                </main>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <Hero />
            <main className="container checkout-container">
            <h1 className="checkout-title animate-fade-in">Get Your Ticket</h1>
            <p className="checkout-subtitle animate-fade-in">Register your details to reserve your spot at the Eastern Region Dinner.</p>

            {error && (
                <div className="error-banner animate-fade-in">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="checkout-grid animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="checkout-form-col">
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h2>Personal Information</h2>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <div className="input-with-icon">
                                    <User size={20} className="input-icon" />
                                    <input type="text" id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-with-icon">
                                    <Mail size={20} className="input-icon" />
                                    <input type="email" id="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Active Mobile Number</label>
                                <div className="input-with-icon">
                                    <Phone size={20} className="input-icon" />
                                    <input type="tel" id="phone" name="phone" placeholder="+254 7XX XXX XXX" value={formData.phone} onChange={handleInputChange} required />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary submit-btn" disabled={isProcessing}>
                            {isProcessing ? 'Saving Details...' : 'Register for Ticket'}
                        </button>
                    </form>
                </div>

                <div className="checkout-summary-col">
                    <div className="summary-card">
                        <h2>Event Details</h2>
                        <div className="summary-item">
                            <span>Eastern Region Dinner</span>
                            <span>VIP</span>
                        </div>
                        <div className="summary-item">
                            <span>Ticket Price</span>
                            <span>$250.00</span>
                        </div>
                        <div className="summary-divider"></div>
                        <p className="summary-note">Fill in your details to reserve your ticket. Payment can be made in cash or via our digital portal after registration.</p>
                    </div>
                </div>
            </div>
            </main>
        </div>
    );
}

export default Checkout;
