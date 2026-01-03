type TWalletConditionParamActionName =
    | 'Wallet_Balance_Api'
    | 'Get_Recharge_History_Api'
    | 'Initiate_Payment'
    | 'Process_Payment_Response';

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

type TInitiatePaymentParam = {
    amount: number;
    callBack: (success: boolean, message?: string) => void;
};

type TProcessPaymentResponseParam = {
    paymentResponse: any;
    callBack: (success: boolean, message: string) => void;
};

type TWalletConditionParamActionParam<T extends TWalletConditionParamActionName> =
    T extends 'Wallet_Balance_Api' ? TWalletBalanceParam :
    T extends 'Get_Recharge_History_Api' ? TGetRechargeHistoryParam :
    T extends 'Initiate_Payment' ? TInitiatePaymentParam :
    T extends 'Process_Payment_Response' ? TProcessPaymentResponseParam :
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

interface IPaymentInitResponse {
    success: boolean;
    message: string;
    transactionId?: string;
    paymentParams?: any;
}

