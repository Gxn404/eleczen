"use client";
import { useEffect } from 'react';

export const usePreventDevTools = () => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                e.stopPropagation();
            }
            // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
                e.preventDefault();
                e.stopPropagation();
            }
            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);
};
