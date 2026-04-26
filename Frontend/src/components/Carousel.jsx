import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../utils/api';

const Carousel = () => {
    const scrollRef          = useRef(null);
    const navigate           = useNavigate();
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/api/users/featured`)
            .then((res) => res.json())
            .then((data) => setProfiles(Array.isArray(data?.users) ? data.users : []))
            .catch(() => setProfiles([]));
    }, []);

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
    };

    if (profiles.length === 0) return null;

    return (
        <section className="theme-section w-full px-6 py-24 md:px-12 lg:px-20">
            <h2
                className="theme-text-primary mb-16 text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
                Creators using LinkCart
            </h2>

            <div className="relative w-full">
                <button
                    className="theme-surface theme-text-primary absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition-all hover:scale-110 hover:shadow-xl"
                    onClick={() => scroll('left')}
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide scroll-smooth px-16" ref={scrollRef}>
                    {profiles.map((profile) => (
                        <div
                            key={profile.custom_id}
                            className="theme-surface group w-[300px] flex-shrink-0 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            {/* Avatar — profile pic or initials fallback */}
                            {profile.profile_pic ? (
                                <img
                                    src={profile.profile_pic}
                                    alt={profile.full_name}
                                    className="mx-auto mb-6 w-20 h-20 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    {profile.full_name?.charAt(0) ?? '?'}
                                </div>
                            )}

                            <h3 className="theme-text-primary mb-2 text-lg font-bold">{profile.full_name}</h3>
                            <p className="theme-text-secondary mb-6 text-sm min-h-[40px]">
                                {profile.tagline || 'Active on LinkCart'}
                            </p>

                            <button
                                className="theme-btn-secondary rounded-xl border-2 border-indigo-500 px-6 py-2.5 font-semibold text-indigo-600 transition-all duration-300 hover:scale-105 hover:bg-indigo-500 hover:text-white"
                                onClick={() => navigate(`/user/${profile.custom_id}`)}
                            >
                                Visit Profile
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    className="theme-surface theme-text-primary absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition-all hover:scale-110 hover:shadow-xl"
                    onClick={() => scroll('right')}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </section>
    );
};

export default Carousel;
