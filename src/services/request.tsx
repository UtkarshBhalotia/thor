import projectEnv from './env';
import request from 'superagent';
import { navigationRef } from '../utils/rootNavigation';
import { showToast } from '../utils/common';
import { store } from '../../store';
import NetInfo from '@react-native-community/netinfo';

/**
 * Check if device has internet connectivity
 * @returns Promise<boolean> - true if connected, false otherwise
 */
async function checkInternetConnectivity(): Promise<boolean> {
    try {
        const netState = await NetInfo.fetch();

        if (!netState.isConnected) {
            showToast({
                type: 'error',
                text1: 'No Internet Connection',
                text2: 'Please check your internet connection and try again.',
                visibilityTime: 3000,
            });
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error checking internet connectivity:', error);
        return true; // Proceed with request if connectivity check fails
    }
}

export async function clientPostHandler(param: IClientRequestParam) {
    // Check internet connectivity before making request
    const isConnected = await checkInternetConnectivity();

    if (!isConnected) {
        return Promise.reject({
            body: {
                status: 'error',
                error: {
                    message: 'No Internet Connection',
                },
            },
        });
    }

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
