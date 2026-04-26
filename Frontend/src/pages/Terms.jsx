import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
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
                            Terms &amp; Conditions
                        </h1>
                        <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
                            These terms outline how LinkCart can be used responsibly.
                        </p>
                    </header>

                    <section className="theme-surface space-y-8 rounded-3xl p-8 md:p-10">
                        <div>
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                Using LinkCart
                            </h2>
                            <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                You agree to use LinkCart in a lawful and respectful way. Do not misuse the platform, attempt
                                unauthorized access, or disrupt services for other users.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                Content responsibility
                            </h2>
                            <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                You are responsible for any content, links, or listings you publish. Ensure information is
                                accurate and does not violate applicable laws or third‑party rights.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                Availability
                            </h2>
                            <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                We aim to keep LinkCart available and stable, but we do not guarantee uninterrupted access.
                                Features may change as the product evolves.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                Contact
                            </h2>
                            <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                If you have questions about these terms, please contact us.
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Terms;

