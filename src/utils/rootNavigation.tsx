/**
 * Plugins
 */
import * as React from 'react';
import {
    createNavigationContainerRef,
    NavigationContainerRef,
    StackActions,
} from '@react-navigation/native';

export const isReadyRef = React.createRef<boolean>();

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string, params?: object) {
    if (isReadyRef.current && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current.navigate(name, params);
    } else {
        // You can decide what to do if the app hasn't mounted
        // You can ignore this, or add these actions to a queue you can call later
    }
}

export function push(name: string, params: any) {
    if (isReadyRef.current && navigationRef.current) {
        // Perform navigation if the app has mounted
        navigationRef.current.dispatch(StackActions.push(name, params));
    } else {
        // You can decide what to do if the app hasn't mounted
        // You can ignore this, or add these actions to a queue you can call later
    }
}

export function replace(name: string, params: any) {
    if (isReadyRef.current && navigationRef.current) {
        // Perform navigation if the app has mounted
        if (
            navigationRef.current.getCurrentRoute()?.name === 'Dashboard' ||
            navigationRef.current.getCurrentRoute()?.name === 'UnsavedVch'
        ) {
            navigationRef.current.navigate(name, params);
        } else {
            navigationRef.current.dispatch(StackActions.replace(name, params));
        }
    } else {
        // You can decide what to do if the app hasn't mounted
        // You can ignore this, or add these actions to a queue you can call later
    }
}

export function menu(name: string, params?: any) {
    if (isReadyRef.current && navigationRef.current) {
        if (navigationRef.current.getCurrentRoute()?.name !== name) {
            navigationRef.current.reset({
                index: 1,
                routes: [{ name: 'Dashboard' }, { name, params }],
            });
        }
    }
}

export function goBack() {
    if (
        navigationRef.current?.getCurrentRoute()?.name === 'vchAppRejList' ||
        navigationRef.current?.getCurrentRoute()?.name === 'masterAppRejList'
    ) {
        navigationRef.current.navigate('Dashboard');
    } else {
        navigationRef.current?.goBack();
    }
}
