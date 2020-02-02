import { combineReducers } from "@reduxjs/toolkit";
import { reducer as sponsorReducer } from "./sponsor"
import { reducer as clubReducer } from "./club"
import { reducer as userReducer } from "./user"

export const reducer = combineReducers({
    sponsorReducer,
    clubReducer,
    userReducer
})