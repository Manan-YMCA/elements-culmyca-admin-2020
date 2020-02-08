import { combineReducers } from "@reduxjs/toolkit";
import { reducer as sponsorReducer } from "./sponsor"
import { reducer as clubReducer } from "./club"
import { reducer as userReducer } from "./user"
import { reducer as paymentReducer } from "./payment"
import { reducer as eventReducer } from "./event"

export const reducer = combineReducers({
    sponsorReducer,
    clubReducer,
    userReducer,
    paymentReducer,
    eventReducer,
})