import { createSlice } from '@reduxjs/toolkit';

import {
    getInitialPaginatedData,
    handleAsyncAction,
} from '../createReducers';


export const { reducer, actions } = createSlice({
    name: "whomi",
    initialState: {
        loading: false,
        data: [],
        error: null,
    },
    reducers: {
        whomi: handleAsyncAction()
    },
});
