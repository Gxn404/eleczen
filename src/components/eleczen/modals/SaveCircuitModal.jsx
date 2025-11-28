"use client";
import React, { useState } from 'react';
import { useLiteSimStore } from '@/lib/litesim/state';
import { saveCircuitAction } from '@/app/actions/circuit';
import { Loader2, Save } from 'lucide-react';

const SaveCircuitModal = ({ onClose }) => {
    const { components, wires, meta } = useLiteSimStore();
    const [name, setName] = useState(meta.projectName || "My Circuit");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = { components, wires, meta: { ...meta, projectName: name } };
            const result = await saveCircuitAction(name, data);

            if (result.success) {
                onClose();
                // Optionally show a toast here
            } else {
                setError(result.error || "Failed to save");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Project Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter project name..."
                    autoFocus
                />
            </div>

            {error && (
                <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded border border-red-900/50">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save Project
                </button>
            </div>
        </form>
    );
};

export default SaveCircuitModal;
