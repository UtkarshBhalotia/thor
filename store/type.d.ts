type IGlobalInitialState = {
    userId: string;
    name: string;
    email: string;
    mobile: string;
    companyName: string;
    gstNo: string;
    userType: string;
    stateId: string;
    isActive: string;
    fcmToken: string;
    minRechargeAmount: string;
    profileLocked: string;
    validateGST: string;
    isOnline: boolean;
    // Added with the new REST partner-login response.
    altMobile?: string;
    address?: string;
    countryId?: number | string;
    cityId?: number | string;
    roleId?: number | string | null;
};

type TGlobalReducerAction = {
    type: TGlobalReducerType;
    value?: any;
};

type TGlobalReducerType = 'GLOBAL_STATE_MUTATE' | 'GLOBAL_RESET';

type TGlobalReducerValue<T extends TGlobalReducerType> =
    T extends 'GLOBAL_STATE_MUTATE'
    ? IGlobalInitialState
    : T extends 'GLOBAL_RESET'
    ? void
    : never;

