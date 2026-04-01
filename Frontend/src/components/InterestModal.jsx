import React from 'react';
import { Loader2, X } from 'lucide-react';

const InterestModal = ({ open, message, submitting, onClose, onConfirm, onMessageChange }) => {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6" onClick={onClose}>
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Are you interested in this product?</h2>
                        <p className="mt-1 text-sm text-gray-500">The seller will review your request before any contact details are shared.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Write a message to the seller (optional)
                        </label>
                        <textarea
                            value={message}
                            onChange={(event) => onMessageChange(event.target.value)}
                            rows={4}
                            maxLength={1000}
                            placeholder="Hi, I'm interested in this product. Is it still available?"
                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                        <div className="mt-2 text-right text-xs text-gray-400">{message.length}/1000</div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={submitting}
                            className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? <Loader2 size={16} className="mx-auto animate-spin" /> : "Send Request"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterestModal;
