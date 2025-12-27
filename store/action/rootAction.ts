import { all, spawn, call, takeEvery } from 'redux-saga/effects';
import * as login from '../../src/modules/gettingStarted/login/action';
import * as dashboard from '../../src/modules/dashboard/action';
import * as wallet from '../../src/modules/wallet/action';
import * as booking from '../../src/modules/booking/action';

export function* rootActions() {
    try {
        yield takeEvery('Login_Actions', login.conditionActions);
        yield takeEvery('Dashboard_Actions', dashboard.conditionActions);
        yield takeEvery('Wallet_Actions', wallet.conditionActions);
        yield takeEvery('Leads_Actions', booking.conditionActions);
    } catch (error) { }
}

export function* mySaga() {
    const sagas = [rootActions];

    yield all(
        sagas.map((saga) =>
            spawn(function* () {
                while (true) {
                    try {
                        yield call(saga);
                        break; // exit loop if saga ends gracefully
                    } catch (e) {
                        console.log('Saga crashed, restarting:', saga.name, e);
                    }
                }
            }),
        ),
    );
}
