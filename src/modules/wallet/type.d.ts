export type TWalletConditionParamActionName =
    | 'Wallet_Balance_Api'
    | 'Get_Recharge_History_Api'
    | 'Initiate_Payment'
    | 'Process_Payment_Response'
    | 'Insert_Security_Deposit_Api'
    | 'Get_Vendor_Min_Recharge_Amt_Api'
    | 'Generate_Hashkey_Api';

export interface IWalletActionConditionParam<
    T extends TWalletConditionParamActionName,
> {
    type: 'Wallet_Actions';
    payload: {
        actionName: T;
        actionParam: TWalletConditionParamActionParam<T>;
    };
}

export type TWalletBalanceParam = {
    callBack: (balance: string) => void;
};

export type TGetRechargeHistoryParam = {
    fromDate: Date;
    toDate: Date;
    callBack: (data: IRechargeHistoryItem[]) => void;
};

export type TInitiatePaymentParam = {
    amount: number;
    callBack: (success: boolean, message?: string) => void;
};

export type TProcessPaymentResponseParam = {
    paymentResponse: any;
    callBack: (success: boolean, message: string) => void;
};

export type TInsertSecurityDepositParam = {
    amount: string;
    txnId: string;
    callBack: (success: boolean, message: string) => void;
};

export type TGetVendorMinRechargeAmtParam = {
    callBack: (minAmount: string) => void;
};

export type TGenerateHashkeyParam = {
    amount: string;
    name: string;
    emailid: string;
    userid: string;
    callBack: (success: boolean, hash: string, txnid: string, PayUKey: string, ProductDetails: string) => void;
};

export type TWalletConditionParamActionParam<T extends TWalletConditionParamActionName> =
    T extends 'Wallet_Balance_Api' ? TWalletBalanceParam :
    T extends 'Get_Recharge_History_Api' ? TGetRechargeHistoryParam :
    T extends 'Initiate_Payment' ? TInitiatePaymentParam :
    T extends 'Process_Payment_Response' ? TProcessPaymentResponseParam :
    T extends 'Insert_Security_Deposit_Api' ? TInsertSecurityDepositParam :
    T extends 'Get_Vendor_Min_Recharge_Amt_Api' ? TGetVendorMinRechargeAmtParam :
    T extends 'Generate_Hashkey_Api' ? TGenerateHashkeyParam :
    never;

export interface IRechargeHistoryItem {
    TxnID: string;
    Amount: string;
    Date: string;
    Remarks: string;
    EntryType: string;
    Balance: string;
    DrCr: string;
}

export interface IResponseParam {
    body: any;
    status: number;
    message: string;
    data: any;
}

export interface IPaymentInitResponse {
    success: boolean;
    message: string;
    transactionId?: string;
    paymentParams?: any;
}

