import { AppDispatch } from '..';

export const loginActions_dispatch =
    (dispatch: AppDispatch) =>
        <T extends TLoginConditionParamActionName>(
            actionName: T,
            arg: TLoginConditionParamActionParam<T>,
        ) => {
            dispatch({
                type: 'Login_Actions',
                payload: { actionName, actionParam: arg } as {
                    actionName: T;
                    actionParam: TLoginConditionParamActionParam<T>;
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
