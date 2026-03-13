import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="container nav-container">
                <Link to="/" className="nav-logo">
                    Eastern Region Dinner
                </Link>

                <div className="desktop-menu">
                    <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
                    <Link to="/announcements" className={`nav-link ${isActive('/announcements')}`}>Announcements</Link>
                    <Link to="/checkout" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '1rem' }}>Buy Tickets</Link>
                </div>

                <button className="mobile-menu-btn" onClick={toggleMenu}>
                    {isOpen ? <X size={28} color="var(--color-gold)" /> : <Menu size={28} color="var(--color-gold)" />}
                </button>
            </div>

            {isOpen && (
                <div className="mobile-menu animate-fade-in">
                    <Link to="/" className={`nav-link ${isActive('/')}`} onClick={toggleMenu}>Home</Link>
                    <Link to="/announcements" className={`nav-link ${isActive('/announcements')}`} onClick={toggleMenu}>Announcements</Link>
                    <Link to="/checkout" className="btn btn-primary" onClick={toggleMenu} style={{ marginTop: '1rem' }}>Buy Tickets</Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
