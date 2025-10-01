import { all, spawn, call, takeEvery } from 'redux-saga/effects';
import * as login from '../../src/modules/gettingStarted/login/action';

export function* rootActions() {
    try {
        yield takeEvery('Login_Actions', login.conditionActions);
    } catch (error) {}
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
