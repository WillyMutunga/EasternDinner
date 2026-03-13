import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Countdown from './Countdown';
import './Hero.css';

function Hero() {
    // Set target date for the event to 30 days from now for preview
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 30);

    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        '/images/hero1.png',
        '/images/hero2.png',
        '/images/hero3.png'
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="hero-section">
            <div className="hero-slider">
                {slides.map((slide, index) => (
                    <div 
                        key={index} 
                        className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${slide})` }}
                    ></div>
                ))}
            </div>
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <h1 className="animate-fade-in hero-title">
                    <span className="title-accent">Eastern Region</span><br />
                    Gala Dinner
                </h1>
                <p className="animate-fade-in hero-subtitle">
                    An evening of exquisite dining, premium networking, and celebration of regional excellence.
                </p>

                <div className="animate-fade-in hero-glass-card">
                    <p className="rsvp-text">Join the Celebration In</p>
                    <Countdown targetDate={eventDate.toISOString()} />
                </div>

                <div className="hero-cta animate-fade-in">
                    <Link to="/checkout" className="btn btn-primary hero-btn main-cta">
                        Purchase Tickets
                    </Link>
                    <Link to="/check-ticket" className="btn btn-secondary hero-btn secondary-cta">
                        View Your Ticket
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default Hero;
