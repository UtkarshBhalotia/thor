type TUserDashboardConditionParamActionName = 'Wallet_Balance_Api' | 'Total_Security_Deposit_Api' | 'Get_OnGoing_Services_List_Api' | 'Get_New_Leads_List_Api' | 'Get_Completed_Services_List_Api';

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
    callBack: (wB: string) => void;
};
type TUserTotalSecurityDepositParam = {
    callBack: (data: { DepositeAmt: string; MaintenanceAmt: string }) => void;
};
type TUserGetOnGoingServicesListParam = {
    callBack: (data: any) => void;
};
type TUserGetNewLeadsListParam = {
    callBack: (data: any) => void;
};
type TUserGetCompletedServicesListParam = {
    callBack: (data: any) => void;
};

type TUserDashboardConditionParamActionParam<T extends TUserDashboardConditionParamActionName> =
    T extends 'Wallet_Balance_Api' ? TUserWalletBalanceParam :
    T extends 'Total_Security_Deposit_Api' ? TUserTotalSecurityDepositParam :
    T extends 'Get_OnGoing_Services_List_Api' ? TUserGetOnGoingServicesListParam :
    T extends 'Get_New_Leads_List_Api' ? TUserGetNewLeadsListParam :
    T extends 'Get_Completed_Services_List_Api' ? TUserGetCompletedServicesListParam :
    never;

interface IResponseParam {
    body: any;
    status: number;
    message: string;
    data: any;
}
