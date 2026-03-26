import * as Yup from 'yup';
import { INDIAN_STATES } from './indianStatesData';

export { INDIAN_STATES };

export const loginSchema = Yup.object({
    email: Yup.string()
        .email('Enter a valid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
});

export const signupSchema = Yup.object({
    fullName: Yup.string()
        .matches(/^[a-zA-Z\s]+$/, 'Only alphabets and spaces allowed')
        .min(3, 'Full name must be at least 3 characters')
        .required('Full name is required'),
    email: Yup.string()
        .email('Enter a valid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Please confirm your password'),
});

// Common Indian address keywords
const ADDRESS_KEYWORDS = [
    'road', 'rd', 'street', 'st', 'nagar', 'colony', 'sector', 'phase',
    'block', 'plot', 'flat', 'floor', 'house', 'building', 'bldg', 'apt',
    'apartment', 'society', 'layout', 'extension', 'extn', 'enclave',
    'vihar', 'marg', 'path', 'lane', 'gali', 'chowk', 'bazaar', 'bazar',
    'market', 'cross', 'main', 'area', 'locality', 'town', 'village',
    'ward', 'district', 'near', 'opp', 'opposite', 'behind', 'next',
    'wing', 'tower', 'residency', 'heights', 'park', 'garden', 'hills',
    'puram', 'pur', 'ganj', 'gunj', 'wadi', 'pada', 'peth', 'nagara',
];

const isGibberish = (str) => {
    const letters = str.replace(/[^a-zA-Z]/g, '').toLowerCase();
    if (letters.length === 0) return false;

    // Vowel ratio — real words have at least 20% vowels
    const vowels = (letters.match(/[aeiou]/g) || []).length;
    const vowelRatio = vowels / letters.length;
    if (vowelRatio < 0.15) return true;

    // Detect consecutive consonant clusters longer than 4 (e.g. "hggyw", "cfywyi")
    if (/[^aeiou\s]{5,}/i.test(letters)) return true;

    // All words must be at most 15 chars (real address words aren't longer)
    const words = str.trim().split(/\s+/);
    if (words.some(w => /^[a-zA-Z]{12,}$/.test(w))) return true;

    return false;
};

const validateAddress = (value) => {
    if (!value) return true; // required handles empty
    const trimmed = value.trim().toLowerCase();

    // Must only contain valid address characters
    if (!/^[a-zA-Z0-9\s,./\-#()]+$/.test(value)) return false;

    // Must not be pure numbers
    if (/^[\d\s,]+$/.test(trimmed)) return false;

    // Must have at least 2 words
    const words = trimmed.split(/\s+/).filter(w => w.length > 0);
    if (words.length < 2) return false;

    // Must have at least one address keyword OR a house/plot number
    const hasKeyword = ADDRESS_KEYWORDS.some(kw => words.includes(kw) || trimmed.includes(kw));
    const hasNumber = /\d/.test(trimmed);
    if (!hasKeyword && !hasNumber) return false;

    // Gibberish detection on the letter-only portion
    if (isGibberish(trimmed)) return false;

    return true;
};

export const profileSchema = Yup.object({
    // Only 10 digits — +91 prefix is added by the UI
    phone: Yup.string()
        .matches(/^[6-9][0-9]{9}$/, 'Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9')
        .required('Phone number is required'),
    address: Yup.string()
        .min(8, 'Address must be at least 8 characters')
        .max(200, 'Address is too long')
        .test(
            'is-valid-address',
            'Enter a valid address (e.g. "12, MG Road" or "Flat 4, Sunrise Colony")',
            validateAddress
        )
        .required('Address is required'),
    state: Yup.string()
        .oneOf(INDIAN_STATES, 'Select a valid Indian state')
        .required('State is required'),
    city: Yup.string()
        .required('City is required'),
    pincode: Yup.string()
        .matches(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit Indian pincode')
        .required('Pincode is required'),
});
