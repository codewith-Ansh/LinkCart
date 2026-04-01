import React from 'react';

const badgeMap = {
    active: 'border border-purple-100 bg-purple-50 text-purple-700',
    in_progress: 'border border-violet-100 bg-violet-50 text-violet-700',
    sold: 'border border-gray-200 bg-gray-100 text-gray-700',
};

const labelMap = {
    active: 'Active',
    in_progress: 'In Deal',
    sold: 'Sold',
};

const ProductStatusBadge = ({ status = 'active', className = '' }) => (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeMap[status] || badgeMap.active} ${className}`.trim()}>
        {labelMap[status] || 'Active'}
    </span>
);

export default ProductStatusBadge;
