import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, message, type };
        
        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
    const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
    const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);
    const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);

    const getToastColors = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800';
            case 'error':
                return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
            case 'warning':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
            case 'info':
            default:
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800';
        }
    };

    const getToastIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />;
            case 'info':
            default:
                return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
        }
    };

    return (
        <ToastContext.Provider value={{ success, error, warning, info }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-start gap-3 p-4 border rounded-xl shadow-lg transition-all duration-300 ease-in-out transform scale-100 opacity-100 translate-y-0 ${getToastColors(toast.type)}`}
                        style={{ animation: 'slideIn 0.3s ease-out' }}
                    >
                        {getToastIcon(toast.type)}
                        <p className="flex-1 text-sm font-medium leading-relaxed">
                            {toast.message}
                        </p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors shrink-0"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
