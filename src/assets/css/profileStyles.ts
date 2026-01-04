import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 30,
        paddingHorizontal: 16,
    },

    // Header Section
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

    // Form Section
    formSection: {
        paddingTop: 20,
    },

    // Profile Photo Section
    profilePhotoContainer: {
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    profilePhotoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    profilePhotoButton: {
        position: 'relative',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F5F5F5',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    profilePhotoPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilePhotoIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    profilePhotoText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    profilePhotoOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#29B6D1',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    profilePhotoOverlayIcon: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    removePhotoButton: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FF3B30',
        borderRadius: 20,
        alignSelf: 'center',
    },
    removePhotoText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },

    // Action Buttons
    updateButton: {
        backgroundColor: '#29B6D1',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
        // shadowColor: '#29B6D1',
        elevation: 0,
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

    // Upload Modal Styles (from Register)
    uploadModalContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    uploadOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    uploadOptionIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    uploadOptionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    removeOption: {
        backgroundColor: '#FFF5F5',
        borderColor: '#FF3B30',
    },
    removeOptionText: {
        color: '#FF3B30',
    },
    modalCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666666',
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
