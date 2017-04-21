/*
 * neva
 * https://github.com/gamtiq/neva
 *
 * Copyright (c) 2017 Denis Sikuler
 * Licensed under the MIT license.
 */


/**
 * Simple library to work with custom events.
 * 
 * @module neva
 */

const dataField = '__nevaEventMap';

/**
 * Data about emitted event.
 *
 * @typedef {Object} EventData
 *
 * @property {string} type
 *      The event type (value of `type` parameter passed in {@link EventEmitterMixin.emit} method).
 * @property {Array} params
 *      List of additional parameters that are passed besides the event type in {@link EventEmitterMixin.emit} method.
 * @property {any} data
 *      Value of the first additional parameter that is passed in {@link EventEmitterMixin.emit} method (value of `params[0]`).
 */

/**
 * An object that has methods to work with events.
 *
 * @typedef {Object} EventEmitter
 * @mixes EventEmitterMixin
 */

/**
 * Return index of the specified event handler.
 *
 * @param {EventEmitter} emitter
 *      Event emitter that should be examined.
 * @param {string} type
 *      Type (name) of event whose handler list should be examined.
 * @param {Function} handler
 *      Event handler to search for.
 * @param {any} [context]
 *      Context object for the event handler to search alongside.
 * @return {number}
 *      Index of the specified handler or `-1` if the handler is not found.
 * @private
 */
function getHandlerIndex(emitter, type, handler, context) {   // eslint-disable-line max-params
    let eventData = emitter[dataField];
    let i;
    if (eventData && (eventData = eventData[type]) && (i = eventData.length)) {
        const obj = context || null;
        let item;
        while (i--) {
            item = eventData[i];
            if (item.handler === handler && item.obj === obj) {
                return i;
            }
        }
    }
    
    return -1;
}

/**
 * API for events handling.
 *
 * @mixin EventEmitterMixin
 */
const api = {
    /**
     * Check whether the specified event handler or any event handler is registered.
     *
     * @example
     * ```js
     * const emitter = getEmitter();
     * ...
     * emitter
     *      .on('event1', handler1)
     *      .on('event2', obj.handler, obj);
     * ...
     * emitter.hasEventHandler('event1', handler1);   // true
     * emitter.hasEventHandler('event2', obj.handler, obj);   // true
     * emitter.hasEventHandler('event2', handler1);   // false
     * emitter.hasEventHandler('event2', obj2.handler, obj2);   // false
     *
     * emitter.hasEventHandler('event1');   // true
     * emitter.hasEventHandler('event2');   // true
     * emitter.hasEventHandler('event3');   // false
     *
     * emitter.hasEventHandler();   // true
     * ```
     *
     * @param {string} [type]
     *      Type (name) of event to check for.
     *      If type is not passed it means that existence of any handler for any type should be checked.
     * @param {Function} [handler]
     *      Handler that should be checked for the given event type.
     *      If handler is not passed it means that existence of any handler for the given type should be checked.
     * @param {Object} [context]
     *      Context object for the event handler to check alongside.
     * @return {boolean}
     *      `true` if handler is registered, otherwise `false`.
     */
    hasEventHandler(type, handler, context) {
        let eventData = this[dataField];
        if (eventData) {
            if (type) {
                if (handler) {
                    return getHandlerIndex(this, type, handler, context) > -1;
                }
                // eslint-disable-next-line no-cond-assign
                else if (eventData = eventData[type]) {
                    return eventData.length > 0;
                }
            }
            else {
                for (const eventName in eventData) {
                    if (eventData[eventName].length) {
                        return true;
                    }
                }
            }
        }

        return false;
    },
    
    /**
     * Register a handler for the specified event type(s).
     *
     * @example
     * ```js
     * const emitter = getEmitter();
     * ...
     * emitter
     *      .on('occasion', (event) => {
     *          ...
     *      })
     *      .on('close', obj.handler, obj);
     * ...
     * emitter.on(['event1', 'event2'], eventHandler);
     * ```
     *
     * @param {string | string[]} type
     *      Type (name) of event or list of types to listen for.
     * @param {Function} handler
     *      Function that should be called in response to specified event.
     * @param {Object} [context]
     *      An object that should be used as `this` when calling the event handler.
     * @return {EventEmitter}
     *      `this`.
     */
    on(type, handler, context) {
        const eventData = this[dataField] || (this[dataField] = {});
        const typeList = typeof type === 'string'
                            ? [type]
                            : type;
        let i = typeList.length;
        while (i--) {
            const eventType = typeList[i];
            if (! this.hasEventHandler(eventType, handler, context)) {
                (eventData[eventType] || (eventData[eventType] = [])).push({
                    handler,
                    obj: context || null
                });
            }
        }

        return this;
    },

    /**
     * Remove the specified event handler or all handlers for given type or for all types.
     *
     * @example
     * ```js
     * const emitter = getEmitter();
     * ...
     * emitter
     *      .on('event1', handler1)
     *      .on('event2', obj.handler, obj)
     *      .on('event3', handler3)
     *      .on('event1', handler4);
     * ...
     * // Remove specific handler
     * emitter.off('event2', obj.handler, obj);
     * // Remove all handlers for event1
     * emitter.off('event1');
     * // Remove all handlers for all events
     * emitter.off();
     * ```
     *
     * @param {string} [type]
     *      Type (name) of event for which to remove handler(s).
     *      If type is not passed then all handlers for all types will be removed.
     * @param {Function} [handler]
     *      Event handler that should be removed.
     *      If handler is not passed then all handlers for given type will be removed.
     * @param {Object} [context]
     *      Context object for event handler that should be removed.
     * @return {EventEmitter}
     *      `this`.
     */
    off(type, handler, context) {
        let eventData = this[dataField];
        if (eventData) {
            if (! type) {
                this[dataField] = null;
            }
            // eslint-disable-next-line no-cond-assign
            else if (eventData = eventData[type]) {
                if (handler) {
                    const obj = context || null;
                    let i = eventData.length;
                    let item;
                    while (i--) {
                        item = eventData[i];
                        if (item.handler === handler && item.obj === obj) {
                            eventData.splice(i, 1);
                        }
                    }
                }
                else {
                    eventData.length = 0;
                }
            }
        }

        return this;
    },
    
    /**
     * Call all handlers for the specified event type.
     *
     * If value of `type` parameter is an object it will be passed in each handler as is.
     * If value of `type` parameter is a string an object of {@link EventData} type will be passed in each handler.
     *
     * An object with the following fields will be passed in each handler:
     * - `type: string` - the event type (value of `type` parameter).
     * - `params: Array` - list of additional parameters that are passed besides the event type.
     * - `data: any` - value of the second function's parameter (value of `params[0]`).
     *
     * @example
     * ```js
     * const emitter = getEmitter();
     * ...
     * emitter.on('some-event', (event) => {
     *      console.log('Emitted value: ', event.data);
     * });
     * ...
     * emitter.emit('some-event', 'payload')
     *        .emit('another-event');
     * ...
     * emitter.emit({type: 'eventName', value: {a: 5}});
     * ```
     *
     * @param {Object | string} type
     *      Type (name) of event or event object with `type` field for which to call handlers.
     * @param {...any} [params]
     *      Any values that should be available in handlers.
     *      Will be used only when `type` parameter is string.
     * @return {EventEmitter}
     *      `this`.
     */
    emit(type, ...params) {
        let eventData = this[dataField];
        if (eventData) {
            let eventObj, eventType;
            if (typeof type === 'string') {
                eventType = type;
            }
            else if (type) {
                eventObj = type;
                eventType = type.type;
            }
            // eslint-disable-next-line eqeqeq, no-eq-null
            if (eventType != null && (eventData = eventData[eventType]) && eventData.length) {
                if (! eventObj) {
                    eventObj = {
                        type,
                        params,
                        data: params[0]
                    };
                }
                let i = 0;
                let item;
                // eslint-disable-next-line no-cond-assign
                while (item = eventData[i++]) {
                    item.handler.call(item.obj, eventObj);
                }
            }
        }

        return this;
    }
};

/**
 * Create event emitter or add methods to work with events into specified object.
 *
 * @param {Object} [target]
 *      Object that should be enhanced by methods to work with events.
 *      If `target` is not passed then new event emitter will be created and returned.
 * @return {EventEmitter}
 *      Value of `target` parameter or new object that is enhanced by methods to work with events.
 */
export default function getEmitter(target) {
    return Object.assign(target || {}, api);
}

export { getEmitter };
