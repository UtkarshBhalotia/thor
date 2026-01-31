import { IIdVerificationState } from './type';

const initialState: IIdVerificationState = {
    documents: null,
    loading: false,
    error: null,
};

const idVerificationReducer = (
    state: IIdVerificationState = initialState,
    action: any
): IIdVerificationState => {
    switch (action.type) {
        case 'ID_VERIFICATION_LOADING':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'ID_VERIFICATION_SUCCESS':
            return {
                ...state,
                documents: action.payload,
                loading: false,
                error: null,
            };
        case 'ID_VERIFICATION_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default idVerificationReducer;
