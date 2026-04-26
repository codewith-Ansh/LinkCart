import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
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
                            Contact Us
                        </h1>
                        <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
                            Need help, have feedback, or want to report an issue? We&apos;re here.
                        </p>
                    </header>

                    <section className="theme-surface rounded-3xl p-8 md:p-10">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                    Support
                                </h2>
                                <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    For product issues, account help, or general questions, email us and we&apos;ll respond as soon
                                    as possible.
                                </p>
                                <a
                                    href="https://mail.google.com/mail/?view=cm&to=linkcart.dev@gmail.com&su=LinkCart%20Support"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200"
                                >
                                    Email Support
                                </a>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                    Partnerships
                                </h2>
                                <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    Interested in collaborating or integrating with LinkCart? Reach out and tell us what you have
                                    in mind.
                                </p>
                                <a
                                    href="https://mail.google.com/mail/?view=cm&to=linkcart.dev@gmail.com&su=LinkCart%20Partnership%20Inquiry"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="theme-btn-secondary mt-5 inline-flex items-center justify-center rounded-xl border px-6 py-3 font-bold transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    Contact Partnerships
                                </a>
                            </div>
                        </div>

                        <div className="mt-10 rounded-2xl border border-indigo-200 bg-indigo-50 p-6" style={{ borderColor: 'var(--border-strong)' }}>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                Note: These pages are informational. For account-specific actions, please use the in-app flows
                                (Login, Settings, Dashboard).
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;

