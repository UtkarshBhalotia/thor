import { combineReducers } from 'redux';
import { GlobalReducer } from './globalReducer';

const rootReducer = combineReducers({
    globalState: GlobalReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
