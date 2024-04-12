# alpine-editable

Integration between [AlpineJS](https://alpinejs.dev/) and the [editable.js](https://github.com/livingdocsIO/editable.js) library

## Install

### CDN

```html
<script defer src="https://unpkg.com/alpine-editable@1.x.x/dist/cdn.min.js"></script>
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### As module

```bash
$ npm install --save alpinejs alpine-editable
```

```js
import Alpine from 'alpinejs';
import AlpineEditable  from 'alpine-editable';

Alpine.plugin(AlpineEditable);
Alpine.start();
```

## Usage

### x-editable

Makes an element editable by adding it to the global editable.js instance.
Binds the expression value to the innerHTML of the element.
Forwards [editable.js events](https://github.com/livingdocsIO/editable.js?tab=readme-ov-file#events-overview)
as DOM events on the element.

```html
<div
    x-data="{ title: 'foo' }"
    x-editable="title"
    @editable-change="title = $event.target.innerHTML"
></div>
```

### x-editable:disabled

Disable and enable editing reactively. Uses editable.js methods `disable()` and `enable()`.

```html
<div
    x-data="{ title: 'foo', isDisabled: false }"
    x-editable="title"
    x-editable:disabled="isDisabled"
></div>
```

### x-editable:suspended

Suspend and continue editing reactively. Uses editable.js methods `suspend()` and `continue()`.

```html
<div
    x-data="{ title: 'foo', isSuspended: false }"
    x-editable="title"
    x-editable:suspended="isSuspended"
></div>
```

### $editable

Exposes the global editable.js instance to Alpine.

```html
<div
    x-data="{ text: 'foo' }"
    x-editable="text"
    x-ref="editable"
></div>

<button
    @click="const text = $editable.getContent($refs.editable); await navigator.clipboard.writeText(text);"
>
    Copy to Clipboard
</button>
```

### Events

All events emitted by editable.js are dispatched as [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
on the DOM element. The event names are prefixed with `editable-`, e.g.
editable.js event `change` becomes `editable-change`. Use `x-on` to listen
for them. 

```html
<div
    x-editable="value"
    @editable-change="value = $event.target.innerHTML"
    @editable-blur="saveValue()"
></div
```

A full list of events can be found in the [editable.js README](https://github.com/livingdocsIO/editable.js).
