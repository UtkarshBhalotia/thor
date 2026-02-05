import { call, select } from "redux-saga/effects";
import { clientPostHandler } from "../../services/request";
import { RootState } from "../../../store";
import projectEnv from "../../services/env";
import { showToast } from "../../utils/common";
import {
    TWalletConditionParamActionName,
    IWalletActionConditionParam,
    TWalletBalanceParam,
    TGetRechargeHistoryParam,
    TInitiatePaymentParam,
    TProcessPaymentResponseParam,
    TInsertSecurityDepositParam,
    TGetVendorMinRechargeAmtParam,
    TGenerateHashkeyParam,
    IRechargeHistoryItem
} from "./type";

export function* conditionActions<T extends TWalletConditionParamActionName>
    (param: IWalletActionConditionParam<T>) {
    const { payload: { actionName, actionParam } } = param;
    switch (actionName) {
        case 'Wallet_Balance_Api':
            yield call(Wallet_Balance_Api, actionParam as TWalletBalanceParam);
            break;
        case 'Get_Recharge_History_Api':
            yield call(Get_Recharge_History_Api, actionParam as TGetRechargeHistoryParam);
            break;
        case 'Initiate_Payment':
            yield call(Initiate_Payment, actionParam as TInitiatePaymentParam);
            break;
        case 'Process_Payment_Response':
            yield call(Process_Payment_Response, actionParam as TProcessPaymentResponseParam);
            break;
        case 'Insert_Security_Deposit_Api':
            yield call(Insert_Security_Deposit_Api, actionParam as TInsertSecurityDepositParam);
            break;
        case 'Get_Vendor_Min_Recharge_Amt_Api':
            yield call(Get_Vendor_Min_Recharge_Amt_Api, actionParam as TGetVendorMinRechargeAmtParam);
            break;
        case 'Generate_Hashkey_Api':
            yield call(Generate_Hashkey_Api, actionParam as TGenerateHashkeyParam);
            break;
    }
}

function* Insert_Security_Deposit_Api(actionParam: TInsertSecurityDepositParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        const dataObj = {
            SecurityID: '0',
            UserID: GlobalState.userId,
            Amount: actionParam.amount,
            TxnID: actionParam.txnId,
            Remarks: 'Razorpay Payment Gateway',
            AddByUserID: GlobalState.userId,
        };

        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.insertSecurityDepositUrl,
            data: dataObj,
        });

        if (response && response.status === 200) {
            // Assuming success if status is 200. Check response body if needed.
            // Typically response.body.d would contain "1" or success message for these ASMX services
            actionParam.callBack(true, 'Security deposit updated successfully');
        } else {
            actionParam.callBack(false, response.message || 'Failed to update security deposit');
        }

    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Failed to update security deposit',
            visibilityTime: 2000,
        });
        actionParam.callBack(false, 'Security deposit update failed');
    }
}

function* Wallet_Balance_Api(actionParam: TWalletBalanceParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );
        const dataObj = {
            UserID: GlobalState.userId,
        }
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.walletBalanceUrl,
            data: dataObj,
        });

        yield Wallet_Balance_Api_Response(response, actionParam.callBack);

    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Failed to fetch wallet balance',
            visibilityTime: 2000,
        });
    }
}

function* Wallet_Balance_Api_Response(response: IResponseParam, callBack: (balance: string) => void) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== '') {
                const parsedData = JSON.parse(responseData.d);
                callBack(parsedData);
            } else {
                showToast({
                    type: 'error',
                    text1: 'Unable to fetch wallet balance',
                    visibilityTime: 2000,
                });
            }
        }

    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Error processing wallet balance',
            visibilityTime: 2000,
        });
    }
}

function* Get_Recharge_History_Api(actionParam: TGetRechargeHistoryParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );
        const dataObj = {
            data: [{
                userid: GlobalState.userId,
                fromdate: actionParam.fromDate,
                todate: actionParam.toDate,
            }],
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getVendorRechargeDetailsUrl,
            data: dataObj,
        });


        yield Get_Recharge_History_Api_Response(response, actionParam.callBack);

    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Failed to fetch recharge history',
            visibilityTime: 2000,
        });
    }
}

function* Get_Recharge_History_Api_Response(response: IResponseParam, callBack: (data: IRechargeHistoryItem[]) => void) {
    try {
        if (response.body.status === 'success') {
            const responseData = response.body.data.response;
            callBack(responseData);

        } else if (response.body.status === 'error') {
            callBack([]);
            showToast({
                type: 'error',
                text1: response.body.message,
                visibilityTime: 2000,
            });
        }

    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Error processing recharge history',
            visibilityTime: 2000,
        });
        callBack([]);
    }
}

/**
 * Initiate PayUMoney Payment
 * This is a mock implementation - in production, call backend to get payment hash
 */
function* Initiate_Payment(actionParam: TInitiatePaymentParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        // Mock API call to backend for payment initialization
        // In production, send amount and user details to backend
        // Backend should generate hash and return payment parameters
        const mockBackendResponse = {
            success: true,
            transactionId: `TXN${Date.now()}`,
            amount: actionParam.amount,
        };

        if (mockBackendResponse.success) {
            actionParam.callBack(true, 'Payment initialized successfully');
        } else {
            actionParam.callBack(false, 'Failed to initialize payment');
        }

    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Failed to initiate payment',
            visibilityTime: 2000,
        });
        actionParam.callBack(false, 'Payment initiation failed');
    }
}

/**
 * Process Payment Response
 * This would verify payment with backend in production
 */
function* Process_Payment_Response(actionParam: TProcessPaymentResponseParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        const { paymentResponse } = actionParam;

        // Mock verification - in production, send response to backend for verification
        // Backend should verify hash and transaction status with PayUMoney
        if (paymentResponse && paymentResponse.status === 'success') {
            const dataObj = {
                RechargeID: '0',
                UserID: GlobalState.userId,
                Amount: paymentResponse.amount,
                TxnID: paymentResponse.txnid,
                Remarks: 'Wallet Recharge',
                AddByUserID: GlobalState.userId,
            };

            const response: IResponseParam = yield call(clientPostHandler, {
                url: projectEnv.insertRechargeDetailsUrl,
                data: dataObj,
            });

            if (response && response.status === 200) {
                actionParam.callBack(true, 'Payment completed and wallet updated successfully');
            } else {
                actionParam.callBack(false, response.message || 'Payment success but failed to update wallet');
            }
        } else {
            actionParam.callBack(false, paymentResponse?.error_Message || 'Payment failed');
        }

    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Failed to process payment',
            visibilityTime: 2000,
        });
        actionParam.callBack(false, 'Payment processing failed');
    }
}

function* Get_Vendor_Min_Recharge_Amt_Api(actionParam: TGetVendorMinRechargeAmtParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );
        const dataObj = {
            UserID: GlobalState.userId,
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getVendorMinRechargeAmtUrl,
            data: dataObj,
        });

        yield Get_Vendor_Min_Recharge_Amt_Api_Response(response, actionParam.callBack);
    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Failed to fetch minimum recharge amount',
            visibilityTime: 2000,
        });
        actionParam.callBack('0');
    }
}

function* Get_Vendor_Min_Recharge_Amt_Api_Response(response: IResponseParam, callBack: (minAmount: string) => void) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== '') {
                const parsedData = JSON.parse(responseData.d);
                const minAmount = parsedData.MinAmount || parsedData.minAmount || parsedData || '0';
                callBack(minAmount.toString());
            } else {
                callBack('0');
            }
        } else {
            callBack('0');
        }
    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Error processing minimum recharge amount',
            visibilityTime: 2000,
        });
        callBack('0');
    }
}

function* Generate_Hashkey_Api(actionParam: TGenerateHashkeyParam) {
    console.log("generateHashKeyAPi");

    try {
        const dataObj = {
            data: [{
                amount: parseFloat(actionParam.amount).toFixed(2),
                name: actionParam.name,
                emailid: actionParam.emailid,
                userid: (actionParam.userid).toString(),
            }]
        };

        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.generate_hashkey_for_rechargeUrl,
            data: dataObj,
        });

        if (response && response.body && response.body.status === 'success') {
            const hash = response.body.data.response.HashKey;
            const txnid = response.body.data.response.TxnID;
            const PayUKey = response.body.data.response.PayUKey;
            const ProductDetails = response.body.data.response.ProductDetails;
            actionParam.callBack(true, hash, txnid, PayUKey, ProductDetails);
        } else {
            showToast({
                type: 'error',
                text1: response.body?.msg || 'Failed to generate hash key',
                visibilityTime: 2000,
            });
            actionParam.callBack(false, '', '', '', '');
        }
    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Error generating hash key',
            visibilityTime: 2000,
        });
        actionParam.callBack(false, '', '', '', '');
    }
}


