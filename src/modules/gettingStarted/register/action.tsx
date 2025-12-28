import { call } from 'redux-saga/effects';
import { clientPostHandler } from '../../../services/request';
import projectEnv from '../../../services/env';
import { showToast } from '../../../utils/common';

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
    }
}

function* GetServiceTypesApi(actionParam: TUserGetServiceTypesParam) {
    try {
        const response: IResponseParam = yield call(clientPostHandler, {
            url: projectEnv.getAllServiceTypeListUrl,
            data: {},
        });

        yield GetServiceTypesApi_Response(response, actionParam.callBack);
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}
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
