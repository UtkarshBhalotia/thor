type TUserLoginConditionParamActionName =
    | 'UserAuth_Login_Api'
    | 'ForgotPassword_Api';

type TUserLoginConditionParamActionParam<
    T extends TUserLoginConditionParamActionName,
> = T extends 'UserAuth_Login_Api'
    ? TUserLoginParam
    : T extends 'ForgotPassword_Api'
    ? TUserForgotPasswordParam
    : never;

interface IUserLoginActionConditionParam<
    T extends TUserLoginConditionParamActionName,
> {
    type: 'UserAuth_Actions';
    payload: {
        actionName: T;
        actionParam: TUserLoginConditionParamActionParam<T>;
    };
}

type TUserLoginParam = {
    email: string;
    password: string;
    callBack: () => void;
};

type TUserForgotPasswordParam = {
    MobileNo: string;
    callBack?: () => void;
};

interface IResponseParam {
    body: any;
    status: number;
    message: string;
    data: any;
}
