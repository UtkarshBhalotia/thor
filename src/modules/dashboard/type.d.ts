type TUserDashboardConditionParamActionName = 'UserAuth_Wallet_Balance_Api';

interface IUserDashboardActionConditionParam<
    T extends TUserDashboardConditionParamActionName,
> {
    type: 'UserAuth_Actions';
    payload: {
        actionName: T;
        actionParam: TUserDashboardConditionParamActionParam<T>;
    };
}

type TUserWalletBalanceParam = {
    callBack: () => void;
};

interface IResponseParam {
    body: any;
    status: number;
    message: string;
    data: any;
}
