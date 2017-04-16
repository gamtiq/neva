(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.neva = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    exports.__esModule = true;
    exports.default = getEmitter;
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

    var dataField = '__eventMap';

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
     * @mixin EventEmitterMixin
     */
    var api = {
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
        on: function on(type, handler, context) {
            var eventData = this[dataField] || (this[dataField] = {});
            var typeList = typeof type === 'string' ? [type] : type;
            var i = typeList.length;
            while (i--) {
                var eventType = typeList[i];
                if (!this.hasEventHandler(eventType, handler, context)) {
                    (eventData[eventType] || (eventData[eventType] = [])).push({
                        handler: handler,
                        obj: context || null
                    });
                }
            }

            return this;
        },
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
        emit: function emit(type) {
            for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                params[_key - 1] = arguments[_key];
            }

            var eventData = this[dataField];
            if (eventData && (eventData = eventData[type]) && eventData.length) {
                var eventObj = {
                    type: type,
                    params: params,
                    data: params[0]
                };
                var i = 0;
                var item = void 0;
                // eslint-disable-next-line no-cond-assign
                while (item = eventData[i++]) {
                    item.handler.call(item.obj, eventObj);
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
    function getEmitter(target) {
        return Object.assign(target || {}, api);
    }

    exports.getEmitter = getEmitter;
});
//# sourceMappingURL=neva.js.map
