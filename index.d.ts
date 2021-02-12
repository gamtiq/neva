// Created on the basis of http://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html

export as namespace neva;

export interface BaseEvent {
    /** The event type. */
    type: string;
    [field: string]: unknown;
}

export interface EventData {
    /** Value of `params[0]`. */
    data: any;
    /** List of additional parameters that are passed besides the event type when the event is emitted. */
    params: any[];
    /** The event type. */
    type: string;
}

export type EventHandler = (event: BaseEvent | EventData, ...args: any[]) => unknown;

export interface HandlerSettings {
    /** Whether event handler should be called just once. */
    once?: boolean | null | undefined;
}

export interface EventEmitter {
    hasEventHandler(type?: string, handler?: EventHandler, context?: object): boolean;
    on(type: string | string[], handler: EventHandler, context?: object, settings?: HandlerSettings): this;
    off(type?: string, handler?: EventHandler, context?: object): this;
    emit(type?: string | BaseEvent, ...params: any[]): this;
}

export function getEmitter<T extends object = object>(target?: T): Omit<T, keyof EventEmitter> & EventEmitter;

export default getEmitter;
