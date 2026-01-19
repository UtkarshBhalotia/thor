import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const idVerificationStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        // borderBottomWidth: 1,
        // borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F7F7F7',
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1F34',
        flex: 1,
        textAlign: 'center',
        marginRight: 48, // To balance the back button
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    subtitle: {
        fontSize: 14,
        color: '#8F8F8F',
        marginTop: 16,
        marginBottom: 16,
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#F8F9FA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    imageContainer: {
        width: '100%',
        height: 180,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 16,
    },
    documentImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    docTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    docTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1F34',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500',
    },
    statusPending: {
        color: '#E53935', // Red
    },
    statusUpdate: {
        color: '#5F60B9', // Purple
    },
    dot: {
        fontSize: 18,
        marginRight: 4,
    },
    checkIcon: {
        marginRight: 8,
    },
});
