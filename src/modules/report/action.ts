import { call, select } from 'redux-saga/effects';
import { clientRestHandler } from '../../services/request';
import { RootState } from '../../../store';
import projectEnv from '../../services/env';
import { showToast } from '../../utils/common';
import {
    IReportActionConditionParam,
    TReportConditionParamActionName,
    TReportConditionParamActionParam,
    TUserGetWorkReportForVendorParam,
    TReportData,
    IResponseParam
} from './type';

export function* conditionActions<
    T extends TReportConditionParamActionName,
>(param: IReportActionConditionParam<T>) {
    const {
        payload: { actionName, actionParam },
    } = param;
    switch (actionName) {
        case 'Get_Work_Report_For_Vendor_Api':
            yield call(
                GetWorkReportForVendorApi,
                actionParam as TUserGetWorkReportForVendorParam,
            );
            break;
    }
}

function* GetWorkReportForVendorApi(
    actionParam: TUserGetWorkReportForVendorParam,
) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        const userType = (actionParam.userType || GlobalState.userType || '').trim().toUpperCase();
        const isAdmin = userType === 'A' || userType === 'ADMIN';
        // New REST API: GET /admin/work-report or /vendor/work-report?from=&to=
        // (JWT; the user is derived from the token, so no UserID is sent).
        const url = isAdmin
            ? projectEnv.adminWorkReportRestUrl
            : projectEnv.vendorWorkReportRestUrl;

        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${url}?from=${actionParam.fromDate}&to=${actionParam.toDate}`,
            method: 'GET',
        });

        yield GetWorkReportForVendorApi_Response(
            response,
            actionParam.callBack,
        );
    } catch (error) {
        console.error('Error in GetWorkReportForVendorApi:', error);
        showToast({
            type: 'error',
            text1: 'Failed to fetch report',
            visibilityTime: 2000,
        });
        actionParam.callBack({
            ongoing: 0,
            denied: 0,
            completed: 0,
            follow: 0,
            reCompleted: 0,
            reComplaint: 0,
            totalRevenue: 0,
        });
    }
}

function* GetWorkReportForVendorApi_Response(
    response: IResponseParam,
    callBack: (data: TReportData) => void,
) {
    try {
        // Body is the work-report array directly (same field names as before).
        const parsedData = response?.body;

        const reportData: TReportData = {
            ongoing: 0,
            denied: 0,
            completed: 0,
            follow: 0,
            reCompleted: 0,
            reComplaint: 0,
            totalRevenue: 0,
        };

        if (Array.isArray(parsedData) && parsedData.length > 0) {
            parsedData.forEach((item: any) => {
                const leadStatus = item.LeadStatus || '';
                const total = parseInt(item.Total || '0', 10);
                const totalAmt = parseFloat(item.TotalAmt || '0');

                // Match against potential status names from API
                if (leadStatus === 'Ongoing') {
                    reportData.ongoing = total;
                } else if (leadStatus === 'Denied') {
                    reportData.denied = total;
                } else if (leadStatus === 'Completed') {
                    reportData.completed = total;
                    reportData.totalRevenue = totalAmt;
                } else if (leadStatus === 'Follow Up' || leadStatus === 'Follow') {
                    reportData.follow = total;
                } else if (leadStatus === 'Re-Completed' || leadStatus === 'ReCompleted') {
                    reportData.reCompleted = total;
                } else if (leadStatus === 'Re-Complaint' || leadStatus === 'ReComplaint') {
                    reportData.reComplaint = total;
                }
            });
        } else {
            showToast({
                type: 'error',
                text1: 'No report data found',
                visibilityTime: 2000,
            });
        }

        callBack(reportData);
    } catch (error) {
        console.error('Error in GetWorkReportForVendorApi_Response:', error);
        callBack({
            ongoing: 0,
            denied: 0,
            completed: 0,
            follow: 0,
            reCompleted: 0,
            reComplaint: 0,
            totalRevenue: 0,
        });
    }
}
