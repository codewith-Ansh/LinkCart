import React from 'react';
import { Play } from 'lucide-react';

const VideoSection = () => {
    return (
        <section className="video-section">
            <div className="video-placeholder">
                <div className="video-inner">
                    <Play size={48} fill="currentColor" />
                    <span>-- VIDEO --</span>
                </div>
            </div>
            <button className="example-btn">View Example OneLink</button>
        </section>
    );
};

export default VideoSection;
