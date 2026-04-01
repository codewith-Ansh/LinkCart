import React from 'react';
import { getDisplayName, getInitials, getProfileImage } from '../utils/profile';

const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-[120px] h-[120px] text-3xl',
};

const UserAvatar = ({ user, className = '', size = 'md' }) => {
    const image = getProfileImage(user);
    const name = getDisplayName(user);
    const dimensionClass = sizeClasses[size] || sizeClasses.md;

    if (image) {
        return (
            <img
                src={image}
                alt={name}
                className={`${dimensionClass} rounded-full object-cover shadow-lg ${className}`.trim()}
            />
        );
    }

    return (
        <div
            aria-label={name}
            className={`${dimensionClass} flex items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600 ${className}`.trim()}
        >
            {getInitials(name)}
        </div>
    );
};

export default UserAvatar;
