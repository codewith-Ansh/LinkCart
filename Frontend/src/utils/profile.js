export const getInitials = (name = '') =>
    name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('') || 'LC';

export const getDisplayName = (user) =>
    user?.full_name || user?.seller_name || user?.name || user?.custom_id || 'LinkCart User';

export const getProfileImage = (user) =>
    user?.profile_pic || user?.seller_profile_pic || '';
