import { call, put } from 'redux-saga/effects';
import { clientPostHandler } from '../../../services/request';
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

        const response: any = yield call(clientPostHandler, {
            url: projectEnv.getLeadHistoryDetUrl,
            data: {
                LeadID: '',
                LeadNo: actionParam.data.LeadNo,
                MobileNo: actionParam.data.MobileNo,
            },
        });

        if (response && response.body && response.body.d) {
            const parsedData = JSON.parse(response.body.d);
            const data = (parsedData && Array.isArray(parsedData.LeadDetails)) ? parsedData.LeadDetails : [];
            yield put({ type: 'LEAD_HISTORY_SUCCESS', payload: data });
            if (actionParam.callBack) actionParam.callBack(data);
        } else {
            yield put({ type: 'LEAD_HISTORY_FAIL' });
            if (actionParam.callBack) actionParam.callBack([]);
        }
    } catch (error) {
        yield put({ type: 'LEAD_HISTORY_FAIL' });
        if (actionParam.callBack) actionParam.callBack([]);
    }
}
