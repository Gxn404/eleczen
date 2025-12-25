import React from 'react';

export const Resistor = ({ component }) => {
    return (
        <g>
            {/* Body Zigzag */}
            {component?.state?.power > 0.1 && (
                <path d="M -10 0 L -7 -5 L -3 5 L 0 -5 L 3 5 L 7 -5 L 10 0"
                    fill="none" stroke="#f00" strokeWidth="6" strokeOpacity={Math.min(1, component.state.power)} filter="blur(2px)" />
            )}
            <path d="M -20 0 L -10 0 L -7 -5 L -3 5 L 0 -5 L 3 5 L 7 -5 L 10 0 L 20 0"
                fill="none" stroke="#d4a373" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

            {/* Terminals */}
            <circle cx="-20" cy="0" r="2" fill="#888" />
            <circle cx="20" cy="0" r="2" fill="#888" />

            {/* Value Label */}
            <text x="0" y="15" fill="#aaa" fontSize="10" textAnchor="middle" fontFamily="monospace">
                {component?.properties?.resistance || 1000}Ω
            </text>
        </g>
    );
};
Resistor.ports = [{ id: 'p1', x: -20, y: 0 }, { id: 'p2', x: 20, y: 0 }];

export const Capacitor = ({ component }) => {
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
Capacitor.ports = [{ id: 'p1', x: -20, y: 0 }, { id: 'p2', x: 20, y: 0 }];

export const Inductor = ({ component }) => {
    return (
        <g>
            {/* Coils (Arcs) */}
            <path d="M -20 0 Q -15 -15 -10 0 Q -5 -15 0 0 Q 5 -15 10 0 Q 15 -15 20 0"
                fill="none" stroke="#d4a373" strokeWidth="2" />

            {/* Magnetic Field Glow */}
            {Math.abs(component?.state?.current || 0) > 1e-3 && (
                <path d="M -20 0 Q -15 -15 -10 0 Q -5 -15 0 0 Q 5 -15 10 0 Q 15 -15 20 0"
                    fill="none" stroke="#0ff" strokeWidth="4" filter="blur(3px)" opacity={Math.min(1, Math.abs(component.state.current) * 100)} />
            )}

            {/* Terminals */}
            <circle cx="-20" cy="0" r="2" fill="#888" />
            <circle cx="20" cy="0" r="2" fill="#888" />

            {/* Value Label */}
            <text x="0" y="20" fill="#aaa" fontSize="10" textAnchor="middle" fontFamily="monospace">
                {component?.properties?.inductance || '1m'}H
            </text>
        </g>
    );
};
Inductor.ports = [{ id: 'p1', x: -20, y: 0 }, { id: 'p2', x: 20, y: 0 }];

export const Battery = ({ component }) => {
    return (
        <g>
            {/* Body */}
            <rect x="-20" y="-30" width="40" height="60" rx="4" fill="#333" stroke="rgba(0, 0, 0, 1)" strokeWidth="1" />
            <rect x="-20" y="-30" width="40" height="20" rx="4" fill="#9e4d00ff" />
            {/* Terminals */}
            <path d="M -10 -30 L -10 -40" stroke="#888" strokeWidth="2" />
            <path d="M 10 -30 L 10 -40" stroke="#888" strokeWidth="2" />

            {/* Plus/Minus */}
            <text x="-15" y="-15" fill="rgba(255, 255, 255, 1)" fontSize="12" fontFamily="monospace">+</text>
            <text x="5" y="-15" fill="rgba(255, 255, 255, 1)" fontSize="12" fontFamily="monospace">-</text>

            {/* Label */}
            <text x="0" y="10" fill="#ffffffff" fontSize="10" textAnchor="middle" fontFamily="monospace">
                {component?.properties?.voltage || 9}V
            </text>
        </g>
    );
};
Battery.ports = [{ id: 'pos', x: -10, y: -40 }, { id: 'neg', x: 10, y: -40 }];
Battery.defaultSize = { width: 40, height: 60 };

export const LED = ({ component }) => {
    const active = component?.state?.active;
    const color = component?.properties?.color || component?.state?.color || '#f00';

    return (
        <g>
            {active && (
                <circle cx="0" cy="-10" r="15" fill={color} opacity={0.4 * (component.state?.brightness || 1)} filter="blur(4px)" className="animate-pulse" />
            )}
            {/* Bulb */}
            <path d="M -10 0 L -10 -20 A 10 10 0 1 1 10 -20 L 10 0 Z" fill={active ? color : '#300'} stroke={active ? color : '#500'} strokeWidth="2" />
            {/* Legs */}
            <path d="M -5 0 L -5 20" stroke="#888" strokeWidth="2" />
            <path d="M 5 0 L 5 20" stroke="#888" strokeWidth="2" />
            {/* Anode/Cathode markers */}
            <text x="-12" y="15" fill="#444" fontSize="8">+</text>
        </g>
    );
};
LED.ports = [{ id: 'anode', x: -5, y: 20 }, { id: 'cathode', x: 5, y: 20 }];

export const Switch = ({ component }) => {
    const on = component?.state?.on;
    return (
        <g>
            {/* Base */}
            <rect x="-15" y="-10" width="30" height="20" fill="#222" rx="2" />
            {/* Terminals */}
            <path d="M -20 0 L -15 0" stroke="#888" strokeWidth="2" />
            <path d="M 15 0 L 20 0" stroke="#888" strokeWidth="2" />
            {/* Lever */}
            <path
                d={on ? "M -10 0 L 10 0" : "M -10 0 L 8 -8"}
                stroke={on ? "#0f0" : "#f00"} strokeWidth="2"
                className="transition-all duration-300 ease-in-out"
            />
            {/* Click Area (invisible) */}
            <rect x="-15" y="-15" width="30" height="30" fill="transparent" style={{ cursor: 'pointer' }} />
        </g>
    );
};
Switch.ports = [{ id: 'in', x: -20, y: 0 }, { id: 'out', x: 20, y: 0 }];

export const Transistor = ({ component }) => {
    return (
        <g>
            {/* Body */}
            <circle cx="0" cy="0" r="15" fill="#222" stroke="#666" />
            <path d="M -5 -10 L -5 10" stroke="#888" strokeWidth="2" /> {/* Base plate */}
            {/* Legs */}
            <path d="M -5 0 L -15 0" stroke="#888" strokeWidth="2" /> {/* Base */}
            <path d="M -5 -5 L 10 -10" stroke="#888" strokeWidth="2" /> {/* Collector */}
            <path d="M -5 5 L 10 10" stroke="#888" strokeWidth="2" /> {/* Emitter */}
            {/* Arrow */}
            <path d="M 5 8 L 10 10 L 7 5" fill="#888" />
            {/* Labels */}
            <text x="-20" y="4" fill="#666" fontSize="8">B</text>
            <text x="12" y="-12" fill="#666" fontSize="8">C</text>
            <text x="12" y="15" fill="#666" fontSize="8">E</text>
        </g>
    );
};
Transistor.ports = [{ id: 'base', x: -15, y: 0 }, { id: 'collector', x: 10, y: -10 }, { id: 'emitter', x: 10, y: 10 }];

export const MOSFET = ({ component }) => {
    return (
        <g>
            {/* Body */}
            <circle cx="0" cy="0" r="15" fill="#222" stroke="#666" />
            {/* Gate */}
            <path d="M -8 -10 L -8 10" stroke="#888" strokeWidth="2" />
            <path d="M -15 0 L -8 0" stroke="#888" strokeWidth="2" /> {/* Gate Leg */}
            {/* Channel */}
            <path d="M -2 -10 L -2 -3" stroke="#888" strokeWidth="2" />
            <path d="M -2 -2 L -2 2" stroke="#888" strokeWidth="2" />
            <path d="M -2 3 L -2 10" stroke="#888" strokeWidth="2" />
            {/* Source/Drain Legs */}
            <path d="M -2 -7 L 10 -10" stroke="#888" strokeWidth="2" /> {/* Drain */}
            <path d="M -2 7 L 10 10" stroke="#888" strokeWidth="2" /> {/* Source */}
            {/* Substrate Arrow */}
            <path d="M 5 0 L -2 0" stroke="#888" strokeWidth="2" />
            <path d="M -2 0 L 1 -3 L 1 3 Z" fill="#888" />
            {/* Labels */}
            <text x="-20" y="4" fill="#666" fontSize="8">G</text>
            <text x="12" y="-12" fill="#666" fontSize="8">D</text>
            <text x="12" y="15" fill="#666" fontSize="8">S</text>
        </g>
    );
};
MOSFET.ports = [{ id: 'gate', x: -15, y: 0 }, { id: 'drain', x: 10, y: -10 }, { id: 'source', x: 10, y: 10 }];

export const COMPONENT_REGISTRY = {
    battery: Battery,
    led: LED,
    resistor: Resistor,
    capacitor: Capacitor,
    inductor: Inductor,
    switch: Switch,
    transistor: Transistor,
    mosfet: MOSFET,
};

export const getComponentDef = (type) => COMPONENT_REGISTRY[type];
