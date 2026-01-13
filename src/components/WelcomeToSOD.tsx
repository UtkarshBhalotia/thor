import React, { useEffect, useRef } from 'react';
import { View, Text, StatusBar, Animated, Easing, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { splashStyles } from '../assets/css/splashStyles';

const LauncherLogo = require('../assets/img/new_launcher.png');

type WelcomeToSODProps = {
    setShowWelcomeScreen: (show: boolean) => void;
};

const WelcomeToSOD = ({ setShowWelcomeScreen }: WelcomeToSODProps) => {
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const textTranslateY = useRef(new Animated.Value(20)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const loaderWidth = useRef(new Animated.Value(0)).current;
    const glowScale = useRef(new Animated.Value(0.8)).current;
    const glowOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Glow pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(glowScale, {
                        toValue: 1.2,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowOpacity, {
                        toValue: 0.6,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(glowScale, {
                        toValue: 0.8,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowOpacity, {
                        toValue: 0.3,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        ).start();

        // Main entrance animations
        Animated.sequence([
            // Logo entrance
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            // Brand name entrance
            Animated.parallel([
                Animated.timing(textOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(textTranslateY, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]),
            // Tagline entrance
            Animated.timing(taglineOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Loader animation
        Animated.timing(loaderWidth, {
            toValue: 180,
            duration: 2200,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: false,
        }).start();

        //   Navigate after splash
        const timer = setTimeout(() => {
            setShowWelcomeScreen(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient
            colors={['#6B46C1', '#9333EA', '#4C1D95']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={splashStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6B46C1" />

            {/* Background decorative circles */}
            <View style={splashStyles.backgroundCircle1} />
            <View style={splashStyles.backgroundCircle2} />
            <View style={splashStyles.backgroundCircle3} />

            {/* Glow effect behind logo */}
            <Animated.View
                style={[
                    splashStyles.glowEffect,
                    {
                        transform: [{ scale: glowScale }],
                        opacity: glowOpacity,
                    },
                ]}
            />

            {/* Main content */}
            <View style={splashStyles.content}>
                {/* Animated Logo */}
                <Animated.View
                    style={[
                        splashStyles.logoContainer,
                        {
                            transform: [{ scale: logoScale }],
                            opacity: logoOpacity,
                        },
                    ]}>
                    <Image
                        source={LauncherLogo}
                        style={splashStyles.logoImage}
                        resizeMode="cover"
                    />
                </Animated.View>

                {/* Brand Name */}
                <Animated.Text
                    style={[
                        splashStyles.brandName,
                        {
                            opacity: textOpacity,
                            transform: [{ translateY: textTranslateY }],
                        },
                    ]}>
                    ServiceOnDoors
                </Animated.Text>

                {/* Tagline */}
                <Animated.Text
                    style={[splashStyles.tagline, { opacity: taglineOpacity }]}>
                    SOD Partner APP
                </Animated.Text>
            </View>

            {/* Loading indicator */}
            <View style={splashStyles.loaderContainer}>
                <View style={splashStyles.loaderTrack}>
                    <Animated.View
                        style={[splashStyles.loaderBar, { width: loaderWidth }]}
                    />
                </View>
                <Text style={splashStyles.versionText}>v1.0.0</Text>
            </View>
        </LinearGradient>
    );
};

export default WelcomeToSOD;
