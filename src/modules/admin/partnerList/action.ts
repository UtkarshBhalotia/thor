import { call, put } from 'redux-saga/effects';
import { clientPostHandler } from '../../../services/request';
import projectEnv from '../../../services/env';
import { TPartnerListActionName, IPartnerListActionParam, TGetUserListByCityStateParam } from './type';

export function* conditionActions<T extends TPartnerListActionName>(
    param: IPartnerListActionParam<T>
): Generator<any, any, any> {
    const { payload: { actionName, actionParam } } = param;
    switch (actionName) {
        case 'GET_USER_LIST_BY_CITY_STATE_API':
            yield call(GetUserListByCityStateApi, actionParam as TGetUserListByCityStateParam);
            break;
    }
}

function* GetUserListByCityStateApi(actionParam: TGetUserListByCityStateParam): Generator<any, any, any> {
    try {
        yield put({ type: 'PARTNER_LIST_LOADING' });

        const response: any = yield call(clientPostHandler, {
            url: projectEnv.getUserListByCityAndStateUrl,
            data: {
                StateID: actionParam.data.StateID,
                CityID: actionParam.data.CityID,
                ServiceType: actionParam.data.ServiceType,
            },
        });

        if (response && response.body && response.body.d) {
            const parsedData = JSON.parse(response.body.d);
            // Assuming parsedData is the array or contains the array under a key like 'Table'
            const data = (parsedData && Array.isArray(parsedData)) ? parsedData : (parsedData.Table || []);
            yield put({ type: 'PARTNER_LIST_SUCCESS', payload: data });
            if (actionParam.callBack) actionParam.callBack(data);
        } else {
            yield put({ type: 'PARTNER_LIST_FAIL' });
            if (actionParam.callBack) actionParam.callBack([]);
        }
    } catch (error) {
        yield put({ type: 'PARTNER_LIST_FAIL' });
        if (actionParam.callBack) actionParam.callBack([]);
    }
}
