import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigations/navigation';

type WebViewScreenRouteProp = RouteProp<RootStackParamList, 'WebViewScreen'>;

const WebViewScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<WebViewScreenRouteProp>();
    const { url, title } = route.params;
    const [loading, setLoading] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title || 'Web View'}</Text>
                <View style={styles.placeholder} />
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5F60B9" />
                </View>
            )}

            <WebView
                source={{ uri: url }}
                onLoad={() => setLoading(false)}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1F34',
    },
    placeholder: {
        width: 32,
    },
    loadingContainer: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 10,
    },
    webview: {
        flex: 1,
    },
});

export default WebViewScreen;
