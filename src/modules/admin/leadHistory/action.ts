import { call, put } from 'redux-saga/effects';
import { clientRestHandler } from '../../../services/request';
import projectEnv from '../../../services/env';
import { TLeadHistoryActionName, ILeadHistoryActionParam, TGetLeadHistoryParam } from './type';

export function* conditionActions<T extends TLeadHistoryActionName>(
    param: ILeadHistoryActionParam<T>
): Generator<any, any, any> {
    const { payload: { actionName, actionParam } } = param;
    switch (actionName) {
        case 'Get_Lead_History_Api':
            yield call(Get_Lead_History_Api, actionParam as TGetLeadHistoryParam);
            break;
    }
}

function* Get_Lead_History_Api(actionParam: TGetLeadHistoryParam): Generator<any, any, any> {
    try {
        yield put({ type: 'LEAD_HISTORY_LOADING' });

        // New REST API: GET /admin/lead-history?leadNo=&mobileNo= (JWT).
        const response: any = yield call(clientRestHandler, {
            url: `${projectEnv.adminLeadHistoryRestUrl}?leadNo=${encodeURIComponent(
                actionParam.data.LeadNo || '',
            )}&mobileNo=${encodeURIComponent(actionParam.data.MobileNo || '')}`,
            method: 'GET',
        });

        // Body is the history payload directly (same field names as before):
        // either the array itself or an object wrapping it in `LeadDetails`.
        const body = response?.body;
        const data = Array.isArray(body)
            ? body
            : Array.isArray(body?.LeadDetails)
            ? body.LeadDetails
            : [];

        yield put({ type: 'LEAD_HISTORY_SUCCESS', payload: data });
        if (actionParam.callBack) actionParam.callBack(data);
    } catch (error) {
        yield put({ type: 'LEAD_HISTORY_FAIL' });
        if (actionParam.callBack) actionParam.callBack([]);
    }
}
