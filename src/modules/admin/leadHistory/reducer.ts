import { ILeadHistoryState } from './type';

const initialState: ILeadHistoryState = {
    historyList: [],
    loading: false,
    hasSearched: false,
};

const leadHistoryReducer = (
    state: ILeadHistoryState = initialState,
    action: any
): ILeadHistoryState => {
    switch (action.type) {
        case 'LEAD_HISTORY_LOADING':
            return {
                ...state,
                loading: true,
                hasSearched: true,
            };
        case 'LEAD_HISTORY_SUCCESS':
            return {
                ...state,
                historyList: action.payload,
                loading: false,
            };
        case 'LEAD_HISTORY_FAIL':
            return {
                ...state,
                historyList: [],
                loading: false,
            };
        case 'LEAD_HISTORY_RESET':
            return initialState;
        default:
            return state;
    }
};

export default leadHistoryReducer;
