import { combineReducers } from 'redux';

const appReducer = combineReducers({});

const mainReducer = (state, action) => {
    return appReducer(state, action);
};

export default mainReducer;
