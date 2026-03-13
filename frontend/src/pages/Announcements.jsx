import { Calendar } from 'lucide-react';
import Hero from '../components/Hero';

const announcementsData = [
    {
        id: 1,
        title: 'Keynote Speaker Announced: Young Leaders Conference',
        date: 'March 15, 2026',
        excerpt: 'We are thrilled to welcome Dr. Vance, a leading voice in regional development, to share her vision for the future of our community during the gala dinner.',
        image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 2,
        title: 'A Culinary Journey: Sneak Peek at the Menu',
        date: 'March 10, 2026',
        excerpt: 'Our executive chefs have curated a five-course meal celebrating local ingredients with a modern twist. Expect bold flavors and exquisite presentation.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 3,
        title: 'Silent Auction Items Preview',
        date: 'March 5, 2026',
        excerpt: 'From luxury getaways to exclusive artworks, get ready to bid on incredible items. All proceeds go toward the Eastern Region Scholarship Fund.',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
];

function Announcements() {
    return (
        <div className="announcements-page">
            <Hero />
            <main className="container" style={{ paddingBottom: '6rem', minHeight: '60vh' }}>
            <h1 className="animate-fade-in" style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem' }}>
                Announcements
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '800px', margin: '0 auto' }}>
                {announcementsData.map((post, index) => (
                    <article
                        key={post.id}
                        className="animate-fade-in"
                        style={{
                            animationDelay: `${index * 0.2}s`,
                            backgroundColor: 'var(--color-bg-card)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            border: '1px solid rgba(212, 175, 55, 0.1)'
                        }}
                    >
                        <div style={{ height: '300px', width: '100%', overflow: 'hidden' }}>
                            <img
                                src={post.image}
                                alt={post.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            />
                        </div>
                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                <Calendar size={16} color="var(--color-gold)" />
                                {post.date}
                            </div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--color-text-main)' }}>{post.title}</h2>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                                {post.excerpt}
                            </p>
                            <button className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                                Read More
                            </button>
                        </div>
                    </article>
                ))}
            </div>
            </main>
        </div>
    );
}

export default Announcements;
