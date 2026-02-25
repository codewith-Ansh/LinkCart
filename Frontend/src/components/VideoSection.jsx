import React from 'react';
import { Play } from 'lucide-react';

const VideoSection = () => {
    return (
        <section className="w-full py-24 px-6 md:px-12 lg:px-20 flex flex-col items-center gap-12 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="w-full max-w-5xl aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-indigo-300 hover:scale-[1.02] transition-transform duration-300">
                <div className="flex flex-col items-center gap-4 text-indigo-600">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Play size={32} fill="currentColor" />
                    </div>
                    <span className="font-semibold text-lg">Watch Demo Video</span>
                </div>
            </div>
            <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300">
                View Example OneLink
            </button>
        </section>
    );
};

export default VideoSection;
