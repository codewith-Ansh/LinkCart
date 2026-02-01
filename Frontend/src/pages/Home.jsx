import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Carousel from '../components/Carousel';
import VideoSection from '../components/VideoSection';
import Features from '../components/Features';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="home-container">
            <Navbar />
            <Hero />
            <Carousel />
            <VideoSection />
            <Features />
            <Footer />
        </div>
    );
};

export default Home;
