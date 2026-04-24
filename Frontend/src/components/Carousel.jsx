import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../utils/api';
import UserAvatar from './UserAvatar';

const Carousel = () => {
    const scrollRef = useRef(null);
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeaturedUsers = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/users/featured`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data?.error || 'Failed to load featured creators');
                }

                setProfiles(Array.isArray(data?.users) ? data.users : []);
            } catch (error) {
                console.error('Failed to load featured creators:', error.message);
                setProfiles([]);
            } finally {
                setLoading(false);
            }
        };

        loadFeaturedUsers();
    }, []);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (!current) return;
        const scrollAmount = 320;
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="theme-section w-full px-6 py-24 md:px-12 lg:px-20">
            <h2 className="theme-text-primary mb-16 text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                Creators using LinkCart
            </h2>
            {!loading && profiles.length === 0 && (
                <p className="theme-text-secondary mb-10 text-center">
                    Featured creator profiles will appear here once they are available.
                </p>
            )}
            <div className="relative w-full">
                <button className="theme-surface theme-text-primary absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition-all hover:scale-110 hover:shadow-xl" onClick={() => scroll('left')}>
                    <ChevronLeft size={20} />
                </button>
                <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide scroll-smooth px-16" ref={scrollRef}>
                    {profiles.map((profile) => (
                        <div key={profile.custom_id} className="theme-surface group w-[300px] flex-shrink-0 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                            <UserAvatar
                                user={profile}
                                size="lg"
                                className="mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform"
                            />
                            <h3 className="theme-text-primary mb-2 text-lg font-bold">{profile.full_name}</h3>
                            <p className="theme-text-secondary mb-6 min-h-10 text-sm">
                                {profile.tagline || 'LinkCart creator'}
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
                <button className="theme-surface theme-text-primary absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full transition-all hover:scale-110 hover:shadow-xl" onClick={() => scroll('right')}>
                    <ChevronRight size={20} />
                </button>
            </div>
        </section>
    );
};

export default Carousel;
