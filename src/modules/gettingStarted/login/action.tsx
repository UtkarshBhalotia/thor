import { call, select } from 'redux-saga/effects';
import { RootState } from '../../../../store';
import projectEnv from '../../../services/env';
import { clientPostHandler } from '../../../services/request';
import { showToast } from '../../../utils/common';

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
        default:
            console.log('nothing to do at user Auth action');
    }
}

function* UserAuth_login_Api(param: TUserLoginParam) {
    try {
        const GlobalState: IGlobalInitialState = yield select(
            (state: RootState) => state.globalState,
        );
        const dataObj = {
            email: param.email,
            password: param.password,
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: `${projectEnv.loginUrl}`,
            data: dataObj,
        });
        console.log('response', response);
        yield UserAuth_login_Api_Response(response, param.callBack);
    } catch (error) {
        console.log('UserAuth_login_Api error', error);
    }
}

function* UserAuth_login_Api_Response(response: IResponseParam, callBack: any) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== 'Wrong Username or Password') {
                const parsedData = JSON.parse(responseData.d);
                console.log(parsedData, 'parsedData');

                if (parsedData.Table && parsedData.Table.length > 0) {
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
                        isActive: userData.IsActive,
                        fcmToken: userData.FCMTokenID,
                        minRechargeAmount: userData.MinRechargeAmt,
                        profileLocked: userData.ProfileLocked,
                        validateGST: userData.ValidateGST,
                    };

                    callBack();

                    showToast({
                        type: 'success',
                        text1: 'Login Successfully',
                        visibilityTime: 2000,
                    });



                    console.log('Extracted User Info:', userInfo);
                } else {
                    console.log('No user data found');
                }
            } else {
                showToast({
                    type: 'error',
                    text1: 'Wrong Username or Password',
                    visibilityTime: 2000,
                });
            }
        }
    } catch (error) {
        console.log('UserAuth_login_Api_Response error', error);
    }
}
