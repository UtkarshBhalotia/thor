type TWalletConditionParamActionName =
    | 'Wallet_Balance_Api'
    | 'Get_Recharge_History_Api'
    | 'Initiate_Payment'
    | 'Process_Payment_Response'
    | 'Insert_Security_Deposit_Api'
    | 'Get_Vendor_Min_Recharge_Amt_Api';

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

type TInsertSecurityDepositParam = {
    amount: string;
    txnId: string;
    callBack: (success: boolean, message: string) => void;
};

type TGetVendorMinRechargeAmtParam = {
    callBack: (minAmount: string) => void;
};

type TWalletConditionParamActionParam<T extends TWalletConditionParamActionName> =
    T extends 'Wallet_Balance_Api' ? TWalletBalanceParam :
    T extends 'Get_Recharge_History_Api' ? TGetRechargeHistoryParam :
    T extends 'Initiate_Payment' ? TInitiatePaymentParam :
    T extends 'Process_Payment_Response' ? TProcessPaymentResponseParam :
    T extends 'Insert_Security_Deposit_Api' ? TInsertSecurityDepositParam :
    T extends 'Get_Vendor_Min_Recharge_Amt_Api' ? TGetVendorMinRechargeAmtParam :
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

