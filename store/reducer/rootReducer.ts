import { combineReducers } from 'redux';
import { GlobalReducer } from './globalReducer';
import idVerificationReducer from '../../src/modules/idVerification/reducer';
import leadHistoryReducer from '../../src/modules/admin/leadHistory/reducer';
import { partnerListReducer } from '../../src/modules/admin/partnerList/reducer';

const rootReducer = combineReducers({
    globalState: GlobalReducer,
    idVerificationState: idVerificationReducer,
    leadHistoryState: leadHistoryReducer,
    partnerListState: partnerListReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
