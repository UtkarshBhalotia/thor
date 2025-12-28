import { call, select } from "redux-saga/effects";
import { clientPostHandler } from "../../services/request";
import { RootState } from "../../../store";
import projectEnv from "../../services/env";
import { showToast } from "../../utils/common";

export function* conditionActions<T extends TUserBookingConditionParamActionName>
    (param: IUserBookingActionConditionParam<T>) {
    const { payload: { actionName, actionParam } } = param;
    switch (actionName) {
        case 'Get_Leads_List_Api':
            yield call(GetLeadsListApi, actionParam as TUserGetLeadsListParam);
            break;
        case 'Get_Lead_Detail_By_LeadId_Api':
            yield call(GetLeadDetailByLeadIdApi, actionParam as TUserGetLeadDetailByLeadIdParam);
            break;
    }
}

function* GetLeadsListApi(actionParam: TUserGetLeadsListParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        let url = projectEnv.getAllOngoingLeadForVendorUrl; // Default
        switch (actionParam.status) {
            case 'New':
                url = projectEnv.getAllNewLeadForVendorUrl;
                break;
            case 'Ongoing':
                url = projectEnv.getAllOngoingLeadForVendorUrl;
                break;
            case 'Follow Up':
                url = projectEnv.getAllFollowUpLeadForVendorUrl;
                break;
            case 'Denied':
                url = projectEnv.getAllDeniedLeadForVendorUrl;
                break;
            case 'Completed':
                url = projectEnv.getAllCompletedLeadForVendorUrl;
                break;
            case 'Complaint':
                url = projectEnv.getAllComplaintLeadForVendorUrl;
                break;
        }

        const dataObj = {
            UserID: GlobalState.userId,
        }
        const response: IResponseParam = yield call(clientPostHandler, {
            url: url,
            data: url === projectEnv.getAllComplaintLeadForVendorUrl ? { ...dataObj, LeadID: 0 } : dataObj,
        });

        yield GetLeadsListApi_Response(response, actionParam.callBack);

    } catch (error) {

    }
}

function* GetLeadsListApi_Response(response: IResponseParam, callBack: (wB: any) => void) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== '') {
                const parsedData = JSON.parse(responseData.d);
                callBack(parsedData);

            } else {
                callBack([]); // Return empty array if no data
                showToast({
                    type: 'error',
                    text1: 'No data found',
                    visibilityTime: 2000,
                });
            }
        }

    } catch (error) {

    }
}

function* GetLeadDetailByLeadIdApi(actionParam: TUserGetLeadDetailByLeadIdParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        const dataObj = {
            LeadID: actionParam.leadId,
            AcceptByID: GlobalState.userId,
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getLeadDetailByLeadIdForVendorUrl,
            data: dataObj,
        });

        yield GetLeadDetailByLeadIdApi_Response(response, actionParam.callBack);

    } catch (error) {

    }
}

function* GetLeadDetailByLeadIdApi_Response(response: IResponseParam, callBack: (wB: any) => void) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== '') {
                const parsedData = JSON.parse(responseData.d);
                callBack(parsedData);

            } else {
                callBack(null);
                showToast({
                    type: 'error',
                    text1: 'No lead details found',
                    visibilityTime: 2000,
                });
            }
        }

    } catch (error) {

    }
}
