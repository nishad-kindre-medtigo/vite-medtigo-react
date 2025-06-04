import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import { ENABLE_REDUX_LOGGER } from '../config';

const NODE_ENV = import.meta.env.VITE_NODE_ENV;

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
    devTools: NODE_ENV !== 'production',
  });

  return store;
}
