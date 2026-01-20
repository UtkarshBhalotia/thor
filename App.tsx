/**
 * Plugins
 */
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    LogBox,
    StatusBar,
    useColorScheme,
} from 'react-native';
import { Provider } from 'react-redux';
import { MenuProvider } from 'react-native-popup-menu';
/**
 * Utils
 */
import { isReadyRef, navigationRef } from './src/utils/rootNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ErrorBoundary from './src/components/ErrorBoundary';
import { store } from './store';
import MainNavigator from './src/navigations/MainNavigator';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Theme from './src/assets/css/theme';
import Layout from './src/assets/css/layout';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Toast, { ToastConfig } from 'react-native-toast-message';
import ErrorToast from './src/components/ErrorToast';
import { notificationListener, requestUserPermission } from './src/utils/FirebaseNotifications';

const App = () => {
    const colorScheme = useColorScheme();
    const toastConfig: ToastConfig = {
        mazuError: (props) => <ErrorToast {...props} />,
    };
    useEffect(() => {
        requestUserPermission();
        const unsubscribe = notificationListener();
        return () => {
            (isReadyRef as any).current = false;
            unsubscribe();
        };
    }, []);

    LogBox.ignoreAllLogs();

    return (
        <Provider store={store}>
            <MenuProvider>
                <SafeAreaProvider>
                    <NavigationContainer
                        ref={navigationRef}
                        fallback={<ActivityIndicator />}
                        onReady={() => {
                            (isReadyRef as any).current = true;
                        }}>
                        <GestureHandlerRootView style={[Layout.viewHeight]}>
                            <StatusBar
                                translucent={true}
                                backgroundColor={'transparent'}
                                barStyle={'dark-content'}
                            />
                            <KeyboardProvider>
                                <BottomSheetModalProvider>
                                    <MainNavigator />
                                </BottomSheetModalProvider>
                            </KeyboardProvider>
                        </GestureHandlerRootView>
                        <Toast config={toastConfig} />
                    </NavigationContainer>
                </SafeAreaProvider>
            </MenuProvider>
        </Provider>
    );
};

const MainRender = () => {
    return (
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
};

const MyApp = MainRender;

export default MyApp;
