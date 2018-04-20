/**
 * Constants are important - they describe what type of action is performed
 * within your app. Combined with the DevTools/logger, you can see how state and subsequently
 * your UI is being affected.
 */
import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory();
export const CATCH_ALL = '@@ThunkActionType/catchAll';

export function createCatchAllType(type: string) {
    return `${CATCH_ALL}|${type}`
}

/**
 *
 * @param {string}type
 * @returns {*}
 */
export function extractType(type: string) {
    const extracted = type.substring(0, type.lastIndexOf('_'));
    if (!extracted || !extracted.length) {
        return type
    }
    return extracted
}

export function createTypes(type: string) {
    const TYPE_START = `${type}_STARTED`;
    const TYPE_SUCCEEDED = `${type}_SUCCEEDED`;
    const TYPE_FAILED = `${type}_FAILED`;
    const TYPE_ENDED = `${type}_ENDED`;
    const TYPE_DONE = `${type}_DONE`;
    const TYPE_ALL = createCatchAllType(type);
    return {
        TYPE_START,
        TYPE_SUCCEEDED,
        TYPE_FAILED,
        TYPE_ENDED,
        TYPE_DONE,
        TYPE_ALL,
    }
}

/**
 * @typedef {Object} ThunkActionType
 * @property START
 * @property SUCCEEDED
 * @property FAILED
 * @property ENDED
 * @property ALL
 */
/**
 *
 * @param type
 * @returns String|ThunkActionType
 */
function makeThunkActionType(type: string) {
    const {
        TYPE_START,
        TYPE_SUCCEEDED,
        TYPE_FAILED,
        TYPE_ENDED,
        TYPE_ALL,
        TYPE_DONE
    } = createTypes(type);
    return Object.assign(type,
        {
            START: TYPE_START,
            SUCCEEDED: TYPE_SUCCEEDED,
            FAILED: TYPE_FAILED,
            ENDED: TYPE_ENDED,
            DONE: TYPE_DONE,
            ALL: TYPE_ALL,
            Creator: {}


        },
    )

}

export const LOAD_DB = makeThunkActionType('LOAD_DB');
export const INIT_DB = makeThunkActionType('INIT_DB');
export const LOAD_BUILD = makeThunkActionType('LOAD_BUILD');

export const UPDATE_SEARCH_FIELD_CHOICE = 'UPDATE_SEARCH_FIELD_CHOICE'
export const UPDATE_SEARCH_PAGE = 'UPDATE_SEARCH_PAGE';
export const INIT_SEARCH = 'INIT_SEARCH';

export function creator<T>(type: string) {
    return actionCreator<T>(type)
}

