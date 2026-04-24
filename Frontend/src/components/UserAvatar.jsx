import React from 'react';
import { getDisplayName, getInitials, getProfileImage } from '../utils/profile';

const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-[120px] h-[120px] text-3xl',
};

const UserAvatar = ({ user, className = '', size = 'md', style }) => {
    const image = getProfileImage(user);
    const name = getDisplayName(user);
    const dimensionClass = sizeClasses[size] || sizeClasses.md;

    if (image) {
        return (
            <img
                src={image}
                alt={name}
                style={style}
                className={`${dimensionClass} rounded-full object-cover shadow-lg ${className}`.trim()}
            />
        );
    }

    return (
        <div
            aria-label={name}
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', ...(style || {}) }}
            className={`${dimensionClass} flex items-center justify-center rounded-full font-bold text-white ${className}`.trim()}
            role="img"
        >
            {getInitials(name)}
        </div>
    );
};

export default UserAvatar;
