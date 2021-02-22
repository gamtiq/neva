'use strict';

exports.__esModule = true;
exports.default = getEmitter;
/*
 * neva
 * https://github.com/gamtiq/neva
 *
 * Copyright (c) 2017-2021 Denis Sikuler
 * Licensed under the MIT license.
 */

/**
 * Simple library to work with custom events.
 * 
 * @module neva
 */

var dataField = '__nevaEventMap';

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
 * Event handler settings.
 *
 * @typedef {Object} HandlerSettings
 *
 * @property {boolean} [once=false]
 *      Whether event handler should be called just once.
 */

/**
 * Return index of the specified event handler.
 *
 * @param {module:neva~EventEmitter} emitter
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
function getHandlerIndex(emitter, type, handler, context) {
    // eslint-disable-line max-params
    var eventData = emitter[dataField];
    var i = void 0;
    if (eventData && (eventData = eventData[type]) && (i = eventData.length)) {
        var obj = context || null;
        var item = void 0;
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
 * @mixin
 * @alias EventEmitterMixin
 */
var api = {
    /**
     * Check whether the specified event handler or any event handler is registered.
     *
     * @example
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
    hasEventHandler: function hasEventHandler(type, handler, context) {
        var eventData = this[dataField];
        if (eventData) {
            if (type) {
                if (handler) {
                    return getHandlerIndex(this, type, handler, context) > -1;
                }
                // eslint-disable-next-line no-cond-assign
                else if (eventData = eventData[type]) {
                        return eventData.length > 0;
                    }
            } else {
                for (var eventName in eventData) {
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
     * const emitter = getEmitter();
     * ...
     * emitter
     *      .on('open', onceHandler, null, {once: true})
     *      .on('occasion', (event) => {
     *          ...
     *      })
     *      .on('close', obj.handler, obj);
     * ...
     * emitter.on(['event1', 'event2'], eventHandler);
     *
     * @param {string | string[]} type
     *      Type (name) of event or list of types to listen for.
     * @param {Function} handler
     *      Function that should be called in response to specified event.
     * @param {Object} [context]
     *      An object that should be used as `this` when calling the event handler.
     *      By default `null` is used.
     * @param {module:neva~HandlerSettings} [settings]
     *      Settings for the event handler.
     * @return {module:neva~EventEmitter}
     *      `this`.
     */
    on: function on(type, handler, context, settings) {
        // eslint-disable-line max-params
        var eventData = this[dataField] || (this[dataField] = {});
        var typeList = typeof type === 'string' ? [type] : type;
        var i = typeList.length;
        while (i--) {
            var eventType = typeList[i];
            if (!this.hasEventHandler(eventType, handler, context)) {
                (eventData[eventType] || (eventData[eventType] = [])).push({
                    handler: handler,
                    obj: context || null,
                    settings: settings
                });
            }
        }

        return this;
    },


    /**
     * Remove the specified event handler or all handlers for given type or for all types.
     *
     * @example
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
     *
     * @param {string} [type]
     *      Type (name) of event for which to remove handler(s).
     *      If type is not passed then all handlers for all types will be removed.
     * @param {Function} [handler]
     *      Event handler that should be removed.
     *      If handler is not passed then all handlers for given type will be removed.
     * @param {Object} [context]
     *      Context object for event handler that should be removed.
     * @return {module:neva~EventEmitter}
     *      `this`.
     */
    off: function off(type, handler, context) {
        var eventData = this[dataField];
        if (eventData) {
            if (!type) {
                this[dataField] = null;
            }
            // eslint-disable-next-line no-cond-assign
            else if (eventData = eventData[type]) {
                    if (handler) {
                        var obj = context || null;
                        var i = eventData.length;
                        var item = void 0;
                        while (i--) {
                            item = eventData[i];
                            if (item.handler === handler && item.obj === obj) {
                                eventData.splice(i, 1);
                            }
                        }
                    } else {
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
     * If value of `type` parameter is a string an object of {@link module:neva~EventData EventData} type will be passed in each handler.
     *
     * @example
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
     *
     * @param {Object | string} type
     *      Type (name) of event or event object with `type` field for which to call handlers.
     * @param {...any} [params]
     *      Any values that should be available in handlers.
     *      Will be used only when `type` parameter is string.
     * @return {module:neva~EventEmitter}
     *      `this`.
     */
    emit: function emit(type) {
        for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            params[_key - 1] = arguments[_key];
        }

        var eventData = this[dataField];
        if (eventData) {
            var eventObj = void 0,
                eventType = void 0;
            if (typeof type === 'string') {
                eventType = type;
            } else if (type) {
                eventObj = type;
                eventType = type.type;
            }
            // eslint-disable-next-line eqeqeq, no-eq-null
            if (eventType != null && (eventData = eventData[eventType]) && eventData.length) {
                if (!eventObj) {
                    eventObj = {
                        type: type,
                        params: params,
                        data: params[0]
                    };
                }
                var removeHandlerList = [];
                var i = 0;
                var item = void 0;
                var settings = void 0;
                // eslint-disable-next-line no-cond-assign
                while (item = eventData[i]) {
                    item.handler.call(item.obj, eventObj);
                    if ((settings = item.settings) && settings.once) {
                        removeHandlerList.push(i);
                    }
                    i++;
                }
                i = removeHandlerList.length;
                // eslint-disable-next-line no-cond-assign
                while (i) {
                    eventData.splice(removeHandlerList[--i], 1);
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
 * @return {module:neva~EventEmitter}
 *      Value of `target` parameter or new object that is enhanced by methods to work with events.
 */
function getEmitter(target) {
    return Object.assign(target || {}, api);
}

exports.getEmitter = getEmitter;
//# sourceMappingURL=neva.common.js.map
