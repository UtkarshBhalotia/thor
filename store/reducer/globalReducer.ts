export const GlobalInitialState: IGlobalInitialState = {
    id: '',
    name: '',
    email: '',
    token: '',
};

export const GlobalReducer = (
    state = GlobalInitialState,
    action: any,
): IGlobalInitialState => {
    switch (action.type) {
        case 'GLOBAL_STATE_MUTATE':
            return { ...action.value };
        case 'GLOBAL_RESET':
            return GlobalInitialState;
        default:
            return state;
    }
};
