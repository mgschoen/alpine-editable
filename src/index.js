import { Editable } from '@livingdocs/editable.js';

// create global Editable instance
const editable = new Editable({
    defaultBehavior: false,
});

// foward all editable events to DOM
const events = ["focus", "blur", "selection", "cursor", "change", "spellcheckUpdated", "clipboard", "insert", "split", "merge", "switch", "newline"];
events.forEach((eventName) => {
    editable.on(eventName, (element, ...args) => {
        const customEvent = new CustomEvent(`editable-${eventName}`, { detail: args });
        element.dispatchEvent(customEvent);
    });
});

export default function (Alpine) {
    Alpine.directive("editable", (el, { expression }, { cleanup, evaluateLater, effect }) => {
        // add to editable
        editable.add(el);
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
        cleanup(() => editable.remove(el));
    });
    Alpine.magic("editable", () => editable);
}
