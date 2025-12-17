import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7FB',
    },
    scrollContent: {
        paddingBottom: 30,
    },

    // Profile Header
    profileHeader: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#5F60B9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1C1F34',
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF9800',
        marginLeft: 4,
    },
    memberSince: {
        fontSize: 13,
        color: '#8F8F8F',
        marginBottom: 12,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    locationText: {
        fontSize: 14,
        color: '#1C1F34',
        marginLeft: 6,
    },

    // Stats Row
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        width: '100%',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 11,
        color: '#8F8F8F',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C1F34',
    },

    // Section
    section: {
        backgroundColor: '#FFFFFF',
        marginTop: 12,
        paddingVertical: 8,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8F8F8F',
        paddingHorizontal: 20,
        paddingVertical: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Menu Item
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F7F7FB',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F7F7FB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 15,
        color: '#1C1F34',
        fontWeight: '500',
    },
    menuItemArrow: {
        fontSize: 18,
        color: '#8F8F8F',
    },

    // Alert Zone
    alertMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F7F7FB',
    },
    alertMenuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    alertMenuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFEBEE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    alertMenuItemText: {
        fontSize: 15,
        color: '#C50F1F',
        fontWeight: '500',
    },

    // Logout Menu Item
    logoutMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
    },
    logoutMenuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    logoutMenuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF4E6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    logoutMenuItemText: {
        fontSize: 15,
        color: '#FF9800',
        fontWeight: '500',
    },
});
