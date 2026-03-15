import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ErrorBoundary from '../../../components/ErrorBoundary';

const AdminMore = () => {
    return (
        <ErrorBoundary>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>More</Text>
                </View>
            </SafeAreaView>
        </ErrorBoundary>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
});

export default AdminMore;
