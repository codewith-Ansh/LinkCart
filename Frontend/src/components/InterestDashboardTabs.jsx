import React from 'react';
import { Link } from 'react-router-dom';

const tabs = [
    { href: '/dashboard/interests', label: 'Incoming Requests' },
    { href: '/dashboard/my-requests', label: 'My Requests' },
];

const InterestDashboardTabs = ({ activePath }) => (
    <div className="mb-8 flex flex-wrap gap-3">
        {tabs.map((tab) => {
            const isActive = activePath === tab.href;

            return (
                <Link
                    key={tab.href}
                    to={tab.href}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                        isActive
                            ? 'bg-purple-600 text-white'
                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    {tab.label}
                </Link>
            );
        })}
    </div>
);

export default InterestDashboardTabs;
