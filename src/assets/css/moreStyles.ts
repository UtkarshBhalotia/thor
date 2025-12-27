import { StyleSheet } from 'react-native';

export const moreStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7FB',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1F34',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
});
