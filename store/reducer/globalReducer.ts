export const GlobalInitialState: IGlobalInitialState = {
    userId: '',
    name: '',
    email: '',
    mobile: '',
    companyName: '',
    gstNo: '',
    userType: '',
    stateId: '',
    isActive: '',
    fcmToken: '',
    minRechargeAmount: '',
    profileLocked: '',
    validateGST: '',
    isOnline: true,
    altMobile: '',
    address: '',
    countryId: '',
    cityId: '',
    roleId: null,
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
