type IGlobalInitialState = {
    userId: string;
    name: string;
    email: string;
    mobile: string;
    companyName: string;
    gstNo: string;
    userType: string;
    isActive: string;
    fcmToken: string;
    minRechargeAmount: string;
    profileLocked: string;
    validateGST: string;
};

type TLoginConditionParamActionName = 'LOGIN_API';
type TLoginConditionParamActionParam<T> =
    T extends TLoginConditionParamActionName
    ? TLoginConditionParamActionParam<T>
    : never;

type TUserDashboardConditionParamActionName = 'USER_DASHBOARD_API';
type TUserDashboardConditionParamActionParam<T> =
    T extends TUserDashboardConditionParamActionName
    ? TUserDashboardConditionParamActionParam<T>
    : never;

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
