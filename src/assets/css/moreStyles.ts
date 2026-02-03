import { StyleSheet, Platform } from 'react-native';

export const moreStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1F34',
        marginLeft: 8,
    },
    backButton: {
        padding: 4,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    // Profile Section
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F0F0FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E8E8FF',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#5F60B9',
    },
    profileInfo: {
        marginLeft: 16,
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1F34',
    },
    userEmail: {
        fontSize: 14,
        color: '#6C757D',
        marginTop: 2,
    },
    editProfileIcon: {
        padding: 8,
    },
    // Menu Sections
    sectionContainer: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#8F8F8F',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    menuCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    // Availability Section
    availabilityCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    availabilityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    availabilityTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1C1F34',
    },
    availabilitySubtext: {
        fontSize: 13,
        color: '#8F8F8F',
        marginTop: 4,
    },
    // Logout Button
    logoutContainer: {
        marginTop: 32,
        paddingHorizontal: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF5F5',
        paddingVertical: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FFEBEB',
    },
    logoutIcon: {
        marginRight: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF4D4D',
    },
    // Footer Info
    footer: {
        marginTop: 40,
        alignItems: 'center',
        paddingBottom: 20,
    },
    versionText: {
        fontSize: 12,
        color: '#ADB5BD',
        fontWeight: '500',
    },
    // Help Modal
    helpModalContent: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        alignItems: 'center',
    },
    helpModalIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0F0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    helpModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C1F34',
        marginBottom: 12,
        textAlign: 'center',
    },
    helpModalDescription: {
        fontSize: 15,
        color: '#6C757D',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        width: '100%',
        marginBottom: 12,
    },
    contactIcon: {
        marginRight: 16,
    },
    contactLabel: {
        fontSize: 12,
        color: '#8F8F8F',
        marginBottom: 4,
    },
    contactValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1F34',
    },
});
