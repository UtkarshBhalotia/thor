import { call, select } from 'redux-saga/effects';
import { clientPostHandler } from '../../services/request';
import { RootState } from '../../../store';
import projectEnv from '../../services/env';
import { showToast } from '../../utils/common';

export function* conditionActions<
    T extends TUserBookingConditionParamActionName,
>(param: IUserBookingActionConditionParam<T>) {
    const {
        payload: { actionName, actionParam },
    } = param;
    switch (actionName) {
        case 'Get_Leads_List_Api':
            yield call(GetLeadsListApi, actionParam as TUserGetLeadsListParam);
            break;
        case 'Get_Lead_Detail_By_LeadId_Api':
            yield call(
                GetLeadDetailByLeadIdApi,
                actionParam as TUserGetLeadDetailByLeadIdParam,
            );
            break;
        case 'Accept_Lead_By_Vendor_Api':
            yield call(
                AcceptLeadByVendorApi,
                actionParam as TAcceptLeadByVendorParam,
            );
            break;
        case 'Deny_Lead_By_Vendor_Api':
            yield call(
                DenyLeadByVendorApi,
                actionParam as TDenyLeadByVendorParam,
            );
            break;
        case 'Complete_Lead_By_Vendor_Api':
            yield call(
                CompleteLeadByVendorApi,
                actionParam as TCompleteLeadByVendorParam,
            );
            break;
        case 'FollowUp_Lead_By_Vendor_Api':
            yield call(
                FollowUpLeadByVendorApi,
                actionParam as TFollowUpLeadByVendorParam,
            );
            break;
            yield call(
                GetDeniedReasonListApi,
                actionParam as TGetDeniedReasonListParam,
            );
            break;
        case 'Get_FollowUp_Reason_List_Api':
            yield call(
                GetFollowUpReasonListApi,
                actionParam as TGetFollowUpReasonListParam,
            );
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
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: url,
            data:
                url === projectEnv.getAllComplaintLeadForVendorUrl
                    ? { ...dataObj, LeadID: 0 }
                    : dataObj,
        });

        yield GetLeadsListApi_Response(response, actionParam.callBack);
    } catch (error) { }
}

function* GetLeadsListApi_Response(
    response: IResponseParam,
    callBack: (wB: any) => void,
) {
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
    } catch (error) { }
}

function* GetLeadDetailByLeadIdApi(
    actionParam: TUserGetLeadDetailByLeadIdParam,
) {
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
    } catch (error) { }
}

function* GetLeadDetailByLeadIdApi_Response(
    response: IResponseParam,
    callBack: (wB: any) => void,
) {
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
    } catch (error) { }
}

function* AcceptLeadByVendorApi(actionParam: TAcceptLeadByVendorParam) {
    console.log('actionParam', actionParam);

    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        const dataObj = {
            LeadID: actionParam.leadId,
            UserID: GlobalState.userId,
            Amount: actionParam.amount,
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.acceptLeadByVendorUrl,
            data: dataObj,
        });

        yield AcceptLeadByVendorApi_Response(response, actionParam.callBack);
    } catch (error) {
        actionParam.callBack(false, 'Failed to accept lead. Please try again.');
    }
}

function* AcceptLeadByVendorApi_Response(
    response: IResponseParam,
    callBack: (success: boolean, message: string) => void,
) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d === '1') {
                callBack(true, 'Lead accepted successfully');
                return;
            }

            let parsedData: any;
            try {
                parsedData = JSON.parse(responseData.d);
            } catch (e) {
                // If it's not valid JSON and not '1', treat as error message
                callBack(false, responseData.d || 'Failed to accept lead');
                return;
            }

            if (parsedData) {
                const isSuccess = parsedData.status === 'success' || parsedData.Status === 'success' || parsedData.status === true || parsedData.Status === true;
                callBack(
                    isSuccess,
                    parsedData.message ||
                    parsedData.Message ||
                    (isSuccess ? 'Lead accepted successfully' : 'Failed to accept lead'),
                );
            } else {
                callBack(false, 'Failed to accept lead. Please try again.');
            }
        }
    } catch (error) {
        callBack(false, 'An error occurred while accepting the lead');
        showToast({
            type: 'error',
            text1: 'An error occurred while accepting the lead',
            visibilityTime: 3000,
        });
    }
}

function* DenyLeadByVendorApi(actionParam: TDenyLeadByVendorParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        const dataObj = {
            LeadID: actionParam.leadId,
            UserID: GlobalState.userId,
            Reason: actionParam.reason,
            Amount: actionParam.amount || '',
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.insertLeadDeniedByVendorUrl,
            data: dataObj,
        });

        yield DenyLeadByVendorApi_Response(response, actionParam.callBack);
    } catch (error) {
        actionParam.callBack(false, 'Failed to deny lead. Please try again.');
    }
}

function* DenyLeadByVendorApi_Response(
    response: IResponseParam,
    callBack: (success: boolean, message: string) => void,
) {
    try {
        if (response && response.body) {
            const responseData = response.body;
            if (responseData.d === '1') {
                callBack(true, 'Lead denied successfully');
                return;
            }

            let parsedData: any;
            try {
                parsedData = JSON.parse(responseData.d);
            } catch (e) {
                callBack(false, responseData.d || 'Failed to deny lead');
                return;
            }

            if (parsedData) {
                const isSuccess = parsedData.status === 'success' || parsedData.Status === 'success' || parsedData.status === true || parsedData.Status === true;
                callBack(
                    isSuccess,
                    parsedData.message ||
                    parsedData.Message ||
                    (isSuccess ? 'Lead denied successfully' : 'Failed to deny lead'),
                );
            } else {
                callBack(false, 'Failed to deny lead. Please try again.');
            }
        }
    } catch (error) {
        callBack(false, 'An error occurred while denying the lead');
        showToast({
            type: 'error',
            text1: 'An error occurred while denying the lead',
            visibilityTime: 3000,
        });
    }
}

function* CompleteLeadByVendorApi(actionParam: TCompleteLeadByVendorParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        const isReComplaint =
            actionParam.status?.trim().toLowerCase() === 're-complaint';

        const dataObj = isReComplaint
            ? {
                LeadID: actionParam.leadId,
                ReComplaintID: actionParam.reComplaintId,
            }
            : {
                LeadID: actionParam.leadId,
                UserID: GlobalState.userId,
                PartsDesc: actionParam.partsDesc,
                Remarks: actionParam.remarks || '',
                CustomerAmount: actionParam.customerAmount,
            };

        const response: IResponseParam = yield call(clientPostHandler, {
            url: isReComplaint
                ? projectEnv.insertReComplaintCompletedByVendorUrl
                : projectEnv.insertLeadCompletedByVendorUrl,
            data: dataObj,
        });

        yield CompleteLeadByVendorApi_Response(response, actionParam.callBack);
    } catch (error) {
        actionParam.callBack(false, 'Failed to complete lead. Please try again.');
    }
}

function* CompleteLeadByVendorApi_Response(
    response: IResponseParam,
    callBack: (success: boolean, message: string) => void,
) {
    try {
        if (response && response.body) {
            const responseData = response.body;
            if (responseData.d === '1') {
                callBack(true, 'Lead completed successfully');
                return;
            }

            let parsedData: any;
            try {
                parsedData = JSON.parse(responseData.d);
            } catch (e) {
                callBack(false, responseData.d || 'Failed to complete lead');
                return;
            }

            if (parsedData) {
                const isSuccess = parsedData.status === 'success' || parsedData.Status === 'success' || parsedData.status === true || parsedData.Status === true;
                callBack(
                    isSuccess,
                    parsedData.message ||
                    parsedData.Message ||
                    (isSuccess ? 'Lead completed successfully' : 'Failed to complete lead'),
                );
            } else {
                callBack(false, 'Failed to complete lead. Please try again.');
            }
        }
    } catch (error) {
        callBack(false, 'An error occurred while completing the lead');
        showToast({
            type: 'error',
            text1: 'An error occurred while completing the lead',
            visibilityTime: 3000,
        });
    }
}

function* FollowUpLeadByVendorApi(actionParam: TFollowUpLeadByVendorParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        const dataObj = {
            LeadID: actionParam.leadId,
            UserID: GlobalState.userId,
            Desc: actionParam.desc,
            NextDate: actionParam.nextDate,
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.insertLeadFollowUpByVendorUrl,
            data: dataObj,
        });

        yield FollowUpLeadByVendorApi_Response(response, actionParam.callBack);
    } catch (error) {
        actionParam.callBack(false, 'Failed to add follow up. Please try again.');
    }
}

function* FollowUpLeadByVendorApi_Response(
    response: IResponseParam,
    callBack: (success: boolean, message: string) => void,
) {
    try {
        if (response && response.body) {
            const responseData = response.body;
            if (responseData.d === '1') {
                callBack(true, 'Follow up added successfully');
                return;
            }

            let parsedData: any;
            try {
                parsedData = JSON.parse(responseData.d);
            } catch (e) {
                callBack(false, responseData.d || 'Failed to add follow up');
                return;
            }

            if (parsedData) {
                const isSuccess = parsedData.status === 'success' || parsedData.Status === 'success' || parsedData.status === true || parsedData.Status === true;
                callBack(
                    isSuccess,
                    parsedData.message ||
                    parsedData.Message ||
                    (isSuccess ? 'Follow up added successfully' : 'Failed to add follow up'),
                );
            } else {
                callBack(false, 'Failed to add follow up. Please try again.');
            }
        }
    } catch (error) {
        callBack(false, 'An error occurred while adding follow up');
        showToast({
            type: 'error',
            text1: 'An error occurred while adding follow up',
            visibilityTime: 3000,
        });
    }
}

function* GetDeniedReasonListApi(actionParam: TGetDeniedReasonListParam) {
    try {
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getDeniedReasonListUrl,
            data: {},
        });

        yield GetDeniedReasonListApi_Response(response, actionParam.callBack);
    } catch (error) {
        actionParam.callBack([]);
    }
}


function* GetDeniedReasonListApi_Response(
    response: IResponseParam,
    callBack: (data: any[]) => void,
) {
    try {
        if (response.body.status === 'success') {
            let reasons = [];
            try {
                // The API returns a stringified JSON array in data.response
                reasons = JSON.parse(response.body.data.response);
            } catch (e) {
                console.error('Error parsing denied reasons:', e);
                reasons = [];
            }
            callBack(Array.isArray(reasons) ? reasons : []);
        } else {
            callBack([]);
            showToast({
                type: 'error',
                text1: response.body.msg || response.body.message || 'Failed to fetch denied reasons',
                visibilityTime: 3000,
            });
        }
    } catch (error) {
        callBack([]);
        showToast({
            type: 'error',
            text1: 'Failed to fetch denied reasons',
            visibilityTime: 3000,
        });
    }
}

function* GetFollowUpReasonListApi(actionParam: TGetFollowUpReasonListParam) {
    try {
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getFollowupReasonListUrl,
            data: {},
        });

        yield GetFollowUpReasonListApi_Response(response, actionParam.callBack);
    } catch (error) {
        actionParam.callBack([]);
    }
}

function* GetFollowUpReasonListApi_Response(
    response: IResponseParam,
    callBack: (data: any[]) => void,
) {
    try {
        if (response.body.status === 'success') {
            let reasons = [];
            try {
                // The API returns a stringified JSON array in data.response
                reasons = JSON.parse(response.body.data.response);
            } catch (e) {
                console.error('Error parsing follow up reasons:', e);
                reasons = [];
            }
            callBack(Array.isArray(reasons) ? reasons : []);
        } else {
            callBack([]);
            showToast({
                type: 'error',
                text1: response.body.msg || response.body.message || 'Failed to fetch follow up reasons',
                visibilityTime: 3000,
            });
        }
    } catch (error) {
        callBack([]);
        showToast({
            type: 'error',
            text1: 'Failed to fetch follow up reasons',
            visibilityTime: 3000,
        });
    }
}
