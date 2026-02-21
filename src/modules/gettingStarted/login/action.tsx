import { call, put, select } from 'redux-saga/effects';
import { RootState } from '../../../../store';
import projectEnv from '../../../services/env';
import { clientPostHandler } from '../../../services/request';
import { showToast } from '../../../utils/common';
import { globalReducer_dispatch } from '../../../../store/reducer/mainTypedReducer';
import { setItem, STORAGE_KEYS } from '../../../utils/storage';

export function* conditionActions<T extends TUserLoginConditionParamActionName>(
    param: IUserLoginActionConditionParam<T>,
) {
    const {
        payload: { actionName, actionParam },
    } = param;
    switch (actionName) {
        case 'UserAuth_Login_Api':
            yield UserAuth_login_Api(actionParam as TUserLoginParam);
            break;
        case 'ForgotPassword_Api':
            yield ForgotPassword_Api(actionParam as TUserForgotPasswordParam);
            break;
        case 'Update_User_Password_Api':
            yield UpdateUserPassword_Api(actionParam as TUpdateUserPasswordParam);
            break;
        default:
            console.log('nothing to do at user Auth action');
    }
}

function* UserAuth_login_Api(param: TUserLoginParam) {
    try {

        const dataObj = {
            email: param.email,
            password: param.password,
            FCMTokenID: param.fcmTokenID,
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: `${projectEnv.loginUrl}`,
            data: dataObj,
        });
        console.log('response', response);
        yield UserAuth_login_Api_Response(response, param.callBack, param.errorCallback);
    } catch (error) {
        console.log('UserAuth_login_Api error', error);
        if (param.errorCallback) {
            param.errorCallback();
        }
    }
}

function* UserAuth_login_Api_Response(response: IResponseParam, callBack: any, errorCallback?: () => void) {
    try {

        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );

        if (response && response.body) {
            const responseData = response.body;

            let parsedData: any;
            try {
                parsedData = JSON.parse(responseData.d);
            } catch (e) {
                showToast({
                    type: 'error',
                    text1: responseData.d,
                    visibilityTime: 5000,
                });
                if (errorCallback) {
                    errorCallback();
                }
                return;
            }

            if (parsedData && parsedData.Table && parsedData.Table.length > 0) {
                const userData = parsedData.Table[0];

                // Extract specific user information
                const userInfo = {
                    userId: userData.UserID,
                    name: userData.Name,
                    email: userData.EmailID,
                    mobile: userData.MobileNo,
                    companyName: userData.CompanyName,
                    gstNo: userData.GstNo,
                    userType: userData.UserType,
                    stateId: userData.StateID,
                    isActive: userData.IsActive,
                    fcmToken: userData.FCMTokenID,
                    minRechargeAmount: userData.MinRechargeAmt,
                    profileLocked: userData.ProfileLocked,
                    validateGST: userData.ValidateGST,
                };

                if (userInfo.userType === 'A') {
                    showToast({
                        type: 'error',
                        text1: 'Admin Login Not Allowed',
                        visibilityTime: 5000,
                    });
                    if (errorCallback) {
                        errorCallback();
                    }
                    return;
                }

                // showToast({
                //     type: 'success',
                //     text1: 'Login Successfully',
                //     visibilityTime: 2000,
                // });

                yield put({
                    type: 'GLOBAL_STATE_MUTATE',
                    value: userInfo,
                });

                // Save user info to AsyncStorage for persistence
                yield setItem(STORAGE_KEYS.USER_INFO, userInfo);

                callBack();
            } else {
                showToast({
                    type: 'error',
                    text1: 'No user data found',
                    visibilityTime: 2000,
                });
                if (errorCallback) {
                    errorCallback();
                }
            }
        } else {
            showToast({
                type: 'error',
                text1: 'No response from server',
                visibilityTime: 2000,
            });
            if (errorCallback) {
                errorCallback();
            }
        }
    } catch (error) {
        console.log('UserAuth_login_Api_Response error', error);
        if (errorCallback) {
            errorCallback();
        }
    }
}

function* ForgotPassword_Api(param: TUserForgotPasswordParam) {
    try {
        const dataObj = {
            MobileNo: param.MobileNo,
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: `${projectEnv.forgotPasswordUrl}`,
            data: dataObj,
        });
        yield ForgotPassword_Api_Response(response, param.callBack);
    } catch (error) {
        console.log('ForgotPassword_Api error', error);
    }
}

function* ForgotPassword_Api_Response(response: IResponseParam, callBack?: () => void) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d) {
                const parsedData = typeof responseData.d === 'string'
                    ? JSON.parse(responseData.d)
                    : responseData.d;

                if (parsedData.status === true || parsedData.Status === true || parsedData.d === 'Success') {
                    showToast({
                        type: 'success',
                        text1: 'Password has been sent to your registered phone number.',
                        visibilityTime: 2000,
                    });

                    if (callBack) {
                        callBack();
                    }
                } else {
                    const errorMessage = parsedData.message || parsedData.Message || 'Something went wrong. Please try again.';
                    showToast({
                        type: 'error',
                        text1: errorMessage,
                        visibilityTime: 2000,
                    });
                }
            } else {
                showToast({
                    type: 'error',
                    text1: 'Something went wrong. Please try again.',
                    visibilityTime: 2000,
                });
            }
        }
    } catch (error) {
        console.log('ForgotPassword_Api_Response error', error);
        showToast({
            type: 'error',
            text1: 'Something went wrong. Please try again.',
            visibilityTime: 2000,
        });
    }
}

function* UpdateUserPassword_Api(param: TUpdateUserPasswordParam) {
    try {
        const dataObj = {
            OldPassword: param.oldPassword,
            NewPassword: param.newPassword,
            UserID: param.userId,
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: `${projectEnv.UpdateUserPasswordUrl}`,
            data: dataObj,
        });
        yield UpdateUserPassword_Api_Response(response, param.callBack);
    } catch (error) {
        console.log('UpdateUserPassword_Api error', error);
        param.callBack(false, 'Something went wrong');
    }
}

function* UpdateUserPassword_Api_Response(
    response: IResponseParam,
    callBack: (success: boolean, message: string) => void,
) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d) {
                let parsedData = responseData.d;
                if (parsedData == '1') {
                    callBack(true, parsedData);
                } else {
                    callBack(false, parsedData);
                }
            } else {
                callBack(false, 'Invalid server response');
            }
        } else {
            callBack(false, 'No response from server');
        }
    } catch (error) {
        console.log('UpdateUserPassword_Api_Response error', error);
        callBack(false, 'Error processing response');
    }
}
