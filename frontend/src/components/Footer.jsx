function Footer() {
    return (
        <footer style={{
            backgroundColor: 'var(--color-bg-card)',
            padding: '3rem 0',
            marginTop: 'auto',
            borderTop: '1px solid rgba(212, 175, 55, 0.2)'
        }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Eastern Region Dinner</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '400px' }}>
                    Join us for an unforgettable evening of prestige and elegance.
                </p>
                <div style={{ marginTop: '1rem', color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.8rem' }}>
                    &copy; {new Date().getFullYear()} Eastern Region Dinner. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
