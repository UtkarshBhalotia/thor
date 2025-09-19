import { Dimensions, StyleSheet } from 'react-native';

const width = Dimensions.get('window').width;

export const splashStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
