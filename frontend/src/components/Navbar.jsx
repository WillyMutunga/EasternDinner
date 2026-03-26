import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if admin is logged in
        const adminToken = localStorage.getItem('adminToken');
        setIsAdminLoggedIn(!!adminToken);
    }, [location]); // Update when location changes

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAdminLoggedIn(false);
        setIsOpen(false);
        navigate('/');
    };

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
                    
                    {isAdminLoggedIn && (
                        <>
                            <Link to="/admin/tickets" className={`nav-link ${isActive('/admin/tickets')}`}>Admin Tickets</Link>
                            <Link to="/admin/documents" className={`nav-link ${isActive('/admin/documents')}`}>Admin Documents</Link>
                            <button onClick={handleLogout} className="nav-link logout-btn">
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    )}
                    
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
                    
                    {isAdminLoggedIn && (
                        <>
                            <Link to="/admin/tickets" className={`nav-link ${isActive('/admin/tickets')}`} onClick={toggleMenu}>Admin Tickets</Link>
                            <Link to="/admin/documents" className={`nav-link ${isActive('/admin/documents')}`} onClick={toggleMenu}>Admin Documents</Link>
                            <button onClick={handleLogout} className="nav-link logout-btn" style={{ width: '100%', textAlign: 'left' }}>
                                <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Logout
                            </button>
                        </>
                    )}
                    
                    <Link to="/checkout" className="btn btn-primary" onClick={toggleMenu} style={{ marginTop: '1rem' }}>Buy Tickets</Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
