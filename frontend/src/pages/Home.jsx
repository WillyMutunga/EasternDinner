import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Ticket } from 'lucide-react';
import Hero from '../components/Hero';
import DocumentSection from '../components/DocumentSection';
import './Home.css';

function Home() {
    // Set target date for the event to 30 days from now for preview
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 30);

    return (
        <main className="home-page">
            <Hero />

            {/* Event Details Section */}
            <section className="details-section">
                <div className="container">
                    <h2 className="section-title text-center">Event Details</h2>
                    <div className="details-grid">
                        <div className="detail-card">
                            <Calendar className="detail-icon" />
                            <h3>Date</h3>
                            <p>{eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>

                        <div className="detail-card">
                            <Clock className="detail-icon" />
                            <h3>Time</h3>
                            <p>6:00 PM Reception<br />7:30 PM Dinner</p>
                        </div>

                        <div className="detail-card">
                            <MapPin className="detail-icon" />
                            <h3>Venue</h3>
                            <p>The Grand Ballroom<br />Eastern Horizon Hotel</p>
                        </div>

                        <div className="detail-card">
                            <Ticket className="detail-icon" />
                            <h3>Dress Code</h3>
                            <p>Formal / Black Tie<br />Deep Gold & Royal Blue accents encouraged</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Document Section */}
            <DocumentSection />

            {/* Validation Info Section */}
            <section className="validation-section">
                <div className="container validation-container">
                    <div className="validation-text">
                        <h2>Seamless Ticketing</h2>
                        <p>
                            Your experience begins the moment you purchase your ticket. Upon a successful checkout,
                            you will receive a unique, secure 6-digit alphanumeric code via email.
                        </p>
                        <p className="highlight-text">
                            Simply present this code at the gates for quick and elegant entry into the gala.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <Link to="/checkout" className="btn btn-secondary">
                                Reserve Now
                            </Link>
                            <Link to="/check-ticket" className="btn btn-outline" style={{ background: 'transparent', border: '1px solid var(--secondary-color)', color: 'var(--secondary-color)', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 'bold' }}>
                                Verify Ticket
                            </Link>
                        </div>
                    </div>
                    <div className="validation-graphic">
                        <div className="mock-ticket">
                            <div className="ticket-header">VIP ADMISSION</div>
                            <div className="ticket-body">
                                <span className="code-label">YOUR ENTRY CODE</span>
                                <span className="code-value">E7Z9A2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Home;
