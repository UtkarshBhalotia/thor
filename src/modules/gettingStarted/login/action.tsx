import { call, put, select } from 'redux-saga/effects';
import { RootState } from '../../../../store';
import projectEnv from '../../../services/env';
import { clientRestHandler } from '../../../services/request';
import { showToast } from '../../../utils/common';
import { globalReducer_dispatch } from '../../../../store/reducer/mainTypedReducer';
import { setItem, STORAGE_KEYS } from '../../../utils/storage';
import {
    TUserLoginConditionParamActionName,
    IUserLoginActionConditionParam,
    TUserLoginParam,
    TUserForgotPasswordParam,
    TUpdateUserPasswordParam,
    IResponseParam,
} from './type';

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
            yield UpdateUserPassword_Api(
                actionParam as TUpdateUserPasswordParam,
            );
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
        // New REST API: POST /api/mobile/partner/login (anon, JWT in response).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${projectEnv.loginUrl}`,
            method: 'POST',
            anon: true,
            data: dataObj,
        });

        yield UserAuth_login_Api_Response(
            response,
            param.callBack,
            param.errorCallback,
        );
    } catch (error: any) {
        // clientRestHandler rejects on non-2xx. 401 = invalid credentials.
        console.log('UserAuth_login_Api error', error);
        const message =
            error?.status === 401
                ? error?.body?.message ||
                  error?.body?.error?.message ||
                  'Invalid email or password'
                : error?.body?.error?.message ||
                  'Something went wrong. Please try again.';
        showToast({
            type: 'error',
            text1: message,
            visibilityTime: 3000,
        });
        if (param.errorCallback) {
            param.errorCallback();
        }
    }
}

function* UserAuth_login_Api_Response(
    response: IResponseParam,
    callBack: any,
    errorCallback?: () => void,
) {
    try {
        const body = response?.body;

        if (body && body.token && body.user) {
            const u = body.user;

            // Map the new REST user object onto the app's global state shape.
            const userInfo = {
                userId: u.userId,
                name: u.name,
                email: u.emailId,
                mobile: u.mobileNo,
                altMobile: u.altMobileNo,
                address: u.address,
                companyName: u.companyName,
                gstNo: u.gstNo,
                userType: u.userType,
                countryId: u.countryId,
                stateId: u.stateId,
                cityId: u.cityId,
                roleId: u.roleId,
                isActive: u.isActive,
            };

            // Persist the JWT for Authorization headers on subsequent calls.
            yield setItem(STORAGE_KEYS.AUTH_TOKEN, body.token);

            yield put({
                type: 'GLOBAL_STATE_MUTATE',
                value: userInfo,
            });

            // Save user info to AsyncStorage for persistence across app launches.
            yield setItem(STORAGE_KEYS.USER_INFO, userInfo);

            callBack(userInfo);
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
            mobileNo: param.MobileNo,
        };
        // New REST API: POST /forgot-password (anon). Success = 2xx; SMS is sent
        // to the registered mobile. Failures reject with a real HTTP status.
        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${projectEnv.forgotPasswordRestUrl}`,
            method: 'POST',
            anon: true,
            data: dataObj,
        });
        yield ForgotPassword_Api_Response(response, param.callBack);
    } catch (error: any) {
        // clientRestHandler rejects on non-2xx.
        console.log('ForgotPassword_Api error', error);
        const message =
            error?.status === 404
                ? error?.body?.message ||
                  error?.body?.error?.message ||
                  'This mobile number is not registered.'
                : error?.body?.message ||
                  error?.body?.error?.message ||
                  'Something went wrong. Please try again.';
        showToast({
            type: 'error',
            text1: message,
            visibilityTime: 3000,
        });
    }
}

function* ForgotPassword_Api_Response(
    response: IResponseParam,
    callBack?: () => void,
) {
    try {
        // Reaching here means the request succeeded (2xx). The new endpoint
        // sends the password/reset SMS to the registered mobile.
        showToast({
            type: 'success',
            text1:
                response?.body?.message ||
                'Password has been sent to your registered phone number.',
            visibilityTime: 2000,
        });

        if (callBack) {
            callBack();
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
        // New REST API: POST /vendor/change-password (JWT; user from token).
        const dataObj = {
            oldPassword: param.oldPassword,
            newPassword: param.newPassword,
        };
        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${projectEnv.changePasswordRestUrl}`,
            method: 'POST',
            data: dataObj,
            // A 401 here is "wrong current password", not an expired session.
            ignoreUnauthorized: true,
        });

        // clientRestHandler resolves only on 2xx.
        param.callBack(
            true,
            response?.body?.message || 'Password updated successfully',
        );
    } catch (error: any) {
        // 401 here means the current password was wrong — the request itself is
        // authenticated, so it must not be treated as a session expiry message.
        console.log('UpdateUserPassword_Api error', error);
        const message =
            error?.status === 401
                ? error?.body?.message ||
                  error?.body?.error?.message ||
                  'Current password is incorrect'
                : error?.body?.message ||
                  error?.body?.error?.message ||
                  'Something went wrong';
        param.callBack(false, message);
    }
}
