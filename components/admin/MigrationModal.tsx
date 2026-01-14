import React, { useState } from 'react';
import { Copy, Check, AlertTriangle, X } from 'lucide-react';

interface MigrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    sql: string;
}

export const MigrationModal: React.FC<MigrationModalProps> = ({ isOpen, onClose, sql }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(sql);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 animate-fadeIn">
                {/* Header */}
                <div className="px-6 py-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-full">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Database Setup Required</h3>
                            <p className="text-xs text-gray-600">Missing 'app_settings' table</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-amber-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        The database table for themes hasn't been created yet. Please copy the SQL below
                        and run it in your <strong>Supabase Dashboard &gt; SQL Editor</strong>.
                    </p>

                    <div className="relative group">
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono overflow-auto h-64 border border-gray-700 shadow-inner">
                            {sql}
                        </pre>

                        <button
                            onClick={handleCopy}
                            className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md text-xs font-medium transition backdrop-blur-md border border-white/10"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy SQL
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            Close
                        </button>
                        <a
                            href="https://supabase.com/dashboard/project/_/sql"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm flex items-center gap-2"
                        >
                            Open Supabase SQL Editor
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
