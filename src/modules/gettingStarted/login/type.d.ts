type TUserLoginConditionParamActionName =
    | 'UserAuth_Login_Api'
    | 'ForgotPassword_Api'
    | 'Update_User_Password_Api';

type TUserLoginConditionParamActionParam<
    T extends TUserLoginConditionParamActionName,
> = T extends 'UserAuth_Login_Api'
    ? TUserLoginParam
    : T extends 'ForgotPassword_Api'
    ? TUserForgotPasswordParam
    : T extends 'Update_User_Password_Api'
    ? TUpdateUserPasswordParam
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
    fcmTokenID: string;

    callBack: () => void;
};

type TUserForgotPasswordParam = {
    MobileNo: string;
    callBack?: () => void;
};

type TUpdateUserPasswordParam = {
    oldPassword: string;
    newPassword: string;
    userId: string;
    callBack: (success: boolean, message: string) => void;
};

interface IResponseParam {
    body: any;
    status: number;
    message: string;
    data: any;
}
