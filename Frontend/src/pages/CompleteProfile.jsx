import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Phone, MapPin, Home, Hash, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { profileSchema } from '../utils/validationSchemas';
import { INDIAN_STATES_CITIES } from '../utils/indianStatesData';
import API_BASE from '../utils/api';
import { useAppContext } from '../context/AppContext';

const STATE_PINCODE_ZONES = {
    'Jammu and Kashmir': ['18', '19'], 'Ladakh': ['19'], 'Himachal Pradesh': ['17'],
    'Punjab': ['14', '15', '16'], 'Chandigarh': ['16'], 'Uttarakhand': ['24', '26'],
    'Haryana': ['12', '13'], 'Delhi': ['11'], 'Rajasthan': ['30', '31', '32', '33', '34'],
    'Uttar Pradesh': ['20', '21', '22', '23', '24', '25', '26', '27', '28'],
    'Bihar': ['80', '81', '82', '83', '84', '85'], 'Sikkim': ['73'],
    'Arunachal Pradesh': ['79'], 'Nagaland': ['79'], 'Manipur': ['79'],
    'Mizoram': ['79'], 'Tripura': ['79'], 'Meghalaya': ['79'], 'Assam': ['78'],
    'West Bengal': ['70', '71', '72', '73', '74'],
    'Jharkhand': ['82', '83', '84', '85'], 'Odisha': ['75', '76', '77'],
    'Chhattisgarh': ['49'], 'Madhya Pradesh': ['45', '46', '47', '48', '49'],
    'Gujarat': ['36', '37', '38', '39'],
    'Dadra and Nagar Haveli and Daman and Diu': ['39'],
    'Maharashtra': ['40', '41', '42', '43', '44'], 'Goa': ['40'],
    'Karnataka': ['56', '57', '58', '59'], 'Andhra Pradesh': ['50', '51', '52', '53'],
    'Telangana': ['50'], 'Tamil Nadu': ['60', '61', '62', '63', '64'],
    'Kerala': ['67', '68', '69'], 'Lakshadweep': ['68'],
    'Puducherry': ['60', '53'], 'Andaman and Nicobar Islands': ['74'],
};

const fieldState = (touched, error, value) => {
    if (touched && error)           return 'border-red-400 focus:ring-red-100 focus:border-red-400';
    if (touched && !error && value) return 'border-emerald-400 focus:ring-emerald-100 focus:border-emerald-400';
    return 'border-slate-200 focus:ring-indigo-100 focus:border-indigo-400';
};

const inputBase = 'theme-input w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-4 transition-all duration-200';

const FieldError = ({ touched, error }) =>
    touched && error ? (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-400" />{error}
        </p>
    ) : null;

const Label = ({ icon, children }) => {
    const IconComponent = icon;

    return (
        <label className="theme-label mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
            <IconComponent size={12} className="text-indigo-400" />{children}
        </label>
    );
};

const CompleteProfile = () => {
    const [userId, setUserId]       = useState('');
    const [serverError, setServerError] = useState('');
    const [loading, setLoading]     = useState(true);
    const navigate = useNavigate();
    const { refreshCurrentUser } = useAppContext();

    const formik = useFormik({
        initialValues: { phone: '', address: '', state: '', city: '', pincode: '' },
        validationSchema: profileSchema,
        enableReinitialize: true,
        validate: (values) => {
            const errors = {};
            if (values.pincode && values.pincode.length === 6 && values.state) {
                const zones = STATE_PINCODE_ZONES[values.state];
                if (zones && !zones.includes(values.pincode.substring(0, 2))) {
                    errors.pincode = `Pincode does not match the selected state (${values.state})`;
                }
            }
            return errors;
        },
        onSubmit: async (values, { setSubmitting }) => {
            setServerError('');
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }
            try {
                const response = await fetch(`${API_BASE}/api/profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ phone: `+91${values.phone}`, address: values.address, state: values.state, city: values.city, pincode: values.pincode }),
                });
                const data = await response.json();
                if (!response.ok) { setServerError(data.error || 'Failed to save profile'); return; }
                await refreshCurrentUser();
                navigate('/');
            } catch {
                setServerError('Server error. Please try again later.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleStateChange = (e) => {
        formik.setFieldValue('state', e.target.value);
        formik.setFieldValue('city', '');
        formik.setFieldValue('pincode', '');
        formik.setFieldTouched('city', false);
        formik.setFieldTouched('pincode', false);
    };

    const handlePhoneChange = (e) => {
        formik.setFieldValue('phone', e.target.value.replace(/\D/g, '').slice(0, 10));
    };

    const handlePincodeChange = (e) => {
        formik.setFieldValue('pincode', e.target.value.replace(/\D/g, '').slice(0, 6));
    };

    const citiesForState = formik.values.state ? (INDIAN_STATES_CITIES[formik.values.state] || []) : [];

    useEffect(() => {
        const token    = localStorage.getItem('token');
        const customId = localStorage.getItem('customId');
        if (!token) { navigate('/login'); return; }
        setUserId(customId || '');
        fetch(`${API_BASE}/api/profile`, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                if (data.profile) {
                    const raw = data.profile.phone || '';
                    formik.setValues({
                        phone:   raw.startsWith('+91') ? raw.slice(3) : raw,
                        address: data.profile.address || '',
                        state:   data.profile.state   || '',
                        city:    data.profile.city    || '',
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
                <div className="theme-page min-h-[calc(100vh-80px)] flex items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-indigo-500" />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="theme-page min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-14">

                {/* decorative blobs */}
                <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                    <div style={{ width: 500, height: 500, top: '-140px', left: '-140px', background: 'radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
                    <div style={{ width: 420, height: 420, bottom: '-100px', right: '-80px', background: 'radial-gradient(circle, rgba(168,85,247,0.09) 0%, transparent 70%)', position: 'absolute', borderRadius: '50%' }} />
                </div>

                <div className="w-full max-w-2xl animate-fade-in">

                    {/* brand + avatar header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold shadow-lg shadow-indigo-200 mb-3">
                            {userId.charAt(0).toUpperCase() || '?'}
                        </div>
                        <p className="theme-text-primary text-sm font-semibold">{userId}</p>
                        <p className="theme-text-muted mt-0.5 text-xs">Complete your profile to get started</p>
                    </div>

                    {/* card */}
                    <div className="theme-surface rounded-2xl p-8 backdrop-blur-xl">

                        <h2 className="theme-text-primary mb-1 text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                            Complete Your Profile
                        </h2>
                        <p className="theme-text-secondary mb-6 text-sm">Fill in your details to unlock all features</p>

                        {serverError && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 animate-fade-in">
                                <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">!</span>
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5" noValidate>

                            {/* Phone */}
                            <div>
                                <Label icon={Phone}>Phone Number</Label>
                                <div className={`theme-input flex items-center overflow-hidden rounded-xl border transition-all duration-200
                                    ${formik.touched.phone && formik.errors.phone
                                        ? 'border-red-400 ring-4 ring-red-100'
                                        : formik.touched.phone && !formik.errors.phone && formik.values.phone
                                        ? 'border-emerald-400 ring-4 ring-emerald-100'
                                        : 'border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100'
                                    }`}>
                                    <span className="theme-subtle-panel theme-text-secondary whitespace-nowrap border-r border-slate-200 px-4 py-3 text-sm font-semibold select-none">
                                        +91
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="10-digit mobile number"
                                        value={formik.values.phone}
                                        onChange={handlePhoneChange}
                                        onBlur={formik.handleBlur}
                                        maxLength={10}
                                        inputMode="numeric"
                                        className="theme-text-primary flex-1 bg-transparent px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none"
                                    />
                                </div>
                                <FieldError touched={formik.touched.phone} error={formik.errors.phone} />
                            </div>

                            {/* Address */}
                            <div>
                                <Label icon={Home}>Address</Label>
                                <textarea
                                    name="address"
                                    placeholder="e.g. 12, MG Road, Andheri West"
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    rows={2}
                                    className={`${inputBase} ${fieldState(formik.touched.address, formik.errors.address, formik.values.address)} resize-none`}
                                />
                                <FieldError touched={formik.touched.address} error={formik.errors.address} />
                            </div>

                            {/* State + City side by side on md+ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label icon={MapPin}>State</Label>
                                    <select
                                        name="state"
                                        value={formik.values.state}
                                        onChange={handleStateChange}
                                        onBlur={formik.handleBlur}
                                        className={`${inputBase} ${fieldState(formik.touched.state, formik.errors.state, formik.values.state)}`}
                                    >
                                        <option value="">Select State</option>
                                        {Object.keys(INDIAN_STATES_CITIES).sort().map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <FieldError touched={formik.touched.state} error={formik.errors.state} />
                                </div>

                                <div>
                                    <Label icon={MapPin}>City</Label>
                                    <select
                                        name="city"
                                        value={formik.values.city}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={!formik.values.state}
                                        className={`${inputBase} ${fieldState(formik.touched.city, formik.errors.city, formik.values.city)} disabled:cursor-not-allowed disabled:opacity-70`}
                                    >
                                        <option value="">{formik.values.state ? 'Select City' : 'Select a state first'}</option>
                                        {citiesForState.sort().map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <FieldError touched={formik.touched.city} error={formik.errors.city} />
                                </div>
                            </div>

                            {/* Pincode */}
                            <div>
                                <Label icon={Hash}>Pincode</Label>
                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="6-digit pincode"
                                    value={formik.values.pincode}
                                    onChange={handlePincodeChange}
                                    onBlur={formik.handleBlur}
                                    maxLength={6}
                                    inputMode="numeric"
                                    disabled={!formik.values.city}
                                    className={`${inputBase} ${fieldState(formik.touched.pincode, formik.errors.pincode, formik.values.pincode)} disabled:cursor-not-allowed disabled:opacity-70`}
                                />
                                <FieldError touched={formik.touched.pincode} error={formik.errors.pincode} />
                                {formik.values.state && !formik.errors.pincode && formik.values.pincode.length === 6 && (
                                    <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 size={12} />Pincode matches {formik.values.state}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="mt-1 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm
                                    bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                                    hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0
                                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                                    disabled:hover:shadow-none disabled:hover:translate-y-0"
                            >
                                {formik.isSubmitting
                                    ? <><Loader2 size={16} className="animate-spin" />Saving...</>
                                    : <><span>Save Profile</span><ArrowRight size={16} /></>
                                }
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
