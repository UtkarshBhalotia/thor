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

const App = () => {
    const colorScheme = useColorScheme();
    useEffect(() => {
        return () => {
            (isReadyRef as any).current = false;
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
                                hidden={false}
                                barStyle={'dark-content'}
                                backgroundColor={
                                    colorScheme === 'dark'
                                        ? Theme.dark.colors.themeColor
                                              .backgroundColor
                                        : Theme.light.colors.themeColor
                                              .backgroundColor
                                }
                            />
                            {/* <BottomSheetModalProvider> */}
                            <MainNavigator />
                            {/* </BottomSheetModalProvider> */}
                        </GestureHandlerRootView>
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
