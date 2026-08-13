import { call, select } from 'redux-saga/effects';
import { clientRestHandler } from '../../services/request';
import { RootState } from '../../../store';
import projectEnv from '../../services/env';
import { showToast } from '../../utils/common';
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
    TCreateRazorpayOrderIdParam,
    TVerifyRazorpaySignatureParam,
    IRechargeHistoryItem,
    IResponseParam,
} from './type';

export function* conditionActions<T extends TWalletConditionParamActionName>(
    param: IWalletActionConditionParam<T>,
) {
    const {
        payload: { actionName, actionParam },
    } = param;
    switch (actionName) {
        case 'Wallet_Balance_Api':
            yield call(Wallet_Balance_Api, actionParam as TWalletBalanceParam);
            break;
        case 'Get_Recharge_History_Api':
            yield call(
                Get_Recharge_History_Api,
                actionParam as TGetRechargeHistoryParam,
            );
            break;
        case 'Initiate_Payment':
            yield call(Initiate_Payment, actionParam as TInitiatePaymentParam);
            break;
        case 'Process_Payment_Response':
            yield call(
                Process_Payment_Response,
                actionParam as TProcessPaymentResponseParam,
            );
            break;
        case 'Insert_Security_Deposit_Api':
            yield call(
                Insert_Security_Deposit_Api,
                actionParam as TInsertSecurityDepositParam,
            );
            break;
        case 'Get_Vendor_Min_Recharge_Amt_Api':
            yield call(
                Get_Vendor_Min_Recharge_Amt_Api,
                actionParam as TGetVendorMinRechargeAmtParam,
            );
            break;
        case 'Generate_Hashkey_Api':
            yield call(
                Generate_Hashkey_Api,
                actionParam as TGenerateHashkeyParam,
            );
            break;
        case 'Create_Razorpay_Order_Id_Api':
            yield call(
                Create_Razorpay_Order_Id_Api,
                actionParam as TCreateRazorpayOrderIdParam,
            );
            break;
        case 'Verify_Razorpay_Signature':
            yield call(
                Verify_Razorpay_Signature,
                actionParam as TVerifyRazorpaySignatureParam,
            );
            break;
    }
}

function* Insert_Security_Deposit_Api(
    actionParam: TInsertSecurityDepositParam,
) {
    try {
        // New REST API: POST /vendor/security-deposit (JWT; user from token).
        const dataObj = {
            amount: actionParam.amount,
            txnId: actionParam.txnId,
            remarks: 'Razorpay Payment Gateway',
        };

        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorSecurityDepositRestUrl,
            method: 'POST',
            data: dataObj,
        });

        // clientRestHandler resolves only on 2xx.
        actionParam.callBack(
            true,
            response?.body?.message || 'Security deposit updated successfully',
        );
    } catch (error: any) {
        showToast({
            type: 'error',
            text1: 'Failed to update security deposit',
            visibilityTime: 2000,
        });
        actionParam.callBack(
            false,
            error?.body?.message || 'Security deposit update failed',
        );
    }
}

function* Wallet_Balance_Api(actionParam: TWalletBalanceParam) {
    try {
        // New REST API: GET /vendor/balance (JWT; user from token).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorBalanceRestUrl,
            method: 'GET',
        });

        yield Wallet_Balance_Api_Response(response, actionParam.callBack);
    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Failed to fetch wallet balance',
            visibilityTime: 2000,
        });
        actionParam.callBack('0');
    }
}

function* Wallet_Balance_Api_Response(
    response: IResponseParam,
    callBack: (balance: string) => void,
) {
    try {
        const body = response?.body;
        // Body is the balance payload directly (plain JSON). Accept either a
        // { balance } object or a scalar value.
        const balance = body && typeof body === 'object' ? body.balance : body;
        callBack(String(balance ?? '0'));
    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Error processing wallet balance',
            visibilityTime: 2000,
        });
        callBack('0');
    }
}

function* Get_Recharge_History_Api(actionParam: TGetRechargeHistoryParam) {
    try {
        // New REST API: GET /vendor/recharge-details?from=&to= (JWT; user from token).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${projectEnv.vendorRechargeDetailsRestUrl}?from=${actionParam.fromDate}&to=${actionParam.toDate}`,
            method: 'GET',
        });

        yield Get_Recharge_History_Api_Response(response, actionParam.callBack);
    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Failed to fetch recharge history',
            visibilityTime: 2000,
        });
        actionParam.callBack([]);
    }
}

function* Get_Recharge_History_Api_Response(
    response: IResponseParam,
    callBack: (data: IRechargeHistoryItem[]) => void,
) {
    try {
        // Body is the recharge-history array directly (plain JSON).
        if (response && Array.isArray(response.body)) {
            callBack(response.body);
        } else {
            callBack([]);
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
        const { paymentResponse } = actionParam;

        // Mock verification - in production, send response to backend for verification
        // Backend should verify hash and transaction status with PayUMoney
        if (paymentResponse && paymentResponse.status === 'success') {
            // New REST API: POST /vendor/recharge (JWT; user from token).
            const dataObj = {
                amount: paymentResponse.amount,
                txnId: paymentResponse.txnid,
                remarks: 'Wallet Recharge',
            };

            const response: IResponseParam = yield call(clientRestHandler, {
                url: projectEnv.vendorRechargeRestUrl,
                method: 'POST',
                data: dataObj,
            });

            // clientRestHandler resolves only on 2xx.
            actionParam.callBack(
                true,
                response?.body?.message ||
                    'Payment completed and wallet updated successfully',
            );
        } else {
            actionParam.callBack(
                false,
                paymentResponse?.error_Message || 'Payment failed',
            );
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

function* Get_Vendor_Min_Recharge_Amt_Api(
    actionParam: TGetVendorMinRechargeAmtParam,
) {
    try {
        // New REST API: GET /vendor/min-recharge (JWT; user from token).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorMinRechargeRestUrl,
            method: 'GET',
        });

        yield Get_Vendor_Min_Recharge_Amt_Api_Response(
            response,
            actionParam.callBack,
        );
    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Failed to fetch minimum recharge amount',
            visibilityTime: 2000,
        });
        actionParam.callBack('0');
    }
}

function* Get_Vendor_Min_Recharge_Amt_Api_Response(
    response: IResponseParam,
    callBack: (minAmount: string) => void,
) {
    try {
        const body = response?.body;
        // Body is plain JSON. Accept { minAmount } object or a scalar value.
        const minAmount =
            body && typeof body === 'object'
                ? body.minRechargeAmt ?? body.minRechargeAmt ?? '0'
                : body ?? '0';
        callBack(String(minAmount));
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
    try {
        // New REST API: POST /vendor/payu-hash (JWT; user from token).
        const dataObj = {
            amount: parseFloat(actionParam.amount).toFixed(2),
            name: actionParam.name,
            emailid: actionParam.emailid,
        };

        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorPayuHashRestUrl,
            method: 'POST',
            data: dataObj,
        });

        // clientRestHandler resolves only on 2xx. Body is plain JSON.
        const body = response?.body || {};
        const hash = body.hashKey ?? body.HashKey;
        const txnid = body.txnId ?? body.TxnID;
        const PayUKey = body.payUKey ?? body.PayUKey;
        const ProductDetails = body.productDetails ?? body.ProductDetails;

        if (hash) {
            actionParam.callBack(true, hash, txnid, PayUKey, ProductDetails);
        } else {
            showToast({
                type: 'error',
                text1: 'Failed to generate hash key',
                visibilityTime: 2000,
            });
            actionParam.callBack(false, '', '', '', '');
        }
    } catch (error: any) {
        showToast({
            type: 'error',
            text1: error?.body?.message || 'Error generating hash key',
            visibilityTime: 2000,
        });
        actionParam.callBack(false, '', '', '', '');
    }
}

function* Create_Razorpay_Order_Id_Api(
    actionParam: TCreateRazorpayOrderIdParam,
) {
    try {
        // New REST API: POST /vendor/razorpay/order (JWT; user from token).
        const dataObj = {
            amount: actionParam.amount,
            paymentType: actionParam.payment_type,
        };

        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.razorpayOrderRestUrl,
            method: 'POST',
            data: dataObj,
        });

        // clientRestHandler resolves only on 2xx. Body is plain JSON.
        const body = response?.body || {};
        const orderId = body.orderId ?? body.order_id;

        if (orderId) {
            actionParam.callBack(true, orderId);
        } else {
            actionParam.callBack(
                false,
                undefined,
                'Order ID missing in response',
            );
        }
    } catch (error: any) {
        actionParam.callBack(
            false,
            undefined,
            error?.body?.message || error?.message || 'Order creation failed',
        );
    }
}

function* Verify_Razorpay_Signature(
    actionParam: TVerifyRazorpaySignatureParam,
) {
    try {
        // New REST API: POST /vendor/razorpay/verify (JWT; user from token).
        const dataObj = {
            order_id: actionParam.orderId,
            payment_id: actionParam.paymentId,
            signature: actionParam.signature,
            payment_type: actionParam.payment_type,
        };

        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.razorpayVerifyRestUrl,
            method: 'POST',
            data: dataObj,
        });

        // clientRestHandler resolves only on 2xx — verification succeeded.
        void response;
        actionParam.callBack(true);
    } catch (error: any) {
        actionParam.callBack(
            false,
            error?.body?.message ||
                error?.message ||
                'Signature verification failed',
        );
    }
}
