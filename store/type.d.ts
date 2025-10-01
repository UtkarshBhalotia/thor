type IGlobalInitialState = {
    id: string;
    name: string;
    email: string;
    token: string;
};

type TLoginConditionParamActionName = 'LOGIN_API';
type TLoginConditionParamActionParam<T> =
    T extends TLoginConditionParamActionName
        ? TLoginConditionParamActionParam<T>
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
