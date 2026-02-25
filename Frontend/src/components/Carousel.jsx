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
        const scrollAmount = 320;
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="w-full py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16 tracking-tight" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                Creators using LinkCart
            </h2>
            <div className="relative w-full">
                <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-slate-200 w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg hover:shadow-xl hover:scale-110 transition-all" onClick={() => scroll('left')}>
                    <ChevronLeft size={20} />
                </button>
                <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide scroll-smooth px-16" ref={scrollRef}>
                    {profiles.map((profile) => (
                        <div key={profile.id} className="flex-shrink-0 w-[300px] bg-white p-8 rounded-2xl border border-slate-200 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform"></div>
                            <h3 className="font-bold text-lg mb-2">{profile.name}</h3>
                            <p className="text-gray-600 text-sm mb-6">{profile.desc}</p>
                            <button className="border-2 border-indigo-500 text-indigo-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-500 hover:text-white transition-all duration-300 hover:scale-105">
                                View OneLink
                            </button>
                        </div>
                    ))}
                </div>
                <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-slate-200 w-12 h-12 rounded-full flex items-center justify-center z-10 shadow-lg hover:shadow-xl hover:scale-110 transition-all" onClick={() => scroll('right')}>
                    <ChevronRight size={20} />
                </button>
            </div>
        </section>
    );
};

export default Carousel;
