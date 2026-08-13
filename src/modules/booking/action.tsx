import { call } from 'redux-saga/effects';
import { clientRestHandler } from '../../services/request';
import projectEnv from '../../services/env';
import { showToast } from '../../utils/common';
import { IResponseParam } from '../dashboard/type';
import {
    TUserBookingConditionParamActionName,
    IUserBookingActionConditionParam,
    TUserGetLeadsListParam,
    TUserGetLeadDetailByLeadIdParam,
    TAcceptLeadByVendorParam,
    TDenyLeadByVendorParam,
    TCompleteLeadByVendorParam,
    TFollowUpLeadByVendorParam,
    TGetDeniedReasonListParam,
    TGetFollowUpReasonListParam,
} from './type';

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
        case 'Get_Denied_Reason_List_Api':
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
        // New REST API: one GET endpoint per tab (JWT; vendor from the token,
        // so no UserID / LeadID payload is sent any more).
        let url = projectEnv.vendorOngoingLeadsRestUrl; // Default
        switch (actionParam.status) {
            case 'New':
                url = projectEnv.vendorNewLeadsRestUrl;
                break;
            case 'Ongoing':
                url = projectEnv.vendorOngoingLeadsRestUrl;
                break;
            case 'Follow Up':
                url = projectEnv.vendorFollowUpLeadsRestUrl;
                break;
            case 'Denied':
                url = projectEnv.vendorDeniedLeadsRestUrl;
                break;
            case 'Completed':
                url = projectEnv.vendorCompletedLeadsRestUrl;
                break;
            case 'Complaint':
                url = projectEnv.vendorComplaintLeadsRestUrl;
                break;
        }

        const response: IResponseParam = yield call(clientRestHandler, {
            url: url,
            method: 'GET',
        });

        yield GetLeadsListApi_Response(response, actionParam.callBack);
    } catch (error) {
        // Network/non-2xx — resolve the caller so its loader always clears.
        actionParam.callBack([]);
    }
}

function* GetLeadsListApi_Response(
    response: IResponseParam,
    callBack: (wB: any) => void,
) {
    try {
        // Body is the leads array directly (same field names as before).
        if (response && Array.isArray(response.body)) {
            callBack(response.body);
        } else {
            callBack([]); // Return empty array if no data
            showToast({
                type: 'error',
                text1: 'No data found',
                visibilityTime: 2000,
            });
        }
    } catch (error) {
        callBack([]);
    }
}

function* GetLeadDetailByLeadIdApi(
    actionParam: TUserGetLeadDetailByLeadIdParam,
) {
    try {
        // New REST API: GET /vendor/lead/{leadId} (JWT; ownership from token).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${projectEnv.vendorLeadDetailRestUrl}/${actionParam.leadId}`,
            method: 'GET',
        });

        yield GetLeadDetailByLeadIdApi_Response(response, actionParam.callBack);
    } catch (error) {
        actionParam.callBack(null);
    }
}

function* GetLeadDetailByLeadIdApi_Response(
    response: IResponseParam,
    callBack: (wB: any) => void,
) {
    try {
        if (response && response.body) {
            // Body is the lead detail object directly (same field names).
            console.log(response.body, 'efjejfwij@@@@');

            callBack(response.body);
        } else {
            callBack(null);
            showToast({
                type: 'error',
                text1: 'No lead details found',
                visibilityTime: 2000,
            });
        }
    } catch (error) {
        callBack(null);
    }
}

/**
 * Shared error message extractor for the lead actions. The new REST endpoints
 * reject with { status, body }; a business failure carries body.message.
 */
function leadActionError(error: any, fallback: string) {
    return error?.body?.message || error?.body?.error?.message || fallback;
}

function* AcceptLeadByVendorApi(actionParam: TAcceptLeadByVendorParam) {
    try {
        // New REST API: POST /vendor/lead/{leadId}/accept (JWT).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${projectEnv.vendorLeadDetailRestUrl}/accept`,
            method: 'POST',
            data: { leadId: actionParam.leadId, amount: actionParam.amount },
        });

        // clientRestHandler resolves only on 2xx.
        actionParam.callBack(
            true,
            response?.body?.message || 'Lead accepted successfully',
        );
    } catch (error: any) {
        actionParam.callBack(
            false,
            leadActionError(error, 'Failed to accept lead. Please try again.'),
        );
    }
}

function* DenyLeadByVendorApi(actionParam: TDenyLeadByVendorParam) {
    try {
        // New REST API: POST /vendor/lead/{leadId}/deny (JWT).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${projectEnv.vendorLeadDetailRestUrl}/deny`,
            method: 'POST',
            data: {
                reason: actionParam.reason,
                amount: actionParam.amount || '',
                leadId: actionParam.leadId,
            },
        });

        actionParam.callBack(
            true,
            response?.body?.message || 'Lead denied successfully',
        );
    } catch (error: any) {
        actionParam.callBack(
            false,
            leadActionError(error, 'Failed to deny lead. Please try again.'),
        );
    }
}

function* CompleteLeadByVendorApi(actionParam: TCompleteLeadByVendorParam) {
    try {
        const isReComplaint =
            actionParam.status?.trim().toLowerCase() === 're-complaint';

        // New REST API: POST /vendor/lead/{leadId}/complete, or
        // /vendor/lead/{leadId}/recomplaint-complete for a re-complaint.
        const url = isReComplaint
            ? `${projectEnv.vendorLeadDetailRestUrl}/recomplaint-complete`
            : `${projectEnv.vendorLeadDetailRestUrl}/complete`;

        const dataObj = isReComplaint
            ? { reComplaintId: actionParam.reComplaintId }
            : {
                  partsDesc: actionParam.partsDesc,
                  remarks: actionParam.remarks || '',
                  customerAmount: actionParam.customerAmount,
                  leadId: actionParam.leadId,
              };

        const response: IResponseParam = yield call(clientRestHandler, {
            url: url,
            method: 'POST',
            data: dataObj,
        });

        actionParam.callBack(
            true,
            response?.body?.message || 'Lead completed successfully',
        );
    } catch (error: any) {
        actionParam.callBack(
            false,
            leadActionError(
                error,
                'Failed to complete lead. Please try again.',
            ),
        );
    }
}

function* FollowUpLeadByVendorApi(actionParam: TFollowUpLeadByVendorParam) {
    try {
        // New REST API: POST /vendor/lead/{leadId}/follow-up (JWT).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${projectEnv.vendorLeadDetailRestUrl}/followUp`,
            method: 'POST',
            data: {
                desc: actionParam.desc,
                nextDate: actionParam.nextDate,
                leadId: actionParam.leadId,
            },
        });

        actionParam.callBack(
            true,
            response?.body?.message || 'Follow up added successfully',
        );
    } catch (error: any) {
        actionParam.callBack(
            false,
            leadActionError(
                error,
                'Failed to add follow up. Please try again.',
            ),
        );
    }
}

function* GetDeniedReasonListApi(actionParam: TGetDeniedReasonListParam) {
    try {
        // New REST API: GET /denied-reasons. Body is the array directly.
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.deniedReasonsRestUrl,
            method: 'GET',
        });

        yield GetDeniedReasonListApi_Response(response, actionParam.callBack);
    } catch (error: any) {
        actionParam.callBack([]);
        showToast({
            type: 'error',
            text1: error?.body?.message || 'Failed to fetch denied reasons',
            visibilityTime: 3000,
        });
    }
}

function* GetDeniedReasonListApi_Response(
    response: IResponseParam,
    callBack: (data: any[]) => void,
) {
    try {
        callBack(Array.isArray(response?.body) ? response.body : []);
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
        // New REST API: GET /followup-reasons. Body is the array directly.
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.followUpReasonsRestUrl,
            method: 'GET',
        });

        yield GetFollowUpReasonListApi_Response(response, actionParam.callBack);
    } catch (error: any) {
        actionParam.callBack([]);
        showToast({
            type: 'error',
            text1: error?.body?.message || 'Failed to fetch follow up reasons',
            visibilityTime: 3000,
        });
    }
}

function* GetFollowUpReasonListApi_Response(
    response: IResponseParam,
    callBack: (data: any[]) => void,
) {
    try {
        callBack(Array.isArray(response?.body) ? response.body : []);
    } catch (error) {
        callBack([]);
        showToast({
            type: 'error',
            text1: 'Failed to fetch follow up reasons',
            visibilityTime: 3000,
        });
    }
}
