import React, { useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { splashStyles } from '../assets/css/splashStyles';

type RootStackParamList = {
    WelcomeToSOD: { setShowWelcomeScreen: (show: boolean) => void };
    Login: undefined;
    Onboarding: undefined;
    Register: undefined;
};

const WelcomeToSOD = ({
    setShowWelcomeScreen,
}: {
    setShowWelcomeScreen: (show: boolean) => void;
}) => {
    useEffect(() => {
        setTimeout(() => {
            setShowWelcomeScreen(false);
        }, 1500);
    }, []);
    return (
        <View style={splashStyles.container}>
            <Text>Welcome to SOD</Text>
        </View>
    );
};

export default WelcomeToSOD;
