import Battery from './Battery';
import LED from './LED';
import Resistor from './Resistor';
import Switch from './Switch';
import Motor from './Motor';

import Transistor from './Transistor';
import MOSFET from './MOSFET';
import Breadboard from './Breadboard';

import Capacitor from './Capacitor';
import Inductor from './Inductor';

export const COMPONENT_REGISTRY = {
    battery: Battery,
    led: LED,
    resistor: Resistor,
    capacitor: Capacitor,
    inductor: Inductor,
    switch: Switch,
    motor: Motor,
    transistor: Transistor,
    mosfet: MOSFET,
    breadboard: Breadboard,
};

export const getComponentDef = (type) => COMPONENT_REGISTRY[type];
