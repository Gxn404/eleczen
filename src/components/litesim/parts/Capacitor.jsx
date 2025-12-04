import React from 'react';

const Capacitor = ({ component }) => {
    return (
        <g>
            {/* Plates */}
            <line x1="-5" y1="-15" x2="-5" y2="15" stroke="#ccc" strokeWidth="4" />
            <line x1="5" y1="-15" x2="5" y2="15" stroke="#ccc" strokeWidth="4" />

            {/* Charge Visualization */}
            {Math.abs(component?.state?.voltage || 0) > 0.1 && (
                <g opacity={Math.min(1, Math.abs(component.state.voltage) / 5)}>
                    <text x="-12" y="-5" fill={component.state.voltage > 0 ? "#f00" : "#00f"} fontSize="10" fontWeight="bold">+</text>
                    <text x="12" y="-5" fill={component.state.voltage > 0 ? "#00f" : "#f00"} fontSize="10" fontWeight="bold">-</text>
                </g>
            )}

            {/* Terminals */}
            <line x1="-20" y1="0" x2="-5" y2="0" stroke="#888" strokeWidth="2" />
            <line x1="5" y1="0" x2="20" y2="0" stroke="#888" strokeWidth="2" />

            {/* Value Label */}
            <text x="0" y="25" fill="#aaa" fontSize="10" textAnchor="middle" fontFamily="monospace">
                {component?.properties?.capacitance || '1u'}F
            </text>
        </g>
    );
};

Capacitor.ports = [
    { id: 'p1', x: -20, y: 0 },
    { id: 'p2', x: 20, y: 0 }
];

export default Capacitor;
