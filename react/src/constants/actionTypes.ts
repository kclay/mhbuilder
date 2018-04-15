/**
 * Constants are important - they describe what type of action is performed
 * within your app. Combined with the DevTools/logger, you can see how state and subsequently
 * your UI is being affected.
 */

export const CATCH_ALL = '@@ThunkActionType/catchAll';

export function createCatchAllType(type) {
    return `${CATCH_ALL}|${type}`
}

/**
 *
 * @param {string}type
 * @returns {*}
 */
export function extractType(type) {
    const extracted = type.substring(0, type.lastIndexOf('_'));
    if (!extracted || !extracted.length) {
        return type
    }
    return extracted
}

export function createTypes(type) {
    const TYPE_START = `${type}_STARTED`
    const TYPE_SUCCEEDED = `${type}_SUCCEEDED`
    const TYPE_FAILED = `${type}_FAILED`
    const TYPE_ENDED = `${type}_ENDED`
    const TYPE_ALL = createCatchAllType(type)
    return {
        TYPE_START,
        TYPE_SUCCEEDED,
        TYPE_FAILED,
        TYPE_ENDED,
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
function makeThunkActionType(type) {
    const {
        TYPE_START,
        TYPE_SUCCEEDED,
        TYPE_FAILED,
        TYPE_ENDED,
        TYPE_ALL,
    } = createTypes(type);
    return Object.assign(type,
        {
            START: TYPE_START,
            SUCCEEDED: TYPE_SUCCEEDED,
            FAILED: TYPE_FAILED,
            ENDED: TYPE_ENDED,
            ALL: TYPE_ALL,

        },
    )

}

export const LOAD_DB = makeThunkActionType('LOAD_DB');