import { combineReducers } from 'redux';
import { GlobalReducer } from './globalReducer';
import idVerificationReducer from '../../src/modules/idVerification/reducer';

const rootReducer = combineReducers({
    globalState: GlobalReducer,
    idVerificationState: idVerificationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
