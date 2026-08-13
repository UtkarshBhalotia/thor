import { call } from 'redux-saga/effects';
import { clientRestHandler } from '../../services/request';
import projectEnv from '../../services/env';
import { showToast } from '../../utils/common';
import {
    TUserDashboardConditionParamActionName,
    IUserDashboardActionConditionParam,
    TUserWalletBalanceParam,
    TUserTotalSecurityDepositParam,
    TUserGetAllTypeVendorBalanceParam,
    TUserGetOnGoingServicesListParam,
    TUserGetLeadDetailByLeadIdParam,
    TUserGetWorkReportForVendorParam,
    TUserCheckVendorCompatibilityVersionParam,
    IResponseParam,
} from './type';

export function* conditionActions<
    T extends TUserDashboardConditionParamActionName,
>(param: IUserDashboardActionConditionParam<T>) {
    const {
        payload: { actionName, actionParam },
    } = param;
    switch (actionName) {
        case 'Wallet_Balance_Api':
            yield call(
                Wallet_Balance_Api,
                actionParam as TUserWalletBalanceParam,
            );
            break;
        case 'Total_Security_Deposit_Api':
            yield call(
                Total_Security_Deposit_Api,
                actionParam as TUserTotalSecurityDepositParam,
            );
            break;
        case 'Get_All_Type_Vendor_Balance_Api':
            yield call(
                Get_All_Type_Vendor_Balance_Api,
                actionParam as TUserGetAllTypeVendorBalanceParam,
            );
            break;
        case 'Get_OnGoing_Services_List_Api':
            yield call(
                GetOnGoingServicesListApi,
                actionParam as TUserGetOnGoingServicesListParam,
            );
            break;
        case 'Get_Lead_Detail_By_LeadId_Api':
            yield call(
                GetLeadDetailByLeadIdApi,
                actionParam as TUserGetLeadDetailByLeadIdParam,
            );
            break;
        case 'Get_Work_Report_For_Vendor_Api':
            yield call(
                GetWorkReportForVendorApi,
                actionParam as TUserGetWorkReportForVendorParam,
            );
            break;
        case 'Check_Vendor_Compatibility_Version_Api':
            yield call(
                Check_Vendor_Compatibility_Version_Api,
                actionParam as TUserCheckVendorCompatibilityVersionParam,
            );
            break;
    }
}

function* Wallet_Balance_Api(actionParam: TUserWalletBalanceParam) {
    try {
        // New REST API: GET /api/mobile/vendor/balance (JWT; user derived from token).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorBalanceRestUrl,
            method: 'GET',
        });

        yield UserAuth_Wallet_Balance_Api_Response(
            response,
            actionParam.callBack,
        );
    } catch (error) {}
}

function* UserAuth_Wallet_Balance_Api_Response(
    response: IResponseParam,
    callBack: (wB: any) => void,
) {
    try {
        if (response && response.body) {
            // Body is the balance payload directly (same field names as before).
            callBack(response.body);
        }
    } catch (error) {}
}

function* Total_Security_Deposit_Api(
    actionParam: TUserTotalSecurityDepositParam,
) {
    try {
        // New REST API: GET /api/mobile/vendor/security-deposit (JWT).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorSecurityDepositRestUrl,
            method: 'GET',
        });

        yield Total_Security_Deposit_Api_Response(
            response,
            actionParam.callBack,
        );
    } catch (error) {}
}

function* Total_Security_Deposit_Api_Response(
    response: IResponseParam,
    callBack: (wB: any) => void,
) {
    try {
        if (response && response.body) {
            // Body is an array of { DepositeAmt, MaintenanceAmt } (same shape).
            const [{ DepositeAmt, MaintenanceAmt }] = response.body;
            callBack({ DepositeAmt, MaintenanceAmt });
        }
    } catch (error) {}
}

function* Get_All_Type_Vendor_Balance_Api(
    actionParam: TUserGetAllTypeVendorBalanceParam,
) {
    try {
        // New REST API: GET /vendor/all-type-balance (JWT).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorAllTypeBalanceRestUrl,
            method: 'GET',
        });

        yield Get_All_Type_Vendor_Balance_Api_Response(
            response,
            actionParam.callBack,
        );
    } catch (error) {
        // Network/parse failure — still fire the callback so the caller's
        // load chain (and its in-flight guard) resolves.
        actionParam.callBack({
            walletBalance: '0',
            securityDeposit: '0',
            systemCharges: '0',
            totalNewLead: 0,
            totalOngoingLead: 0,
        });
    }
}

function* Get_All_Type_Vendor_Balance_Api_Response(
    response: IResponseParam,
    callBack: (data: {
        walletBalance: string;
        securityDeposit: string;
        systemCharges: string;
        totalNewLead: number;
        totalOngoingLead: number | string;
    }) => void,
) {
    try {
        if (response && response.body) {
            // Fields now sit directly on the body (same names as before).
            const responseData = response.body;

            // Extract balance data from the API response
            const walletBalance = String(responseData.balance || 0);
            const securityDeposit = String(responseData.depositeAmt || 0);
            const systemCharges = String(responseData.maintenanceAmt || 0);
            const totalNewLead = Number(responseData.totalNewLead || 0);
            const totalOngoingLead = Number(responseData.totalOngoingLead || 0);

            callBack({
                walletBalance,
                securityDeposit,
                systemCharges,
                totalNewLead,
                totalOngoingLead,
            });
        } else {
            // Blank/empty body — return zeros so the callback still fires
            // and the dashboard load chain continues.
            callBack({
                walletBalance: '0',
                securityDeposit: '0',
                systemCharges: '0',
                totalNewLead: 0,
                totalOngoingLead: 0,
            });
        }
    } catch (error) {
        callBack({
            walletBalance: '0',
            securityDeposit: '0',
            systemCharges: '0',
            totalNewLead: 0,
            totalOngoingLead: 0,
        });
        showToast({
            type: 'error',
            text1: 'Something Went Wrong. Please Try Again Later.',
            visibilityTime: 2000,
        });
    }
}

function* GetOnGoingServicesListApi(
    actionParam: TUserGetOnGoingServicesListParam,
) {
    try {
        // New REST API: GET /api/mobile/vendor/ongoing-leads (JWT).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorOngoingLeadsRestUrl,
            method: 'GET',
        });

        yield GetOnGoingServicesListApi_Response(
            response,
            actionParam.callBack,
        );
    } catch (error) {}
}

function* GetOnGoingServicesListApi_Response(
    response: IResponseParam,
    callBack: (wB: any) => void,
) {
    try {
        if (response && response.body) {
            // The REST API returns camelCase keys (e.g. leadId, leadNo) but
            // the dashboard UI expects PascalCase (LeadID, LeadNo, etc.).
            // Map each item so the rest of the codebase stays unchanged.
            const rawList = Array.isArray(response.body)
                ? response.body
                : [response.body];

            const mapped = rawList.map((item: any) => ({
                LeadID: String(item.leadId ?? item.LeadID ?? ''),
                LeadNo: item.leadNo ?? item.LeadNo ?? '',
                ServiceTypeName:
                    item.serviceTypeName ?? item.ServiceTypeName ?? '',
                LeadStatus: item.leadStatus ?? item.LeadStatus ?? '',
                LeadDate: item.leadDate ?? item.LeadDate ?? '',
                BrandName: item.brandName ?? item.BrandName ?? '',
                ModelName: item.modelName ?? item.ModelName ?? '',
                Desc: item.desc ?? item.Desc ?? '',
                LeadAmount: String(item.leadAmount ?? item.LeadAmount ?? ''),
                StateName: item.stateName ?? item.StateName ?? '',
                CityName: item.cityName ?? item.CityName ?? '',
                CustomerName:
                    item.customerName ?? item.CustomerName ?? '',
                MobileNo: item.mobileNo ?? item.MobileNo ?? '',
                Address: item.address ?? item.Address ?? '',
                AcceptDate: item.acceptDate ?? item.AcceptDate ?? '',
                // Keep any extra fields the UI might reference
                customerName:
                    item.customerName ?? item.CustomerName ?? '',
                mobileNo: item.mobileNo ?? item.MobileNo ?? '',
            }));

            callBack(mapped);
        } else {
            // Blank/empty body — fire the callback with an empty list so the
            // caller (and the loader) always resolves.
            callBack([]);
        }
    } catch (error) {
        callBack([]);
    }
}

function* GetLeadDetailByLeadIdApi(
    actionParam: TUserGetLeadDetailByLeadIdParam,
) {
    try {
        // New REST API: GET /vendor/lead/{leadId} (JWT; ownership derived from token).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${projectEnv.vendorLeadDetailRestUrl}/${actionParam.leadId}`,
            method: 'GET',
        });

        yield GetLeadDetailByLeadIdApi_Response(response, actionParam.callBack);
    } catch (error) {}
}

function* GetLeadDetailByLeadIdApi_Response(
    response: IResponseParam,
    callBack: (wB: any) => void,
) {
    try {
        if (response && response.body) {
            // Body is the lead detail object directly (same field names).
            callBack(response.body);
        } else {
            callBack(null);
            showToast({
                type: 'error',
                text1: 'No lead details found',
                visibilityTime: 2000,
            });
        }
    } catch (error) {}
}

function* GetWorkReportForVendorApi(
    actionParam: TUserGetWorkReportForVendorParam,
) {
    try {
        // New REST API: GET /vendor/work-report?from=&to= (JWT).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${projectEnv.vendorWorkReportRestUrl}?from=${actionParam.fromDate}&to=${actionParam.toDate}`,
            method: 'GET',
            // params: {
            //     from: actionParam.fromDate,
            //     to: actionParam.toDate,
            // },
        });

        yield GetWorkReportForVendorApi_Response(
            response,
            actionParam.callBack,
        );
    } catch (error) {}
}

function* GetWorkReportForVendorApi_Response(
    response: IResponseParam,
    callBack: (data: { ongoing: number; new: number; revenue: number }) => void,
) {
    try {
        if (response && response.body) {
            // Body is the work-report array directly (same field names).
            const parsedData = response.body;

            // Analyze the response and extract ongoing, new, and revenue data
            let ongoing = 0;
            let newLeads = 0;
            let revenue = 0;

            if (Array.isArray(parsedData) && parsedData.length > 0) {
                // Iterate through the array to find data by LeadStatus
                parsedData.forEach((item: any) => {
                    const leadStatus = item.LeadStatus || '';
                    const total = parseInt(item.Total || '0', 10);
                    const totalAmt = parseFloat(item.TotalAmt || '0');

                    if (leadStatus === 'Ongoing') {
                        ongoing = total;
                    } else if (leadStatus === 'New') {
                        newLeads = total;
                    } else if (leadStatus === 'Completed') {
                        // Revenue is the TotalAmt from Completed leads
                        revenue = totalAmt;
                    }
                });
            }

            callBack({
                ongoing,
                new: newLeads,
                revenue,
            });
        } else {
            // Blank/empty body — return everything as 0.
            callBack({
                ongoing: 0,
                new: 0,
                revenue: 0,
            });
        }
    } catch (error) {
        callBack({
            ongoing: 0,
            new: 0,
            revenue: 0,
        });
    }
}
function* Check_Vendor_Compatibility_Version_Api(
    actionParam: TUserCheckVendorCompatibilityVersionParam,
) {
    try {
        // New REST API: GET /app-version (anon).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.appVersionRestUrl,
            method: 'GET',
            anon: true,
        });

        yield Check_Vendor_Compatibility_Version_Api_Response(
            response,
            actionParam.callBack,
        );
    } catch (error) {
        // Network failure — fire the callback with an empty value so the
        // caller can release its in-flight guard instead of hanging.
        actionParam.callBack('');
    }
}

function* Check_Vendor_Compatibility_Version_Api_Response(
    response: IResponseParam,
    callBack: (d: string) => void,
) {
    try {
        if (response) {
            // Endpoint returns the version value. Accept either a JSON body
            // (object/string) or a plain-text response.
            const versionInfo =
                response.body?.version ?? response.body ?? response.text;

            if (
                versionInfo !== undefined &&
                versionInfo !== null &&
                versionInfo !== ''
            ) {
                callBack(String(versionInfo));
            } else {
                showToast({
                    type: 'error',
                    text1: 'Failed to verify app version',
                    visibilityTime: 2000,
                });
                // Fire the callback with an empty value so the caller can
                // release its in-flight guard instead of hanging.
                callBack('');
            }
        } else {
            callBack('');
        }
    } catch (error) {
        callBack('');
    }
}
