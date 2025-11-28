import Battery from './Battery';
import LED from './LED';
import Resistor from './Resistor';
import Switch from './Switch';
import Motor from './Motor';

import Transistor from './Transistor';
import Breadboard from './Breadboard';

export const COMPONENT_REGISTRY = {
    battery: Battery,
    led: LED,
    resistor: Resistor,
    switch: Switch,
    motor: Motor,
    transistor: Transistor,
    breadboard: Breadboard,
};

export const getComponentDef = (type) => COMPONENT_REGISTRY[type];
