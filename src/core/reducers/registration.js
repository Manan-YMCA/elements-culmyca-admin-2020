import { createSlice } from '@reduxjs/toolkit';

import {
    getInitialPaginatedData,
    handleAsyncAction,
} from '../createReducers';


export const { reducer,actions } = createSlice({
    name: "getRegistration",
    initialState: {
        loading: false,
        data: getInitialPaginatedData(),
        error: null,
    },
    reducers: {
        getRegistration:handleAsyncAction()
    },
});