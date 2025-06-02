import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import { ENABLE_REDUX_LOGGER } from '../config';

export function configureStoreInstance(preloadedState = {}) {
  const loggerMiddleware = createLogger();

  const middleware = (getDefaultMiddleware) =>
    ENABLE_REDUX_LOGGER
      ? getDefaultMiddleware().concat(loggerMiddleware)
      : getDefaultMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    middleware,
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });

  return store;
}
