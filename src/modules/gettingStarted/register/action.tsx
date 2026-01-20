import { call, select } from 'redux-saga/effects';
import { clientPostHandler } from '../../../services/request';
import projectEnv from '../../../services/env';
import { showToast } from '../../../utils/common';
import { RootState } from '../../../../store';

export function* conditionActions<
    T extends TUserRegisterConditionParamActionName,
>(param: IUserRegisterActionConditionParam<T>) {
    const {
        payload: { actionName, actionParam },
    } = param;
    switch (actionName) {
        case 'Get_Service_Types_Api':
            yield call(
                GetServiceTypesApi,
                actionParam as TUserGetServiceTypesParam,
            );
            break;
        case 'Get_Country_List_Api':
            yield call(
                GetCountryListApi,
                actionParam as TUserGetCountryListParam,
            );
            break;
        case 'Get_State_List_Api':
            yield call(GetStateListApi, actionParam as TUserGetStateListParam);
            break;
        case 'Get_City_List_Api':
            yield call(GetCityListApi, actionParam as TUserGetCityListParam);
            break;
        case 'Get_Vendor_Details_By_ID_Api':
            yield call(
                GetVendorDetailsByIDApi,
                actionParam as TUserGetVendorDetailsByIDParam,
            );
            break;
        case 'Vendor_Registration_Api':
            yield call(
                VendorRegistrationApi,
                actionParam as TUserVendorRegistrationParam,
            );
            break;
    }
}

function* VendorRegistrationApi(actionParam: TUserVendorRegistrationParam) {
    console.log('VendorAPI');

    try {
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.vendorRegistrationUrl,
            data: actionParam.data,
        });

        yield VendorRegistrationApi_Response(response, actionParam.callBack);
    } catch (error) { }
}

function* VendorRegistrationApi_Response(
    response: IResponseParam,
    callBack: (data: any) => void,
) {
    try {
        if (response.body.status === 'success') {
            const responseData = response.body;
            callBack(responseData);
        } else if (response.body.status === 'error') {
            callBack(response.body);
        } else {
            callBack(null);
        }
    } catch (error) {
        callBack(null);
    }
}

function* GetServiceTypesApi(actionParam: TUserGetServiceTypesParam) {
    try {
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getAllServiceTypeListUrl,
            data: {},
        });

        yield GetServiceTypesApi_Response(response, actionParam.callBack);
    } catch (error) { }
}

function* GetServiceTypesApi_Response(
    response: IResponseParam,
    callBack: (data: any[]) => void,
) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== '') {
                const parsedData = JSON.parse(responseData.d);
                callBack(parsedData);
            } else {
                callBack([]);
                showToast({
                    type: 'error',
                    text1: 'No service types found',
                    visibilityTime: 2000,
                });
            }
        }
    } catch (error) {
        callBack([]);
    }
}

function* GetCountryListApi(actionParam: TUserGetCountryListParam) {
    try {
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getAllCountryListUrl,
            data: {},
        });

        yield GetCountryListApi_Response(response, actionParam.callBack);
    } catch (error) { }
}

function* GetCountryListApi_Response(
    response: IResponseParam,
    callBack: (data: any[]) => void,
) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== '') {
                const parsedData = JSON.parse(responseData.d);
                callBack(parsedData);
            } else {
                callBack([]);
                showToast({
                    type: 'error',
                    text1: 'No country list found',
                    visibilityTime: 2000,
                });
            }
        }
    } catch (error) {
        callBack([]);
    }
}

function* GetStateListApi(actionParam: TUserGetStateListParam) {
    try {
        const dataObj = {
            CountryID: actionParam.countryId,
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getStateListUrl,
            data: dataObj,
        });

        yield GetStateListApi_Response(response, actionParam.callBack);
    } catch (error) { }
}

function* GetStateListApi_Response(
    response: IResponseParam,
    callBack: (data: any[]) => void,
) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== '') {
                const parsedData = JSON.parse(responseData.d);
                callBack(parsedData);
            } else {
                callBack([]);
                showToast({
                    type: 'error',
                    text1: 'No state list found',
                    visibilityTime: 2000,
                });
            }
        }
    } catch (error) {
        callBack([]);
    }
}

function* GetCityListApi(actionParam: TUserGetCityListParam) {
    try {
        const dataObj = {
            StateID: actionParam.stateId,
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getCityListUrl,
            data: dataObj,
        });

        yield GetCityListApi_Response(response, actionParam.callBack);
    } catch (error) { }
}

function* GetCityListApi_Response(
    response: IResponseParam,
    callBack: (data: any[]) => void,
) {
    try {
        if (response && response.body) {
            const responseData = response.body;

            if (responseData.d !== '') {
                const parsedData = JSON.parse(responseData.d);
                callBack(parsedData);
            } else {
                callBack([]);
                showToast({
                    type: 'error',
                    text1: 'No city list found',
                    visibilityTime: 2000,
                });
            }
        }
    } catch (error) {
        callBack([]);
    }
}

function* GetVendorDetailsByIDApi(actionParam: TUserGetVendorDetailsByIDParam) {
    try {
        const dataObj = {
            UserID: actionParam.UserID,
        };
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getVendorDetailsByIDUrl,
            data: dataObj,
        });

        yield GetVendorDetailsByIDApi_Response(response, actionParam.callBack);
    } catch (error) { }
}

function* GetVendorDetailsByIDApi_Response(
    response: IResponseParam,
    callBack: (data: any) => void,
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
                    text1: 'No vendor details found',
                    visibilityTime: 2000,
                });
            }
        }
    } catch (error) {
        callBack(null);
    }
}
