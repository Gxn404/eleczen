import Battery from './Battery';
import LED from './LED';
import Resistor from './Resistor';
import Switch from './Switch';
import Motor from './Motor';

export const COMPONENT_REGISTRY = {
    battery: Battery,
    led: LED,
    resistor: Resistor,
    switch: Switch,
    motor: Motor,
    // Add others here
};

export const getComponentDef = (type) => COMPONENT_REGISTRY[type];
