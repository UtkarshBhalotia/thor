import { combineReducers, AnyAction } from 'redux';

// Create a placeholder reducer for now since we have an empty combineReducers
const placeholderReducer = (state: any = {}, action: AnyAction) => {
    return state;
};

const appReducer = combineReducers({
    placeholder: placeholderReducer,
});

const mainReducer = (state: any, action: AnyAction) => {
    return appReducer(state, action);
};

export default mainReducer;
