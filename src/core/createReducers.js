import { set } from 'lodash-es';
import { serviceInstance } from './utils/service';

function produceState(state, action, fn) {
    if (fn) {
        fn(state, action);
    }
}



export function handleAsyncAction(
) {

    return (state, action) => {
        const fallbackHandlers = {
            started: s => {
                set(s, 'loading', true);
                set(s,'error', null);
            },
            resolved: s => {
                set(s, 'loading', false);
                set(s, 'data', action.payload);
            },
            rejected: s => {
                set(s, 'loading', false);
                set(s, 'error', action.payload);
            },
        };

        return produceState(state, action, fallbackHandlers[action.status]);
    };
}

export function createServiceAction(
    actionType,
    apiCall,
) {
    const actionCreator = (props) => ({
        type: actionType,
        props,
        ...(apiCall ? { payload: apiCall(serviceInstance, props) } : {}),
    });
    actionCreator.type = actionType;

    return actionCreator;
}

export function getInitialPaginatedData() {
    return {
        total: 0,
        perPage: 10,
        page: 0,
        list: [],
    };
}
