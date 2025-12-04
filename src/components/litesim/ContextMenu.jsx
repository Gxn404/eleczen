import React, { useEffect, useRef, useState } from 'react';

export const ContextMenu = ({ x, y, type, targetId, onClose, onAction }) => {
    const menuRef = useRef(null);
    const [subMenu, setSubMenu] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Prevent right-click inside the menu from opening browser context menu
    const handleContextMenu = (e) => {
        e.preventDefault();
    };

    const handleAction = (action, payload = null) => {
        onAction(action, { targetId, type, ...payload });
        onClose();
    };

    const renderMenuItem = (label, action, shortcut = null, hasSubMenu = false, subMenuId = null) => (
        <div
            className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer flex justify-between items-center group relative"
            onClick={() => !hasSubMenu && handleAction(action)}
            onMouseEnter={() => hasSubMenu && setSubMenu(subMenuId)}
            onMouseLeave={() => hasSubMenu && setSubMenu(null)}
        >
            <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
            {shortcut && <span className="text-xs text-gray-400 ml-4">{shortcut}</span>}
            {hasSubMenu && <span className="text-gray-400">›</span>}

            {/* Submenu */}
            {hasSubMenu && subMenu === subMenuId && (
                <div className="absolute left-full top-0 ml-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {subMenuId === 'view' && (
                        <>
                            {renderMenuItem('Toggle Grid', 'toggle_grid')}
                            {renderMenuItem('Dark Mode', 'toggle_theme')}
                        </>
                    )}
                </div>
            )}
        </div>
    );

    const renderSeparator = () => (
        <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
    );

    return (
        <div
            ref={menuRef}
            className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 w-56 animate-in fade-in zoom-in duration-100"
            style={{ top: y, left: x }}
            onContextMenu={handleContextMenu}
        >
            {/* Context Header */}
            <div className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 mb-1">
                {type === 'component' ? 'Component Actions' : type === 'wire' ? 'Wire Actions' : 'Canvas Actions'}
            </div>

            {type === 'canvas' && (
                <>
                    {renderMenuItem('Place Component...', 'place_component', 'Space')}
                    {renderMenuItem('Paste', 'paste', 'Ctrl+V')}
                    {renderSeparator()}
                    {renderMenuItem('Run Simulation', 'run_simulation', 'F5')}
                    {renderMenuItem('View Options', 'view_options', null, true, 'view')}
                    {renderSeparator()}
                    {renderMenuItem('Reset View', 'reset_view')}
                </>
            )}

            {type === 'component' && (
                <>
                    {renderMenuItem('Edit Properties...', 'edit_properties', 'E')}
                    {renderMenuItem('Rotate', 'rotate', 'R')}
                    {renderMenuItem('Mirror', 'mirror', 'M')}
                    {renderSeparator()}
                    {renderMenuItem('Copy', 'copy', 'Ctrl+C')}
                    {renderMenuItem('Duplicate', 'duplicate', 'Ctrl+D')}
                    {renderSeparator()}
                    {renderMenuItem('Delete', 'delete', 'Del')}
                    {renderMenuItem('Show Datasheet', 'show_datasheet')}
                </>
            )}

            {type === 'wire' && (
                <>
                    {renderMenuItem('Delete Wire', 'delete_wire', 'Del')}
                    {renderMenuItem('Add Junction', 'add_junction')}
                    {renderMenuItem('Color Net...', 'color_net')}
                </>
            )}
        </div>
    );
};
