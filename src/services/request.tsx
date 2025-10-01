import projectEnv from './env';
import request from 'superagent';
import { navigationRef } from '../utils/rootNavigation';
import { showToast } from '../utils/common';
import { store } from '../../store';

export function clientPostHandler(param: IClientRequestParam) {
    console.log('clientPostHandler', {
        param,
        madeUrl: param.url,
    });

    const DefaultTime = 30000;
    const time =
        typeof param?.timeout === 'number' ? param?.timeout : DefaultTime;
    const req = request
        .post(param.url)
        .set('Content-Type', 'application/json; charset=UTF-8')
        .timeout({ response: time, deadline: time })
        .send(param.data)
        .then((res: any) => {
            console.log('clientPostHandler response', res);
            if (res.statusCode === 205 || res.statusCode === 440) {
                setTimeout(() => {
                    store.dispatch({ type: 'GLOBAL_RESET' });
                }, 500);
                return null;
                //} else if (checkForUpgrade(res)) {
                // navigateToUpgrade();
            } else {
                return res;
            }
        })
        .catch((err) => {
            if (err.status === 401) {
                let errorMessage = '';
                if (err?.message) {
                    const data = JSON.parse(err.message);
                    errorMessage = data?.error?.message ?? '';
                }
                showToast({
                    type: 'error',
                    text1: errorMessage,
                    visibilityTime: 2000,
                });
                setTimeout(() => {
                    store.dispatch({ type: 'GLOBAL_RESET' });
                }, 500);
                throw err;
            } else if (err?.timeout) {
                return new Promise((reject) => {
                    const response = {
                        body: {
                            status: false,
                            error: {
                                message: 'Request Timeout, Try Again Later.',
                            },
                        },
                    };
                    reject(response);
                });
            }
            return new Promise((reject) => {
                const response = {
                    body: {
                        status: false,
                        error: {
                            message:
                                'Something Went Wrong. Please Try Again Later.',
                        },
                    },
                };
                reject(response);
            });
        });
    return req;
}
