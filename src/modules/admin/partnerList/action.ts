import { call, put } from 'redux-saga/effects';
import { clientRestHandler } from '../../../services/request';
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

        // New REST API: GET /admin/partners?stateId=&cityId=&serviceType= (JWT).
        const response: any = yield call(clientRestHandler, {
            url: `${projectEnv.adminPartnersRestUrl}?stateId=${actionParam.data.StateID}&cityId=${actionParam.data.CityID}&serviceType=${actionParam.data.ServiceType}`,
            method: 'GET',
        });

        // Body is the partner array directly (same field names as before).
        const body = response?.body;
        const data = Array.isArray(body) ? body : body?.Table || [];

        yield put({ type: 'PARTNER_LIST_SUCCESS', payload: data });
        if (actionParam.callBack) actionParam.callBack(data);
    } catch (error) {
        yield put({ type: 'PARTNER_LIST_FAIL' });
        if (actionParam.callBack) actionParam.callBack([]);
    }
}
