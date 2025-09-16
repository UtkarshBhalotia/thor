import { watch } from './action/rootAction';
import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from '../store/reducer/rootReducer';
import navigationDebouncer from 'react-navigation-redux-debouncer';
import ReduxPromise from 'redux-promise';

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware, ReduxPromise, navigationDebouncer(600)),
);

export type RootState = ReturnType<typeof store.getState>;
// ReturnTyoe is a Utility function
export type AppDispatch = typeof store.dispatch;

sagaMiddleware.run(watch);
