import { IPartnerListState } from './type';

const initialState: IPartnerListState = {
    partnerList: [],
    loading: false,
    hasSearched: false,
};

export const partnerListReducer = (state = initialState, action: any): IPartnerListState => {
    switch (action.type) {
        case 'PARTNER_LIST_LOADING':
            return {
                ...state,
                loading: true,
                hasSearched: true,
            };
        case 'PARTNER_LIST_SUCCESS':
            return {
                ...state,
                partnerList: action.payload,
                loading: false,
            };
        case 'PARTNER_LIST_FAIL':
            return {
                ...state,
                partnerList: [],
                loading: false,
            };
        case 'PARTNER_LIST_RESET':
            return initialState;
        default:
            return state;
    }
};
