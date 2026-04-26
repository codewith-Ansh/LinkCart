import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Privacy = () => {
    return (
        <div className="theme-page flex min-h-screen flex-col">
            <Navbar />

            <main className="flex-1 px-6 py-16 md:px-12 lg:px-20">
                <div className="mx-auto w-full max-w-5xl animate-fade-in">
                    <header className="mb-10 text-center">
                        <h1
                            className="hero-title-gradient bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl"
                            style={{ fontFamily: 'Clash Display, sans-serif' }}
                        >
                            Privacy Policy
                        </h1>
                        <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
                            We respect your privacy and aim to be transparent about how LinkCart handles your information.
                        </p>
                    </header>

                    <section className="theme-surface space-y-8 rounded-3xl p-8 md:p-10">
                        <div>
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                Information we collect
                            </h2>
                            <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                We may collect information you provide (like profile details, links, and listings) and basic usage
                                data needed to keep the app secure and performant.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                How we use information
                            </h2>
                            <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                We use information to operate LinkCart, improve features, prevent abuse, and provide a smoother
                                experience across devices.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                Cookies and storage
                            </h2>
                            <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                LinkCart may use cookies and local storage to keep you signed in and remember preferences (like
                                theme). You can control these in your browser settings.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                Security
                            </h2>
                            <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                We take reasonable measures to protect your data. No system is perfect, but we continuously work
                                to improve security and reliability.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                Contact
                            </h2>
                            <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                Questions about privacy? Visit the Contact page to reach us.
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Privacy;

