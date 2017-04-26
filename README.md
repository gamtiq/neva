# neva <a name="start"></a>

Simple library to work with custom events.

[![NPM version](https://badge.fury.io/js/neva.png)](http://badge.fury.io/js/neva)
[![Build Status](https://secure.travis-ci.org/gamtiq/neva.png?branch=master)](http://travis-ci.org/gamtiq/neva)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

* Simple event emitter API: `on`, `off`, `emit`, `hasEventHandler`.
* Event emitter API is chainable.
* Events can be emitted with multiple attached parameters.
* Data about emitted event are wrapped into an object with uniform structure that is passed to handlers.
* Ability to enhance prototype of constructor function (class) with event emitter API (emitter methods can be mixed in `prototype`).
* Available as ECMAScript 6/2015 module, CommonJS module or UMD.
* Work in any ECMAScript 3+ environment (browsers, Node.js etc).
* Small.

## Table of contents

* [Installation](#install)
* [Usage](#usage)
* [Examples](#examples)
* [API](#api)
* [Contributing](#contributing)
* [License](#license)

## Installation <a name="install"></a> [&#x2191;](#start)

### Node

    npm install neva

### [Bower](http://bower.io)

    bower install neva

### AMD, &lt;script&gt;

Use `dist/neva.js` or `dist/neva.min.js` (minified version).

## Usage <a name="usage"></a> [&#x2191;](#start)

### ECMAScript 6

```js
import getEmitter from 'neva';
```

### Node

```js
const getEmitter = require('neva').getEmitter;
```

### [Duo](http://duojs.org)

```js
const getEmitter = require('gamtiq/neva').getEmitter;
```

### AMD

```js
define(['path/to/dist/neva.js'], function(neva) {
    const getEmitter = neva.getEmitter;
});
```

### Bower, &lt;script&gt;

```html
<!-- Use bower_components/neva/dist/neva.js if the library was installed by Bower -->
<script type="text/javascript" src="path/to/dist/neva.js"></script>
<script type="text/javascript">
    // neva is available via neva field of window object
    const getEmitter = neva.getEmitter;
</script>
```

### Examples <a name="examples"></a> [&#x2191;](#start)

```js
const emitter = getEmitter();
const eventHandler = (event) => {
    console.log('eventHandler: event type -', event.type, ', data -', event.data);
};
const obj = {
    name: 'obj',
    handler(event) {
        console.log(`${this.name}.handler: event type -`, event.type, ', params -', event.params);
    }
};

emitter.on(['event1', 'event2'], eventHandler)
        .on('event1', obj.handler, obj);

emitter.emit('event1', 1, 2, 3)
        .emit({type: 'event2', data: 'some data', qty: 8});
// The following will be printed into console:
// eventHandler: event type - event1 , data - 1
// obj.handler: event type - event1 , params - Array [ 1, 2, 3 ]
// eventHandler: event type - event2 , data - some data

emitter.hasEventHandler('event1', eventHandler); // true

emitter.off('event1', eventHandler);
emitter.hasEventHandler('event1', eventHandler); // false
emitter.hasEventHandler('event1'); // true

emitter.off('event1');
emitter.hasEventHandler('event1'); // false
emitter.hasEventHandler(); // true

emitter.off();
emitter.hasEventHandler(); // false

class SomeClass {
    ...
}
// Add event emitter methods to class
getEmitter(SomeClass.prototype);
```

## API <a name="api"></a> [&#x2191;](#start)

### getEmitter([target: Object]): EventEmitter

Create event emitter or add methods to work with events into specified object.

`target` can be prototype of some constructor function (class).

### EventEmitter API

#### on(type: string | string[], handler: Function, [context: Object]): EventEmitter

Register a handler for the specified event type(s).

#### off(type: string, handler: Function, [context: Object]): EventEmitter

Remove the specified event handler.

#### off(type: string): EventEmitter

Remove all handlers for the given event type.

#### off(): EventEmitter

Remove all registered event handlers.

#### emit(type: string, [param1: any, param2: any, ...]): EventEmitter

Call all handlers for the specified event type.

An object with the following fields will be passed in each handler:
* `type: string` - the event type (value of `type` parameter).
* `params: Array` - list of additional parameters that are passed besides the event type (`[param1, param2, ...]`).
* `data: any` - value of the second function's parameter (value of `params[0]`).

#### emit({type: string, ...}): EventEmitter

Call all handlers for the specified event type and pass the given object in each handler.

#### hasEventHandler(type: string, handler: Function, [context: Object]): boolean

Check whether the specified event handler is registered.

#### hasEventHandler(type: string): boolean

Check whether any handler for the specified event type is registered.

#### hasEventHandler(): boolean

Check whether any event handler is registered.

## Contributing <a name="contributing"></a> [&#x2191;](#start)
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.
Lint and test your code using [Grunt](http://gruntjs.com/).

## License <a name="license"></a> [&#x2191;](#start)
Copyright (c) 2017 Denis Sikuler  
Licensed under the MIT license.
