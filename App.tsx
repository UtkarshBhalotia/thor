/**
 * Plugins
 */
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Button,
    LogBox,
    StatusBar,
    useColorScheme,
    View,
} from 'react-native';
import { Provider } from 'react-redux';
import { MenuProvider } from 'react-native-popup-menu';

/**
 * Components
 */
import SwitchNavigator from './src/components/switchNavigator';

/**
 * Utils
 */
import { isReadyRef, navigationRef } from './src/utils/rootNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Theme from './src/assets/css/theme';
import ErrorBoundary from './src/components/ErrorBoundary';
import { store } from './store';
import Layout from './src/assets/css/layout';
import useNotificationSetup from './src/hooks/useNotificationSetup';
import { onScheduleNoti } from './src/utils/notifications';

const App = () => {
    useNotificationSetup();
    const colorScheme = useColorScheme();
    useEffect(() => {
        return () => {
            (isReadyRef as any).current = false;
        };
    }, []);

    // const handleSchedule = () => {
    //     const time = new Date(Date.now() + 10 * 1000); // 10 seconds from now
    //     scheduleNotification('Reminder', 'This is your notification!', time);
    // };

    LogBox.ignoreAllLogs();

    return (
        <View style={{ marginTop: 100 }}>
            <Button title="Schedule Notification" onPress={onScheduleNoti} />
        </View>
        // <Provider store={store}>
        //     <MenuProvider>
        //         <SafeAreaProvider>
        //             <NavigationContainer
        //                 ref={navigationRef}
        //                 fallback={<ActivityIndicator />}
        //                 onReady={() => {
        //                     (isReadyRef as any).current = true;
        //                 }}>
        //                 <GestureHandlerRootView style={[Layout.viewHeight]}>
        //                     {/* <BottomSheetModalProvider> */}
        //                     <StatusBar
        //                         hidden={false}
        //                         barStyle={'dark-content'}
        //                         backgroundColor={
        //                             colorScheme === 'dark'
        //                                 ? Theme.dark.colors.themeColor
        //                                       .backgroundColor
        //                                 : Theme.light.colors.themeColor
        //                                       .backgroundColor
        //                         }
        //                     />

        //                     <SwitchNavigator />
        //                     {/* </BottomSheetModalProvider> */}
        //                 </GestureHandlerRootView>
        //             </NavigationContainer>
        //         </SafeAreaProvider>
        //     </MenuProvider>
        // </Provider>
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
