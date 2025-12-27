import { call, select } from "redux-saga/effects";
import { clientPostHandler } from "../../services/request";
import { RootState } from "../../../store";
import projectEnv from "../../services/env";
import { showToast } from "../../utils/common";

export function* conditionActions<T extends TUserDashboardConditionParamActionName>
    (param: IUserDashboardActionConditionParam<T>) {
    const { payload: { actionName, actionParam } } = param;
    switch (actionName) {
        case 'Wallet_Balance_Api':
            yield call(Wallet_Balance_Api, actionParam as TUserWalletBalanceParam);
            break;
        case 'Total_Security_Deposit_Api':
            yield call(Total_Security_Deposit_Api, actionParam as TUserTotalSecurityDepositParam);
            break;
        case 'Get_OnGoing_Services_List_Api':
            yield call(GetOnGoingServicesListApi, actionParam as TUserGetOnGoingServicesListParam);
            break;
        case 'Get_New_Leads_List_Api':
            yield call(GetNewLeadsListApi, actionParam as TUserGetNewLeadsListParam);
            break;
        case 'Get_Completed_Services_List_Api':
            yield call(GetCompletedServicesListApi, actionParam as TUserGetCompletedServicesListParam);
            break;
    }
}

function* Wallet_Balance_Api(actionParam: TUserWalletBalanceParam) {
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

        yield UserAuth_Wallet_Balance_Api_Response(response, actionParam.callBack);

    } catch (error) {

    }
}

function* GetNewLeadsListApi(actionParam: TUserGetNewLeadsListParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );
        const dataObj = {
            UserID: GlobalState.userId,
        }
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getAllNewLeadForVendorUrl,
            data: dataObj,
        });
        yield GetOnGoingServicesListApi_Response(response, actionParam.callBack);
    } catch (error) {
    }
}

function* GetCompletedServicesListApi(actionParam: TUserGetCompletedServicesListParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );
        const dataObj = {
            UserID: GlobalState.userId,
        }
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getAllCompletedLeadForVendorUrl,
            data: dataObj,
        });
        yield GetOnGoingServicesListApi_Response(response, actionParam.callBack);
    } catch (error) {
    }
}

function* UserAuth_Wallet_Balance_Api_Response(response: IResponseParam, callBack: (wB: any) => void) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== '') {
                const parsedData = JSON.parse(responseData.d);
                callBack(parsedData);

                showToast({
                    type: 'success',
                    text1: 'Login Successfully',
                    visibilityTime: 2000,
                });

            } else {
                showToast({
                    type: 'error',
                    text1: 'Wrong Username or Password',
                    visibilityTime: 2000,
                });
            }
        }

    } catch (error) {



    }
}

function* Total_Security_Deposit_Api(actionParam: TUserTotalSecurityDepositParam) {

    try {

        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        const dataObj = {
            UserID: GlobalState.userId,
        }
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.totalSecurityDepositUrl,
            data: dataObj,
        });

        yield Total_Security_Deposit_Api_Response(response, actionParam.callBack);

    } catch (error) {


    }
}

function* Total_Security_Deposit_Api_Response(response: IResponseParam, callBack: (wB: any) => void) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== '') {
                const parsedData = JSON.parse(responseData.d);
                const [{ DepositeAmt, MaintenanceAmt }] = parsedData;
                //array destructuring

                callBack({ DepositeAmt, MaintenanceAmt });

            } else {
                showToast({
                    type: 'error',
                    text1: '',
                    visibilityTime: 2000,
                });
            }
        }

    } catch (error) {


    }
}

function* GetOnGoingServicesListApi(actionParam: TUserGetOnGoingServicesListParam) {
    console.log('GetOnGoingServicesListApi');

    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );
        const dataObj = {
            UserID: GlobalState.userId,
        }
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getAllOngoingLeadForVendorUrl,
            data: dataObj,
        });

        yield GetOnGoingServicesListApi_Response(response, actionParam.callBack);

    } catch (error) {


    }
}

function* GetOnGoingServicesListApi_Response(response: IResponseParam, callBack: (wB: any) => void) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== '') {
                const parsedData = JSON.parse(responseData.d);
                callBack(parsedData);

            } else {
                showToast({
                    type: 'error',
                    text1: '',
                    visibilityTime: 2000,
                });
            }
        }

    } catch (error) {


    }
}



