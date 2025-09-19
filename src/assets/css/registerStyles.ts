import { StyleSheet } from 'react-native';

export const registerStyles = StyleSheet.create({
    selectText: {
        color: '#1C1F34',
    },
    selectPlaceholder: {
        color: '#8F8F8F',
    },
    sheetContainer: {
        paddingHorizontal: 8,
        paddingBottom: 0,
    },
    sheetTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1F34',
        paddingVertical: 8,
        textAlign: 'center',
    },
    listItem: {
        height: 48,
        paddingVertical: 12,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        overflow: 'hidden',
    },
    listItemText: {
        fontSize: 15,
        color: '#1C1F34',
    },
});
