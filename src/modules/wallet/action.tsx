import { call, select } from "redux-saga/effects";
import { clientPostHandler } from "../../services/request";
import { RootState } from "../../../store";
import projectEnv from "../../services/env";
import { showToast } from "../../utils/common";

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
            UserID: GlobalState.userId,
        }
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getAllRechargeListForVendorUrl,
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
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== '') {
                const parsedData = JSON.parse(responseData.d);
                callBack(parsedData);
            } else {
                showToast({
                    type: 'error',
                    text1: 'No recharge history found',
                    visibilityTime: 2000,
                });
                callBack([]);
            }
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
