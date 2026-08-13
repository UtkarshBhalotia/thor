import { call } from 'redux-saga/effects';
import { clientRestHandler } from '../../../services/request';
import projectEnv from '../../../services/env';
import { showToast } from '../../../utils/common';
import { IResponseParam } from '../login/type';
import {
    TUserRegisterConditionParamActionName,
    IUserRegisterActionConditionParam,
    TUserGetServiceTypesParam,
    TUserGetCountryListParam,
    TUserGetStateListParam,
    TUserGetCityListParam,
    TUserGetVendorDetailsByIDParam,
    TUserVendorRegistrationParam,
    TUserUpdateVendorProfileParam,
    TUserMapCityListByVendorParam,
} from './type';

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
        case 'Update_Vendor_Profile_Api':
            yield call(
                UpdateVendorProfileApi,
                actionParam as TUserUpdateVendorProfileParam,
            );
            break;
        case 'Map_City_List_By_Vendor_Api':
            yield call(
                MapCityListByVendorApi,
                actionParam as TUserMapCityListByVendorParam,
            );
            break;
    }
}

function* VendorRegistrationApi(actionParam: TUserVendorRegistrationParam) {
    try {
        // New REST API: POST /vendor-registration (anon). Success = 2xx;
        // duplicate email/mobile rejects with 409.
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorRegistrationRestUrl,
            method: 'POST',
            anon: true,
            data: actionParam.data,
        });

        yield VendorRegistrationApi_Response(response, actionParam.callBack);
    } catch (error: any) {
        // clientRestHandler rejects on non-2xx (409 = duplicate email/mobile).
        console.log('VendorRegistrationApi error', error);
        const msg =
            error?.status === 409
                ? error?.body?.message ||
                  error?.body?.error?.message ||
                  'This email or mobile number is already registered.'
                : error?.body?.message ||
                  error?.body?.error?.message ||
                  'Registration failed. Please try again later.';
        actionParam.callBack({ status: 'error', msg });
    }
}

function* VendorRegistrationApi_Response(
    response: IResponseParam,
    callBack: (data: any) => void,
) {
    try {
        // Reaching here means a 2xx response — registration succeeded.
        const body = response?.body || {};
        callBack({
            status: 'success',
            msg: body.message || 'Registration successful',
            ...body,
        });
    } catch (error) {
        callBack({
            status: 'error',
            msg: 'Registration failed. Please try again later.',
        });
    }
}

function* GetServiceTypesApi(actionParam: TUserGetServiceTypesParam) {
    try {
        // New REST API: GET /service-types (anon). Body is the array directly.
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.serviceTypesRestUrl,
            method: 'GET',
            anon: true,
        });

        yield GetServiceTypesApi_Response(response, actionParam.callBack);
    } catch (error) {
        actionParam.callBack([]);
    }
}

function* GetServiceTypesApi_Response(
    response: IResponseParam,
    callBack: (data: any[]) => void,
) {
    try {
        if (response && Array.isArray(response.body)) {
            callBack(response.body);
        } else {
            callBack([]);
            showToast({
                type: 'error',
                text1: 'No service types found',
                visibilityTime: 2000,
            });
        }
    } catch (error) {
        callBack([]);
    }
}

function* GetCountryListApi(actionParam: TUserGetCountryListParam) {
    try {
        // New REST API: GET /countries (anon). Body is the array directly.
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.countriesRestUrl,
            method: 'GET',
            anon: true,
        });

        yield GetCountryListApi_Response(response, actionParam.callBack);
    } catch (error) {
        actionParam.callBack([]);
    }
}

function* GetCountryListApi_Response(
    response: IResponseParam,
    callBack: (data: any[]) => void,
) {
    try {
        if (response && Array.isArray(response.body)) {
            callBack(response.body);
        } else {
            callBack([]);
            showToast({
                type: 'error',
                text1: 'No country list found',
                visibilityTime: 2000,
            });
        }
    } catch (error) {
        callBack([]);
    }
}

function* GetStateListApi(actionParam: TUserGetStateListParam) {
    try {
        // New REST API: GET /states?countryId= (anon). Body is the array directly.
        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${projectEnv.statesRestUrl}?countryId=${actionParam.countryId}`,
            method: 'GET',
            anon: true,
        });

        yield GetStateListApi_Response(response, actionParam.callBack);
    } catch (error) {
        actionParam.callBack([]);
    }
}

function* GetStateListApi_Response(
    response: IResponseParam,
    callBack: (data: any[]) => void,
) {
    try {
        if (response && Array.isArray(response.body)) {
            callBack(response.body);
        } else {
            callBack([]);
            showToast({
                type: 'error',
                text1: 'No state list found',
                visibilityTime: 2000,
            });
        }
    } catch (error) {
        callBack([]);
    }
}

function* GetCityListApi(actionParam: TUserGetCityListParam) {
    try {
        // New REST API: GET /cities?stateId= (anon). Body is the array directly.
        const response: IResponseParam = yield call(clientRestHandler, {
            url: `${projectEnv.citiesRestUrl}?stateId=${actionParam.stateId}`,
            method: 'GET',
            anon: true,
        });

        yield GetCityListApi_Response(response, actionParam.callBack);
    } catch (error) {
        actionParam.callBack([]);
    }
}

function* GetCityListApi_Response(
    response: IResponseParam,
    callBack: (data: any[]) => void,
) {
    try {
        if (response && Array.isArray(response.body)) {
            callBack(response.body);
        } else {
            callBack([]);
            showToast({
                type: 'error',
                text1: 'No city list found',
                visibilityTime: 2000,
            });
        }
    } catch (error) {
        callBack([]);
    }
}

function* GetVendorDetailsByIDApi(actionParam: TUserGetVendorDetailsByIDParam) {
    try {
        // New REST API: GET /vendor/profile (JWT; user derived from token, so
        // UserID is no longer sent).
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorProfileRestUrl,
            method: 'GET',
        });

        yield GetVendorDetailsByIDApi_Response(response, actionParam.callBack);
    } catch (error) {
        showToast({
            type: 'error',
            text1: 'Failed to fetch profile details',
            visibilityTime: 2000,
        });
        actionParam.callBack(null);
    }
}

function* GetVendorDetailsByIDApi_Response(
    response: IResponseParam,
    callBack: (data: any) => void,
) {
    try {
        const body = response?.body;
        // Body is the profile payload directly. Accept either a single object
        // or a one-element array and hand the caller a plain object.
        const details = Array.isArray(body) ? body[0] : body;

        if (details) {
            callBack(details);
        } else {
            callBack(null);
            showToast({
                type: 'error',
                text1: 'No vendor details found',
                visibilityTime: 2000,
            });
        }
    } catch (error) {
        callBack(null);
    }
}

function* UpdateVendorProfileApi(actionParam: TUserUpdateVendorProfileParam) {
    try {
        // New REST API: PUT /vendor/profile (JWT; user derived from token).
        const dataObj = {
            companyName: actionParam.companyName,
            gstNo: actionParam.gstNo,
            mobileNo: actionParam.mobileNo,
            address: actionParam.address,
        };
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorProfileRestUrl,
            method: 'PUT',
            data: dataObj,
        });

        // clientRestHandler resolves only on 2xx.
        actionParam.callBack(
            true,
            response?.body?.message || 'Profile updated successfully',
        );
    } catch (error: any) {
        const message =
            error?.body?.message ||
            error?.body?.error?.message ||
            'Failed to update profile';
        showToast({
            type: 'error',
            text1: message,
            visibilityTime: 2000,
        });
        actionParam.callBack(false, message);
    }
}

function* MapCityListByVendorApi(actionParam: TUserMapCityListByVendorParam) {
    try {
        // New REST API: POST /vendor/service-locations (JWT). The mapping is now
        // a real JSON array instead of the old stringified `jsonString` param.
        const dataObj = {
            locations: actionParam.locations,
        };
        const response: IResponseParam = yield call(clientRestHandler, {
            url: projectEnv.vendorServiceLocationsRestUrl,
            method: 'POST',
            data: dataObj,
        });

        // clientRestHandler resolves only on 2xx.
        actionParam.callBack(
            true,
            response?.body?.message || 'Service locations updated successfully',
        );
    } catch (error: any) {
        const message =
            error?.body?.message ||
            error?.body?.error?.message ||
            'Failed to update service locations';
        actionParam.callBack(false, message);
    }
}
