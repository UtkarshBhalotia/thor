import { combineReducers } from 'redux';
import { GlobalReducer } from './globalReducer';
import idVerificationReducer from '../../src/modules/idVerification/reducer';
import leadHistoryReducer from '../../src/modules/admin/leadHistory/reducer';

const rootReducer = combineReducers({
    globalState: GlobalReducer,
    idVerificationState: idVerificationReducer,
    leadHistoryState: leadHistoryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
