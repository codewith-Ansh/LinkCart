import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = () => {
    const scrollRef = useRef(null);

    const profiles = [
        { id: 1, name: 'Alice Johnson', desc: 'Digital Artist & Illustrator' },
        { id: 2, name: 'Bob Smith', desc: 'Tech Enthusiast & Blogger' },
        { id: 3, name: 'Charlie Brown', desc: 'Content Creator' },
        { id: 4, name: 'Diana Prince', desc: 'Marketing Guru' },
        { id: 5, name: 'Ethan Hunt', desc: 'Fitness Coach' },
    ];

    const scroll = (direction) => {
        const { current } = scrollRef;
        const scrollAmount = 300;
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="carousel-section">
            <h2>Creators using LinkCart</h2>
            <div className="carousel-wrapper">
                <button className="scroll-btn left" onClick={() => scroll('left')}><ChevronLeft /></button>
                <div className="carousel-container" ref={scrollRef}>
                    {profiles.map((profile) => (
                        <div key={profile.id} className="profile-card">
                            <div className="profile-avatar"></div>
                            <h3>{profile.name}</h3>
                            <p>{profile.desc}</p>
                            <button className="view-link-btn">View OneLink</button>
                        </div>
                    ))}
                </div>
                <button className="scroll-btn right" onClick={() => scroll('right')}><ChevronRight /></button>
            </div>
        </section>
    );
};

export default Carousel;
