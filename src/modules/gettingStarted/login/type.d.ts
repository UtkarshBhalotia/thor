type TUserLoginConditionParamActionName = 'UserAuth_Login_Api';

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
};

interface IResponseParam {
    body: any;
    status: number;
    message: string;
    data: any;
}
