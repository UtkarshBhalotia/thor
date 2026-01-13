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
        justifyContent: 'flex-start',
        paddingHorizontal: 0,
        paddingTop: 0,
    },
    imageContainer: {
        width: width,
        height: height * 0.55,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    image: {
        width: width,
        height: height * 0.55,
        resizeMode: 'contain',
    },
    textContainer: {
        width: width,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 25,
        flex: 1,
    },
    title: {
        fontSize: RFValue(24),
        fontWeight: '700',
        color: '#5F60B9',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: RFValue(15),
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginTop: 10,
        paddingHorizontal: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 30,
        paddingBottom: 40,
        paddingTop: 20,
        backgroundColor: '#FFFFFF',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    dot: {
        height: 6,
        width: 6,
        borderRadius: 3,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#5F60B9',
        width: 6,
        height: 6,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#5F60B9',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#5F60B9',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: RFValue(15),
        fontWeight: '600',
        letterSpacing: 0.5,
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
