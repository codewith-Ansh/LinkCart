import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { profileSchema } from '../utils/validationSchemas';
import { INDIAN_STATES_CITIES } from '../utils/indianStatesData';

// Indian pincode first-digit ranges by state (approximate zone validation)
const STATE_PINCODE_ZONES = {
    'Jammu and Kashmir': ['18', '19'],
    'Ladakh': ['19'],
    'Himachal Pradesh': ['17'],
    'Punjab': ['14', '15', '16'],
    'Chandigarh': ['16'],
    'Uttarakhand': ['24', '26'],
    'Haryana': ['12', '13'],
    'Delhi': ['11'],
    'Rajasthan': ['30', '31', '32', '33', '34'],
    'Uttar Pradesh': ['20', '21', '22', '23', '24', '25', '26', '27', '28'],
    'Bihar': ['80', '81', '82', '83', '84', '85'],
    'Sikkim': ['73'],
    'Arunachal Pradesh': ['79'],
    'Nagaland': ['79'],
    'Manipur': ['79'],
    'Mizoram': ['79'],
    'Tripura': ['79'],
    'Meghalaya': ['79'],
    'Assam': ['78'],
    'West Bengal': ['70', '71', '72', '73', '74'],
    'Jharkhand': ['82', '83', '84', '85'],
    'Odisha': ['75', '76', '77'],
    'Chhattisgarh': ['49'],
    'Madhya Pradesh': ['45', '46', '47', '48', '49'],
    'Gujarat': ['36', '37', '38', '39'],
    'Dadra and Nagar Haveli and Daman and Diu': ['39'],
    'Maharashtra': ['40', '41', '42', '43', '44'],
    'Goa': ['40'],
    'Karnataka': ['56', '57', '58', '59'],
    'Andhra Pradesh': ['50', '51', '52', '53'],
    'Telangana': ['50'],
    'Tamil Nadu': ['60', '61', '62', '63', '64'],
    'Kerala': ['67', '68', '69'],
    'Lakshadweep': ['68'],
    'Puducherry': ['60', '53'],
    'Andaman and Nicobar Islands': ['74'],
};

const fieldClass = (touched, error, value) => {
    const base = 'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-white';
    if (touched && error) return `${base} border-red-400 focus:ring-red-300`;
    if (touched && !error && value) return `${base} border-green-400 focus:ring-green-300`;
    return `${base} border-slate-300 focus:ring-primary`;
};

const FieldError = ({ touched, error }) =>
    touched && error ? <span className="text-red-500 text-xs mt-1 block">{error}</span> : null;

const CompleteProfile = () => {
    const [userId, setUserId] = useState('');
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { phone: '', address: '', state: '', city: '', pincode: '' },
        validationSchema: profileSchema,
        enableReinitialize: true,
        validate: (values) => {
            const errors = {};
            // Pincode zone validation against selected state
            if (values.pincode && values.pincode.length === 6 && values.state) {
                const zones = STATE_PINCODE_ZONES[values.state];
                if (zones) {
                    const prefix = values.pincode.substring(0, 2);
                    if (!zones.includes(prefix)) {
                        errors.pincode = `Pincode does not match the selected state (${values.state})`;
                    }
                }
            }
            return errors;
        },
        onSubmit: async (values, { setSubmitting }) => {
            setServerError('');
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }
            try {
                const payload = {
                    phone: `+91${values.phone}`,
                    address: values.address,
                    state: values.state,
                    city: values.city,
                    pincode: values.pincode,
                };
                const response = await fetch('http://localhost:5000/api/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();
                if (!response.ok) { setServerError(data.error || 'Failed to save profile'); return; }
                navigate('/');
            } catch {
                setServerError('Server error. Please try again later.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    // When state changes, reset city and pincode
    const handleStateChange = (e) => {
        formik.setFieldValue('state', e.target.value);
        formik.setFieldValue('city', '');
        formik.setFieldValue('pincode', '');
        formik.setFieldTouched('city', false);
        formik.setFieldTouched('pincode', false);
    };

    // Only allow digits in phone field
    const handlePhoneChange = (e) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
        formik.setFieldValue('phone', digits);
    };

    // Only allow digits in pincode field
    const handlePincodeChange = (e) => {
        const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
        formik.setFieldValue('pincode', digits);
    };

    const citiesForState = formik.values.state ? (INDIAN_STATES_CITIES[formik.values.state] || []) : [];

    useEffect(() => {
        const token = localStorage.getItem('token');
        const customId = localStorage.getItem('customId');
        if (!token) { navigate('/login'); return; }
        setUserId(customId || '');

        fetch('http://localhost:5000/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (data.profile) {
                    const rawPhone = data.profile.phone || '';
                    // Strip +91 prefix if stored with it
                    const phoneDigits = rawPhone.startsWith('+91') ? rawPhone.slice(3) : rawPhone;
                    formik.setValues({
                        phone: phoneDigits,
                        address: data.profile.address || '',
                        state: data.profile.state || '',
                        city: data.profile.city || '',
                        pincode: data.profile.pincode || '',
                    });
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [navigate]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-slate-50">
                    <div className="text-xl text-slate-600">Loading...</div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-12">
                <div className="w-full max-w-2xl">
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                {userId.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="mt-3 text-xl font-semibold text-slate-800">{userId}</h2>
                        </div>

                        <h2 className="font-heading text-3xl font-bold text-center mb-2">Complete Your Profile</h2>
                        <p className="text-slate-600 text-center mb-8 text-sm">Please provide your details to continue</p>

                        {serverError && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 text-center border border-red-200">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4" noValidate>

                            {/* Phone — +91 prefix locked, user enters 10 digits */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Phone Number</label>
                                <div className={`flex items-center border rounded-xl overflow-hidden transition-all ${
                                    formik.touched.phone && formik.errors.phone
                                        ? 'border-red-400'
                                        : formik.touched.phone && !formik.errors.phone && formik.values.phone
                                        ? 'border-green-400'
                                        : 'border-slate-300'
                                }`}>
                                    <span className="px-4 py-3 bg-slate-100 text-slate-600 font-semibold text-sm border-r border-slate-300 select-none whitespace-nowrap">
                                        +91
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter 10-digit mobile number"
                                        value={formik.values.phone}
                                        onChange={handlePhoneChange}
                                        onBlur={formik.handleBlur}
                                        maxLength={10}
                                        inputMode="numeric"
                                        className="flex-1 px-4 py-3 focus:outline-none focus:ring-0 bg-white text-slate-800"
                                    />
                                </div>
                                <FieldError touched={formik.touched.phone} error={formik.errors.phone} />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Address</label>
                                <textarea
                                    name="address"
                                    placeholder="e.g. 12, MG Road, Andheri West"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    rows="2"
                                    className={`${fieldClass(formik.touched.address, formik.errors.address, formik.values.address)} resize-none`}
                                />
                                <FieldError touched={formik.touched.address} error={formik.errors.address} />
                            </div>

                            {/* State dropdown — first */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">State</label>
                                <select
                                    name="state"
                                    value={formik.values.state}
                                    onChange={handleStateChange}
                                    onBlur={formik.handleBlur}
                                    className={fieldClass(formik.touched.state, formik.errors.state, formik.values.state)}
                                >
                                    <option value="">Select State</option>
                                    {Object.keys(INDIAN_STATES_CITIES).sort().map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <FieldError touched={formik.touched.state} error={formik.errors.state} />
                            </div>

                            {/* City dropdown — depends on state */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">City</label>
                                <select
                                    name="city"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={!formik.values.state}
                                    className={`${fieldClass(formik.touched.city, formik.errors.city, formik.values.city)} disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400`}
                                >
                                    <option value="">
                                        {formik.values.state ? 'Select City' : 'Select a state first'}
                                    </option>
                                    {citiesForState.sort().map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <FieldError touched={formik.touched.city} error={formik.errors.city} />
                            </div>

                            {/* Pincode */}
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="Enter 6-digit pincode"
                                    value={formik.values.pincode}
                                    onChange={handlePincodeChange}
                                    onBlur={formik.handleBlur}
                                    maxLength={6}
                                    inputMode="numeric"
                                    disabled={!formik.values.city}
                                    className={`${fieldClass(formik.touched.pincode, formik.errors.pincode, formik.values.pincode)} disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400`}
                                />
                                <FieldError touched={formik.touched.pincode} error={formik.errors.pincode} />
                                {formik.values.state && !formik.errors.pincode && formik.values.pincode.length === 6 && (
                                    <span className="text-green-600 text-xs mt-1 block">✓ Pincode matches {formik.values.state}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="bg-primary text-white font-semibold px-4 py-3 rounded-xl hover:bg-primary-dark transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {formik.isSubmitting ? 'Saving...' : 'Save Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CompleteProfile;
