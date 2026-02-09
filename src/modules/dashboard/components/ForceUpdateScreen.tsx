import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking,
    StatusBar,
    Animated,
    Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LauncherLogo = require('../../../assets/img/new_launcher.png');

interface ForceUpdateScreenProps {
    playStoreUrl?: string;
}

const ForceUpdateScreen = ({
    playStoreUrl = 'https://play.google.com/store/apps/details?id=com.roservice.partner',
}: ForceUpdateScreenProps) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleUpdate = () => {
        Linking.openURL(playStoreUrl).catch((err) =>
            console.error('An error occurred', err),
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6B46C1" />
            <LinearGradient
                colors={['#6B46C1', '#9333EA', '#4C1D95']}
                style={styles.gradient}
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { translateY: slideAnim },
                                { scale: scaleAnim },
                            ],
                        },
                    ]}
                >
                    <View style={styles.logoContainer}>
                        <Image source={LauncherLogo} style={styles.logo} />
                        <View style={styles.badge}>
                            <Ionicons name="cloud-download" size={20} color="#6B46C1" />
                        </View>
                    </View>

                    <Text style={styles.title}>Update Available!</Text>
                    <Text style={styles.description}>
                        A newer, faster, and better version of the SOD Partner App is
                        ready for you. Please update to continue using the services.
                    </Text>

                    <View style={styles.featuresContainer}>
                        <View style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={22} color="#A78BFA" />
                            <Text style={styles.featureText}>Enhanced Performance</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={22} color="#A78BFA" />
                            <Text style={styles.featureText}>Bug Fixes & Security</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={22} color="#A78BFA" />
                            <Text style={styles.featureText}>New Features Added</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.updateButton}
                        onPress={handleUpdate}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.updateButtonText}>Update Now</Text>
                        <Ionicons name="arrow-forward" size={20} color="#6B46C1" />
                    </TouchableOpacity>

                    <Text style={styles.footerText}>
                        Your current version is outdated.
                    </Text>
                </Animated.View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 99999,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    content: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 30,
        padding: 40,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    logoContainer: {
        position: 'relative',
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 25,
    },
    badge: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 15,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#E9D5FF',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    featuresContainer: {
        width: '100%',
        marginBottom: 35,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureText: {
        marginLeft: 12,
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    updateButton: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 35,
        borderRadius: 15,
        width: '100%',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    updateButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6B46C1',
        marginRight: 10,
    },
    footerText: {
        marginTop: 25,
        fontSize: 12,
        color: '#C4B5FD',
        fontStyle: 'italic',
    },
});

export default ForceUpdateScreen;
