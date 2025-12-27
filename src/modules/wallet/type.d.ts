type TWalletConditionParamActionName = 'Wallet_Balance_Api' | 'Get_Recharge_History_Api';

interface IWalletActionConditionParam<
    T extends TWalletConditionParamActionName,
> {
    type: 'Wallet_Actions';
    payload: {
        actionName: T;
        actionParam: TWalletConditionParamActionParam<T>;
    };
}

type TWalletBalanceParam = {
    callBack: (balance: string) => void;
};

type TGetRechargeHistoryParam = {
    callBack: (data: IRechargeHistoryItem[]) => void;
};

type TWalletConditionParamActionParam<T extends TWalletConditionParamActionName> =
    T extends 'Wallet_Balance_Api' ? TWalletBalanceParam :
    T extends 'Get_Recharge_History_Api' ? TGetRechargeHistoryParam :
    never;

interface IRechargeHistoryItem {
    TxnID: string;
    Amount: string;
    Date: string;
    Remarks: string;
}

interface IResponseParam {
    body: any;
    status: number;
    message: string;
    data: any;
}
