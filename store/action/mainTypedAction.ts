import { AppDispatch } from '..';
import { TReportConditionParamActionName, TReportConditionParamActionParam } from '../../src/modules/report/type';
import { TPartnerListActionName, TPartnerListConditionParamActionParam } from '../../src/modules/admin/partnerList/type';
import { TUserRegisterConditionParamActionName, TUserRegisterConditionParamActionParam } from '../../src/modules/gettingStarted/register/type';
import { TUserLoginConditionParamActionName, TUserLoginConditionParamActionParam } from '../../src/modules/gettingStarted/login/type';
import { TUserDashboardConditionParamActionName, TUserDashboardConditionParamActionParam } from '../../src/modules/dashboard/type';
import { TUserBookingConditionParamActionName, TUserBookingConditionParamActionParam } from '../../src/modules/booking/type';


import { TIdVerificationConditionParamActionName, TIdVerificationConditionParamActionParam } from '../../src/modules/idVerification/type';
import { TWalletConditionParamActionName, TWalletConditionParamActionParam } from '../../src/modules/wallet/type';



export const loginActions_dispatch =
    (dispatch: AppDispatch) =>
        <T extends TUserLoginConditionParamActionName>(
            actionName: T,
            arg: TUserLoginConditionParamActionParam<T>,
        ) => {
            dispatch({
                type: 'Login_Actions',
                payload: { actionName, actionParam: arg } as {
                    actionName: T;
                    actionParam: TUserLoginConditionParamActionParam<T>;
                },
            });
        };

export const dashboardActions_dispatch =
    (dispatch: AppDispatch) =>
        <T extends TUserDashboardConditionParamActionName>(
            actionName: T,
            arg: TUserDashboardConditionParamActionParam<T>,
        ) => {
            dispatch({
                type: 'Dashboard_Actions',
                payload: { actionName, actionParam: arg } as {
                    actionName: T;
                    actionParam: TUserDashboardConditionParamActionParam<T>;
                },
            });
        };

export const walletActions_dispatch =
    (dispatch: AppDispatch) =>
        <T extends TWalletConditionParamActionName>(
            actionName: T,
            arg: TWalletConditionParamActionParam<T>,
        ) => {
            dispatch({
                type: 'Wallet_Actions',
                payload: { actionName, actionParam: arg } as {
                    actionName: T;
                    actionParam: TWalletConditionParamActionParam<T>;
                },
            });
        };

export const bookingActions_dispatch =
    (dispatch: AppDispatch) =>
        <T extends TUserBookingConditionParamActionName>(
            actionName: T,
            arg: TUserBookingConditionParamActionParam<T>,
        ) => {
            dispatch({
                type: 'Leads_Actions',
                payload: { actionName, actionParam: arg } as {
                    actionName: T;
                    actionParam: TUserBookingConditionParamActionParam<T>;
                },
            });
        };

export const registerActions_dispatch =
    (dispatch: AppDispatch) =>
        <T extends TUserRegisterConditionParamActionName>(
            actionName: T,
            arg: TUserRegisterConditionParamActionParam<T>,
        ) => {
            dispatch({
                type: 'Register_Actions',
                payload: { actionName, actionParam: arg } as {
                    actionName: T;
                    actionParam: TUserRegisterConditionParamActionParam<T>;
                },
            });
        };

export const idVerificationActions_dispatch =
    (dispatch: AppDispatch) =>
        <T extends TIdVerificationConditionParamActionName>(
            actionName: T,
            arg: TIdVerificationConditionParamActionParam<T>,
        ) => {
            dispatch({
                type: 'IdVerification_Actions',
                payload: { actionName, actionParam: arg } as {
                    actionName: T;
                    actionParam: TIdVerificationConditionParamActionParam<T>;
                },
            });
        };

export const reportActions_dispatch =
    (dispatch: AppDispatch) =>
        <T extends TReportConditionParamActionName>(
            actionName: T,
            arg: TReportConditionParamActionParam<T>,
        ) => {
            dispatch({
                type: 'Report_Actions',
                payload: { actionName, actionParam: arg } as {
                    actionName: T;
                    actionParam: TReportConditionParamActionParam<T>;
                },
            });
        };

export const partnerListActions_dispatch =
    (dispatch: AppDispatch) =>
        <T extends TPartnerListActionName>(
            actionName: T,
            arg: TPartnerListConditionParamActionParam<T>,
        ) => {
            dispatch({
                type: 'PartnerList_Actions',
                payload: { actionName, actionParam: arg } as {
                    actionName: T;
                    actionParam: TPartnerListConditionParamActionParam<T>;
                },
            });
        };
