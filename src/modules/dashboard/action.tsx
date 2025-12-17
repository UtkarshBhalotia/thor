import { call, select } from "redux-saga/effects";
import { clientPostHandler } from "../../services/request";
import { RootState } from "../../../store";
import projectEnv from "../../services/env";

export function* conditionActions<T extends TUserDashboardConditionParamActionName>
    (param: IUserDashboardActionConditionParam<T>) {
    const { payload: { actionName, actionParam } } = param;
    switch (actionName) {
        case 'UserAuth_Wallet_Balance_Api':
            yield call(UserAuth_Wallet_Balance_Api, actionParam);
            break;
    }
}

function* UserAuth_Wallet_Balance_Api(actionParam: TUserWalletBalanceParam) {
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

        console.log(response, "Response");


        // yield UserAuth_Wallet_Balance_Api_Response(response, actionParam.callBack);


    } catch (error) {

    }
}
