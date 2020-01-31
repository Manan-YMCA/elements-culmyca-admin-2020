import logger from 'redux-logger';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { reducer } from './reducers';
import promiseHandlerMiddleware from './middleware';

let middleware;
const env="local"
if (env === 'production') {
  middleware = [promiseHandlerMiddleware];
} else {
  middleware = getDefaultMiddleware();
  middleware.splice(1, 1, promiseHandlerMiddleware);
  middleware.push(logger);
}

const store = configureStore({
  devTools: env !== 'production',
  middleware,
  reducer,
});

export default store;
