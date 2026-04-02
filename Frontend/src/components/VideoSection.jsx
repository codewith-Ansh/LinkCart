import React from 'react';
import demoVideo from '../../videos/LinkCart_Video.mp4';

const VideoSection = () => {
    return (
        <section id="demo-video" className="w-full py-24 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-12 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-indigo-200 bg-black shadow-xl hover:scale-[1.02] transition-transform duration-300">
                <video
                    className="w-full aspect-video object-contain"
                    autoPlay
                    controls
                    loop
                    muted
                    playsInline
                    preload="metadata"
                >
                    <source src={demoVideo} type="video/mp4" />
                    Your browser does not support the demo video.
                </video>
            </div>
            <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300">
                View Example OneLink
            </button>
        </section>
    );
};

export default VideoSection;
