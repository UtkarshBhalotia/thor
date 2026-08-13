import projectEnv from './env';
import request from 'superagent';
import { navigationRef } from '../utils/rootNavigation';
import { showToast } from '../utils/common';
import { store } from '../../store';
import NetInfo from '@react-native-community/netinfo';
import { getItem, STORAGE_KEYS } from '../utils/storage';

/**
 * Request handler for the new REST API (JWT based, real HTTP status codes).
 *
 * Success  -> resolves { status, body } (body is plain JSON, no `.d` unwrap).
 * Failure  -> rejects  { status, body } so the caller can branch on status
 *             (e.g. 401 = bad credentials / session expired, 409 = duplicate).
 *
 * A JWT from AsyncStorage is attached as `Authorization: Bearer <token>` unless
 * `anon` is set. A 401 on a non-anon call triggers the global logout/reset.
 */
export async function clientRestHandler(param: IClientRequestParam) {
    const DefaultTime = 30000;
    const time =
        typeof param?.timeout === 'number' ? param?.timeout : DefaultTime;
    const method = (param.method || 'GET').toLowerCase();

    let req = (request as any)
        [method](param.url)
        .set('Content-Type', 'application/json; charset=UTF-8')
        .timeout({ response: time, deadline: time });

    if (!param.anon) {
        const token =
            param.accessToken || (await getItem(STORAGE_KEYS.AUTH_TOKEN));
        if (token) {
            req = req.set('Authorization', `Bearer ${token}`);
        }
    }

    if (param.params) {
        req = req.query(param.params);
    }

    if (param.data && method !== 'get') {
        req = req.send(param.data);
    }

    console.log('clientRestHandler request', {
        method: method.toUpperCase(),
        url: param.url,
        params: param.params,
        data: param.data,
        anon: !!param.anon,
        // Base64 document uploads can blow past the server's request-size
        // limit, which comes back as a 500 with an empty body.
        bodyKB: param.data
            ? Math.round(JSON.stringify(param.data).length / 1024)
            : 0,
    });

    return req
        .then((res: any) => {
            console.log('clientRestHandler response', {
                url: param.url,
                status: res?.status,
                body: res?.body,
                text: res?.text,
            });
            // `text` is included for endpoints that reply with a plain string
            // (e.g. /app-version) rather than a JSON object.
            return { status: res.status, body: res.body, text: res.text };
        })
        .catch((err: any) => {
            const status = err?.status;
            const body = err?.response?.body;

            console.log('clientRestHandler error', {
                url: param.url,
                status,
                body,
                message: err?.message,
                timeout: err?.timeout,
            });

            // Session expired on an authenticated call -> force logout.
            // For anon calls (login/register/forgot-password) a 401 just means
            // bad credentials, so leave it to the caller. `ignoreUnauthorized`
            // does the same for authenticated calls where 401 is a business
            // outcome rather than an expired session (e.g. change-password).
            if (status === 401 && !param.anon && !param.ignoreUnauthorized) {
                setTimeout(() => {
                    store.dispatch({ type: 'GLOBAL_RESET' });
                }, 500);
            }

            if (err?.timeout) {
                return Promise.reject({
                    status: 0,
                    body: {
                        error: { message: 'Request Timeout, Try Again Later.' },
                    },
                });
            }

            return Promise.reject({ status, body });
        });
}

/**
 * Check if device has internet connectivity
 * @returns Promise<boolean> - true if connected, false otherwise
 */
// async function checkInternetConnectivity(): Promise<boolean> {
//     try {
//         const netState = await NetInfo.fetch();

//         if (!netState.isConnected) {
//             showToast({
//                 type: 'error',
//                 text1: 'No Internet Connection',
//                 text2: 'Please check your internet connection and try again.',
//                 visibilityTime: 3000,
//             });
//             return false;
//         }

//         return true;
//     } catch (error) {
//         console.error('Error checking internet connectivity:', error);
//         return true; // Proceed with request if connectivity check fails
//     }
// }

export async function clientPostHandler(param: IClientRequestParam) {
    // Check internet connectivity before making request
    // const isConnected = await checkInternetConnectivity();

    // if (!isConnected) {
    //     return Promise.reject({
    //         body: {
    //             status: 'error',
    //             error: {
    //                 message: 'No Internet Connection',
    //             },
    //         },
    //     });
    // }

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
