import { mySaga } from './action/rootAction';
import createSagaMiddleware from 'redux-saga';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducer/rootReducer';

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

export type RootState = ReturnType<typeof store.getState>;
// ReturnTyoe is a Utility function
export type AppDispatch = typeof store.dispatch;

sagaMiddleware.run(mySaga);
