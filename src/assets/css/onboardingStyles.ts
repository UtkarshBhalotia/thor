import { StyleSheet, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

export const onboardingStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    slide: {
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    imageContainer: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    image: {
        width: width * 0.8,
        height: width * 0.8,
        resizeMode: 'contain',
    },
    textContainer: {
        flex: 0.4,
        alignItems: 'center',
        paddingTop: 20,
    },
    title: {
        fontSize: RFValue(24),
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 15,
    },
    description: {
        fontSize: RFValue(16),
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#E5E5E5',
        marginHorizontal: 8,
    },
    activeDot: {
        backgroundColor: '#4A90E2',
        width: 25,
    },
    button: {
        backgroundColor: '#4A90E2',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: RFValue(16),
        fontWeight: '600',
    },
    skipButton: {
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    skipText: {
        color: '#8E8E93',
        fontSize: RFValue(16),
        fontWeight: '500',
    },
});
