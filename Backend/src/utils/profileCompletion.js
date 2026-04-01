const REQUIRED_PROFILE_FIELDS = ["phoneNumber", "email", "location"];

const getTrimmedValue = (value) => (typeof value === "string" ? value.trim() : "");

const getLocationValue = (user = {}) => {
    const explicitLocation = getTrimmedValue(user.location);

    if (explicitLocation) {
        return explicitLocation;
    }

    return [user.city, user.state]
        .map(getTrimmedValue)
        .filter(Boolean)
        .join(", ");
};

const getProfileCompletionDetails = (user = {}) => {
    const normalizedProfile = {
        phoneNumber: getTrimmedValue(user.phoneNumber || user.phone),
        email: getTrimmedValue(user.email),
        location: getLocationValue(user),
    };

    const missingFields = REQUIRED_PROFILE_FIELDS.filter((field) => !normalizedProfile[field]);
    const completionPercentage = Math.round(
        ((REQUIRED_PROFILE_FIELDS.length - missingFields.length) / REQUIRED_PROFILE_FIELDS.length) * 100
    );

    return {
        normalizedProfile,
        missingFields,
        completionPercentage,
    };
};

function isProfileComplete(user) {
    return getProfileCompletionDetails(user).missingFields.length === 0;
}

module.exports = {
    REQUIRED_PROFILE_FIELDS,
    getProfileCompletionDetails,
    isProfileComplete,
};
