import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import WelcomeToSOD from '../components/WelcomeToSOD';
import Login from '../modules/gettingStarted/login';
import Register from '../modules/gettingStarted/register';

const MainNavigator = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const Tab = createBottomTabNavigator();

    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

    if (showWelcomeScreen)
        return <WelcomeToSOD setShowWelcomeScreen={setShowWelcomeScreen} />;
    return (
        <Stack.Navigator>
            <Stack.Group>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default MainNavigator;
