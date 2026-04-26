import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import anshImg from '../images/team/ansh.jpeg';
import krrishImg from '../images/team/krrish.jpeg';
import jashImg from '../images/team/jash.jpeg';

const teamMembers = [
    {
        name: 'Ansh Darji',
        role: 'Backend Developer & System Architect',
        description: 'Designed and implemented the backend architecture, built APIs, and handled server-side logic to ensure reliable communication between frontend and database.',
        image: anshImg,
        githubUrl: 'https://github.com/AnxhDarji',
        linkedinUrl: 'https://www.linkedin.com/in/anshdarji/',
    },
    {
        name: 'Krrish Bhardwaj',
        role: 'Database Engineer & Validation Specialist',
        description: 'Set up and structured the database, implemented form validation using Formik, and ensured data integrity across the application.',
        image: krrishImg,
        githubUrl: 'https://github.com/krrish-snippets',
        linkedinUrl: 'https://www.linkedin.com/in/krrish-bhardwaj-621945328/',
    },
    {
        name: 'Jash Baldha',
        role: 'Full Stack Developer & Admin Panel Lead',
        description: 'Developed additional core features and independently built the admin panel, including both frontend and backend functionality.',
        image: jashImg,
        githubUrl: 'https://github.com/jashbaldha09',
        linkedinUrl: 'https://www.linkedin.com/in/jashkumar-baldha-600b8131a',
    },
];

const About = () => {
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
                            About LinkCart
                        </h1>
                        <p className="mt-4 text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
                            LinkCart helps you share products, profiles, content, and all your important links from one clean,
                            mobile-friendly page — built with a modern purple gradient theme and a strong focus on speed.
                        </p>
                    </header>

                    <section className="theme-surface mb-14 rounded-3xl p-8 md:p-10">
                        <h2 className="mb-3 text-2xl font-bold md:text-3xl" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                            What we&apos;re building
                        </h2>
                        <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            LinkCart is designed to be your single sharing hub — a place where your audience can discover your
                            products, socials, and content instantly. We focus on a polished UI, dark mode support, secure flows,
                            and an experience that feels premium on every device.
                        </p>
                    </section>

                    <section>
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-extrabold md:text-4xl" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                Meet the Team
                            </h2>
                            <p className="mx-auto mt-3 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                                The people behind LinkCart — building the platform end-to-end.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {teamMembers.map((member) => (
                                <div
                                    key={member.name}
                                    className="theme-surface group flex h-full flex-col items-center rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                                >
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="h-28 w-28 rounded-full object-cover shadow-lg ring-2 ring-indigo-200"
                                        loading="lazy"
                                    />

                                    <h3 className="mt-5 text-2xl font-extrabold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                                        {member.name}
                                    </h3>
                                    <p className="mt-2 text-sm font-semibold text-indigo-600">{member.role}</p>
                                    <p className="mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        {member.description}
                                    </p>

                                    <div className="mt-6 flex items-center justify-center gap-5">
                                        <a
                                            href={member.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${member.name} LinkedIn`}
                                            className="text-xl transition-all duration-200 hover:scale-110 hover:text-purple-500"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            <FaLinkedin />
                                        </a>
                                        <a
                                            href={member.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${member.name} GitHub`}
                                            className="text-xl transition-all duration-200 hover:scale-110 hover:text-purple-500"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            <FaGithub />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
