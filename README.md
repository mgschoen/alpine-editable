# alpine-editable

Integration between AlpineJS and the editable.js library

## Install

### CDN

```html
<script defer src="https://unpkg.com/alpine-editable@1.0.0/dist/cdn.min.js">
<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js">
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
Forwards editable.js events as DOM events on the element.

```html
<div
    x-data="{ title: 'foo' }"
    x-editable="title"
    @editable-change="title = $event.target.innerHTML"
></div>
```
