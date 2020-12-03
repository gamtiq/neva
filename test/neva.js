import { expect } from 'chai';

import getEmitter from '../src/neva';

describe('neva', function nevaTestSuite() {

    /* eslint-disable no-magic-numbers */

    // eslint-disable-next-line require-jsdoc
    function checkApi(obj) {
        const methodList = ['hasEventHandler', 'on', 'off', 'emit'];
        for (let i = 0, len = methodList.length; i < len; i++) {
            expect( typeof obj[methodList[i]] )
                .equal( 'function' );
        }
    }

    // eslint-disable-next-line require-jsdoc
    function eventHandler() {}

    describe('getEmitter', () => {

        describe('getEmitter()', () => {
            it('should return object with specific methods', () => {
                checkApi( getEmitter() );
            });
        });

        describe('getEmitter(target)', () => {
            it('should return target object with added specific methods', () => {
                const field = 'test';
                const method = getEmitter;
                const obj = {
                    field,
                    method,
                    emit: method
                };
                const result = getEmitter(obj);

                checkApi( result );
                expect( result )
                    .equal( obj );
                expect( obj.field )
                    .equal( field );
                expect( obj.method )
                    .equal( method );
                expect( obj.emit )
                    .not.equal( method );
            });

            it('should not add shared handlers when mixing API in prototype ', () => {
                // eslint-disable-next-line require-jsdoc
                function TestClass() {

                }

                getEmitter( TestClass.prototype );

                const eventName = 'test-event';
                const obj1 = new TestClass();
                const obj2 = new TestClass();

                checkApi( obj1 );
                checkApi( obj2 );

                obj1.on(eventName, eventHandler);

                expect( obj1.hasEventHandler() )
                    .equal( true );
                expect( obj2.hasEventHandler() )
                    .equal( false );
            });
        });
    });

    describe('event emitter API', () => {

        describe('.hasEventHandler', () => {
            describe('.hasEventHandler()', () => {
                it('should return true', () => {
                    const obj = getEmitter();
                    obj.on('some-event', eventHandler);

                    expect( obj.hasEventHandler() )
                        .equal( true );
                });

                it('should return false', () => {
                    const obj = getEmitter();

                    expect( obj.hasEventHandler() )
                        .equal( false );
                });
            });

            describe('.hasEventHandler(type)', () => {
                it('should return true', () => {
                    const obj = getEmitter();
                    const eventType = 'event-type';
                    obj.on(eventType, eventHandler);

                    expect( obj.hasEventHandler(eventType) )
                        .equal( true );
                });

                it('should return false', () => {
                    const obj = getEmitter();
                    const eventType = 'urgent-event';

                    expect( obj.hasEventHandler(eventType) )
                        .equal( false );

                    obj.on('usual-event', eventHandler);

                    expect( obj.hasEventHandler(eventType) )
                        .equal( false );
                });
            });

            describe('.hasEventHandler(type, handler, [context])', () => {
                it('should return true', () => {
                    // eslint-disable-next-line require-jsdoc
                    function check(type, handler, handlerContext) {
                        const obj = getEmitter();
                        const paramList = [type, handler];
                        if (handlerContext) {
                            paramList.push(handlerContext);
                        }

                        obj.on(...paramList);

                        expect( obj.hasEventHandler(...paramList) )
                            .equal( true );
                    }

                    check('event-name', eventHandler);
                    check('another-event', () => {}, {a: 1});
                });

                it('should return false', () => {
                    const obj = getEmitter();

                    expect( obj.hasEventHandler('event1', eventHandler) )
                        .equal( false );
                    expect( obj.hasEventHandler('event2', eventHandler, {}) )
                        .equal( false );
                });
            });
        });

        describe('.on(type, handler, [context])', () => {
            it('should add specified handler', () => {
                const obj = getEmitter();
                const eventType = 'testEvent';
                const handler = () => {};
                const handlerContext = {};

                obj.on(eventType, eventHandler);

                expect( obj.hasEventHandler(eventType, eventHandler) )
                    .equal( true );
                expect( obj.hasEventHandler(eventType, eventHandler, handlerContext) )
                    .equal( false );

                obj.on(eventType, handler, handlerContext);

                expect( obj.hasEventHandler(eventType, eventHandler) )
                    .equal( true );
                expect( obj.hasEventHandler(eventType, handler) )
                    .equal( false );
                expect( obj.hasEventHandler(eventType, handler, handlerContext) )
                    .equal( true );
            });

            it('should add specified handler for different event types at once', () => {
                const obj = getEmitter();
                const event1 = 'event1';
                const event2 = 'event2';
                const event3 = 'event3';
                const handler = () => {};
                const handlerContext = {};

                obj.on([event1, event2, event3], eventHandler);

                expect( obj.hasEventHandler(event1, eventHandler) )
                    .equal( true );
                expect( obj.hasEventHandler(event2, eventHandler) )
                    .equal( true );
                expect( obj.hasEventHandler(event3, eventHandler) )
                    .equal( true );

                obj.on([event1, event2, event3], handler, handlerContext);

                expect( obj.hasEventHandler(event1, eventHandler) )
                    .equal( true );
                expect( obj.hasEventHandler(event1, handler) )
                    .equal( false );
                expect( obj.hasEventHandler(event1, handler, handlerContext) )
                    .equal( true );
                expect( obj.hasEventHandler(event2, handler, handlerContext) )
                    .equal( true );
                expect( obj.hasEventHandler(event3, handler, handlerContext) )
                    .equal( true );
            });

            it('should not add the same handler twice', () => {
                const obj = getEmitter();
                const eventType = 'increase';
                const handlerContext = {};

                let counter = 0;
                const handler = () => {
                    counter++;
                };

                obj.on(eventType, handler)
                    .on(eventType, handler)
                    .on(eventType, handler)
                    .on(eventType, handler, handlerContext)
                    .on(eventType, handler, handlerContext);

                obj.emit(eventType);

                expect( counter )
                    .equal( 2 );
            });
        });

        describe('.off', () => {
            describe('.off()', () => {
                it('should remove all handlers for all events', () => {
                    const obj = getEmitter();
                    const type1 = 'event1';
                    const type2 = 'event2';
                    const handler1 = eventHandler;
                    const handler2 = () => {};
                    const handlerContext1 = {};

                    obj.on(type1, handler1, handlerContext1)
                        .on(type2, handler2)
                        .on('random-event', () => {});

                    obj.off();

                    expect( obj.hasEventHandler(type1, handler1, handlerContext1) )
                        .equal( false );
                    expect( obj.hasEventHandler(type2, handler2) )
                        .equal( false );
                    expect( obj.hasEventHandler() )
                        .equal( false );
                });
            });

            describe('.off(type)', () => {
                it('should remove all handlers for specified event', () => {
                    const obj = getEmitter();
                    const type1 = 'event1';
                    const type2 = 'event2';
                    const handler1 = eventHandler;
                    const handler2 = () => {};
                    const handlerContext1 = {};

                    obj.on(type1, handler1)
                        .on(type1, handler1, handlerContext1)
                        .on(type1, handler2)
                        .on(type2, handler1)
                        .on(type2, handler2);

                    obj.off(type1);

                    expect( obj.hasEventHandler(type1, handler1) )
                        .equal( false );
                    expect( obj.hasEventHandler(type1, handler1, handlerContext1) )
                        .equal( false );
                    expect( obj.hasEventHandler(type1, handler2) )
                        .equal( false );
                    expect( obj.hasEventHandler(type1) )
                        .equal( false );

                    expect( obj.hasEventHandler() )
                        .equal( true );
                    expect( obj.hasEventHandler(type2) )
                        .equal( true );
                    expect( obj.hasEventHandler(type2, handler1) )
                        .equal( true );
                    expect( obj.hasEventHandler(type2, handler2) )
                        .equal( true );
                });
            });

            describe('.off(type, handler, [context])', () => {
                it('should remove specified handler', () => {
                    const obj = getEmitter();
                    const type1 = 'event1';
                    const type2 = 'event2';
                    const handler1 = eventHandler;
                    const handler2 = () => {};
                    const handlerContext1 = {};

                    obj.on(type1, handler1, handlerContext1)
                        .on(type2, handler2);

                    obj.off(type1, handler1, handlerContext1);

                    expect( obj.hasEventHandler(type1, handler1, handlerContext1) )
                        .equal( false );
                    expect( obj.hasEventHandler(type2) )
                        .equal( true );
                    expect( obj.hasEventHandler() )
                        .equal( true );

                    obj.off(type2, handler2, handlerContext1);

                    expect( obj.hasEventHandler() )
                        .equal( true );
                    expect( obj.hasEventHandler(type2) )
                        .equal( true );
                    expect( obj.hasEventHandler(type2, handler2) )
                        .equal( true );

                    obj.off(type2, handler2);

                    expect( obj.hasEventHandler(type2, handler2) )
                        .equal( false );
                    expect( obj.hasEventHandler(type2) )
                        .equal( false );
                    expect( obj.hasEventHandler() )
                        .equal( false );
                });
            });
        });

        describe('.emit(type, [param1, param2, ...])', () => {
            it('should call registered handlers', () => {
                const obj = getEmitter();
                const eventType = 'an-event';
                
                let flag = false;
                const handler1 = () => {
                    flag = ! flag;
                };

                const testObj = {
                    n: 0,
                    handler(eventData) {
                        const len = eventData.params.length;
                        this.n += len > 0
                            ? len
                            : 1;
                    }
                };

                obj.on(eventType, handler1)
                    .on(eventType, testObj.handler, testObj);

                // eslint-disable-next-line require-jsdoc
                function check(emitParamList, expected) {
                    obj.emit(...emitParamList);

                    expect( flag )
                        .equal( expected.flag );
                    expect( testObj.n )
                        .equal( expected.n );
                }

                check(
                    [eventType],
                    {
                        flag: true,
                        n: 1
                    }
                );

                check(
                    [eventType, 1, 2, 3],
                    {
                        flag: false,
                        n: 4
                    }
                );

                check(
                    ['another-event', 'some', 'data', 74],
                    {
                        flag: false,
                        n: 4
                    }
                );

                check(
                    [eventType, 'data'],
                    {
                        flag: true,
                        n: 5
                    }
                );
            });
            
            it('should pass object with specific fields to handlers', () => {
                // eslint-disable-next-line require-jsdoc
                function checkEvent(eventData) {
                    expect( eventData )
                        .an( 'object' )
                        .and.not.a( 'null' );
                    expect( eventData.type )
                        .a( 'string' );
                    expect( eventData.params )
                        .an( 'array' );
                    expect( eventData )
                        .property( 'data' );
                }

                const obj = getEmitter();
                const eventType = 'emitted';
                let counter = 0;

                obj.on(eventType, (eventData) => {
                    checkEvent(eventData);

                    counter += eventData.params.length;
                });

                obj.on(eventType, (eventData) => {
                    checkEvent(eventData);

                    if (eventData.data) {
                        counter++;
                    }
                });

                // eslint-disable-next-line require-jsdoc
                function check(emitParas, expected) {
                    obj.emit(eventType, ...emitParas);

                    expect( counter )
                        .equal( expected );
                }

                check([], 0);
                check([0], 1);
                check(['a', 'b', 'c'], 5);
                check([null, 93], 7);
            });
            
            it('should pass given event object to handlers', () => {
                const obj = getEmitter();
                const eventType = 'eventObjTest';
                const eventObj = {
                    type: eventType,
                    payload: 12,
                    value: 'abc',
                    sign: false
                };
                let passedEvent = null;
                let payload = null;

                obj.on(eventType, (event) => {
                    passedEvent = event;
                });
                obj.on(eventType, (event) => {
                    payload = event.payload;
                });

                obj.emit(eventObj);

                expect( passedEvent )
                    .equal( eventObj );
                expect( payload )
                    .equal( eventObj.payload );
            });
            
            it('should call handlers in definite order', () => {
                const obj = getEmitter();
                const eventType = 'test-order';
                let value = null;

                obj.on(eventType, () => {
                    value = 'a';
                });
                obj.on(eventType, () => {
                    value = true;
                });
                obj.on(eventType, () => {
                    value = -3;
                });

                obj.emit(eventType);

                expect( value )
                    .equal( -3 );
            });
        });
    });
});
