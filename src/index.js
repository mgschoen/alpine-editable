import { Editable } from '@livingdocs/editable.js';

// create global Editable instance
const editable = new Editable({
    defaultBehavior: false,
});

// foward all editable events to DOM
const events = [
    'blur',
    'change',
    'clipboard',
    'cursor',
    'empty',
    'flow',
    'focus',
    'insert',
    'merge',
    'move',
    'newline',
    'paste',
    'selection',
    'selectToBoundary',
    'spellcheckUpdated',
    'split',
    'switch',
];
events.forEach((eventName) => {
    editable.on(eventName, (element, ...args) => {
        const customEvent = new CustomEvent(`editable-${eventName}`, { detail: args });
        element.dispatchEvent(customEvent);
    });
});

let elementConfigs = [];

function getElementConfig(el) {
    if (!(el instanceof Element)) {
        return null;
    }
    
    const existingConfig = elementConfigs.find((config) => config.el === el);
    if (existingConfig) {
        return existingConfig;
    }

    const newConfig = { el, disabled: false, suspended: false };
    elementConfigs.push(newConfig);
    return newConfig;
}

function initEditableElement(el, expression, utilities) {
    const { cleanup, evaluateLater, effect } = utilities;
    const elementConfig = getElementConfig(el);
    
    // register element with editable.js
    editable.add(el);
    if (elementConfig.disabled) {
        editable.disable(el);
    }
    if (elementConfig.suspended) {
        editable.suspend(el);
    }
    
    // setup reactivity
    const getValue = evaluateLater(expression);
    effect(() => {
        getValue((value) => {
            if (document.activeElement === el) {
                return;
            }
            const targetvalue = value || "";
            if (el.innerHTML !== targetvalue) {
                el.innerHTML = targetvalue;
            }
        });
    });
    
    // cleanup
    cleanup(() => {
        editable.remove(el);
        elementConfigs = elementConfigs.filter((config) => config !== elementConfig);
    });
}

function bindDisabled(el, expression, utilities) {
    const { evaluateLater, effect } = utilities;
    const elementConfig = getElementConfig(el);
    const getDisabled = evaluateLater(expression);
    effect(() => {
        getDisabled((disabled) => {
            if (disabled) {
                editable.disable(el);
            } else {
                editable.enable(el);
            }
            elementConfig.disabled = disabled;
        });
    });
}

function bindSuspended(el, expression, utilities) {
    const { evaluateLater, effect } = utilities;
    const elementConfig = getElementConfig(el);
    const getSuspended = evaluateLater(expression);
    effect(() => {
        getSuspended((suspended) => {
            if (suspended) {
                editable.suspend(el);
            } else {
                editable.continue(el);
            }
            elementConfig.suspended = suspended;
        });
    });
}

export default function (Alpine) {
    Alpine.directive("editable", (el, { value, expression }, utilities) => {
        if (value === 'disabled') {
            bindDisabled(el, expression, utilities);
        } else if (value === 'suspended') {
            bindSuspended(el, expression,  utilities);
        } else if (!value) {
            initEditableElement(el, expression, utilities);
        } else {
            console.warn(`[alpine-editable] unknown directive x-editable:${value}`);
        }
    });
    Alpine.magic("editable", () => editable);
}
