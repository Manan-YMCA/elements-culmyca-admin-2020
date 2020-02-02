import { createSlice } from '@reduxjs/toolkit';

import {
    getInitialPaginatedData,
    handleAsyncAction,
} from '../createReducers';


export const { reducer, actions } = createSlice({
    name: "getUser",
    initialState: {
        loading: false,
        data: getInitialPaginatedData(),
        error: null,
    },
    reducers: {
        getUser: handleAsyncAction()
    },
});
