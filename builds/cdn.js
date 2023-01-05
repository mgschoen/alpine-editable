
import AlpineEditable from '../src/index.js';

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(AlpineEditable);
});
