import React, { useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { splashStyles } from '../assets/css/splashStyles';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
    WelcomeToSOD: { setShowWelcomeScreen: (show: boolean) => void };
    Login: undefined;
    Register: undefined;
};

const WelcomeToSOD = ({
    setShowWelcomeScreen,
}: {
    setShowWelcomeScreen: (show: boolean) => void;
}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    useEffect(() => {
        setTimeout(() => {
            setShowWelcomeScreen(false);
            navigation.navigate('Login');
        }, 1500);
    }, []);
    return (
        <View style={splashStyles.container}>
            <Text>Welcome to SOD</Text>
        </View>
    );
};

export default WelcomeToSOD;
