/** Routines to create and manage a Redux store.
 *  The store contains a collection of reducer functions. It responds to
 *  events and uses the reducers to compute a new state based on the action.
 *
 *  Dispatcher functions are provided to cater for many different actions.
 **/
import * as Redux from 'redux';
import { router, logger } from 'reframed/index';
import { NAVIGATE, NAVIGATE_MODEL } from './actions';
const log = logger('store');

/* eslint-disable no-shadow */
const extension = createStore => (
    window.devToolsExtension
        ? window.devToolsExtension()(createStore)
        : createStore
);
/* eslint-enable */

/** Global (singleton) variable exposing the store.
 *  This enables easy access to the application state without passing it around.
**/
export let store = null;

/** createStore ...
**/
export function createStore({ reducers, listener }) {
    store = extension(Redux.createStore)(Redux.combineReducers(reducers));
    Object.defineProperty(store, 'state', { get: () => store.getState() });
    store.subscribe(listener);
    listener();
    return store;
}

/** Immediately dispatch an action.
**/
export const doDispatch = (action, args) => {
    if (action.type === NAVIGATE.type || action.type === NAVIGATE_MODEL.type) {
        log.debug(`dispatch ${action.type} ${action.path}`, '');
        router.navigateTo(action.path);
    } else {
        log.debug(`dispatch ${action.type}`, args);
        store.dispatch({ ...args, ...action });
    }
    log.trace('new state', store.state);
};

/** The default dispatcher that simply passes args as the new state.
**/
export const action = {
    dispatcher: (component, anAction, args) =>
        doDispatch(anAction, {}, args),
};

/** Generic Dispatch function to return a function that dispatches any action.
    Defaults to dispatching a standard action if no additional details provided
**/
export const dispatch = (_action, fn = action) => {
    const { dispatcher, ...args } = fn;
    return (dispatcher === undefined)
        ? doDispatch(_action, args)
        : dispatcher.bind(null, null, _action, ...args);
};

/** A dispatcher that receives an event in args and passes on its value.
 *  Designed to use with text input boxes.
**/
export const event = {
    dispatcher: (component, anAction, anEvent) =>
        doDispatch(
            anAction,
            { id: anEvent.target.id, value: anEvent.target.value }
        ),
};

/** A dispatcher that receives a HTTP response in args and passes on the
 *  response. For convenience the response values are spread.
 *  Designed to use with HHTP request library, i.e. superagent.
**/
export const resource = {
    dispatcher: (component, anAction, error, response = {}) =>
        doDispatch(anAction, { ...response.body, error, response }),
};

export const recharts = {
    dispatcher: (component, anAction, entry /* , index, event */) =>
        doDispatch(anAction, entry),
};
