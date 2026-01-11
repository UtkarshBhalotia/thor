import { StyleSheet } from 'react-native';

export const changePasswordStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1F34',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    formSection: {
        marginTop: 20,
    },
    descriptionText: {
        fontSize: 14,
        color: '#6C757D',
        marginBottom: 24,
        lineHeight: 20,
    },
    updateButton: {
        backgroundColor: '#5F60B9',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
        shadowColor: '#29B6D1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    updateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
        opacity: 0.6,
    },
});
