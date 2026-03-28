import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    SafeAreaView,
    StatusBar,
    Alert,
    Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigations/navigation';
import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';

type WebViewScreenRouteProp = RouteProp<RootStackParamList, 'WebViewScreen'>;

const WebViewScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<WebViewScreenRouteProp>();
    const { url, html, title } = route.params;
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const sourceProp = html ? { html } : (url ? { uri: url } : { html: '<html><body>No content provided</body></html>' });

    const handleSaveAsPDF = async () => {
        if (!html) return;
        setIsGenerating(true);
        try {
            let options = {
                html: html,
                fileName: `Tax_Invoice_${new Date().getTime()}`,
            };

            let file = await generatePDF(options);
            
            if (file.filePath) {
                const fileUrl = file.filePath.startsWith('file://') 
                    ? file.filePath 
                    : `file://${file.filePath}`;

                const shareOptions = {
                    title: 'Share/Save PDF',
                    url: fileUrl,
                    type: 'application/pdf',
                    saveToFiles: true, // iOS: provides "Save to Files" option
                    failOnCancel: false
                };
                await Share.open(shareOptions);
            }
        } catch (error: any) {
            console.error('Error generating PDF:', error);
            Alert.alert('Error', 'Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

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
                {html ? (
                    <TouchableOpacity onPress={handleSaveAsPDF} disabled={isGenerating} style={styles.downloadButton}>
                        {isGenerating ? (
                            <ActivityIndicator size="small" color="#5F60B9" />
                        ) : (
                            <Text style={styles.downloadText}>Save PDF</Text>
                        )}
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholder} />
                )}
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5F60B9" />
                </View>
            )}

            <WebView
                source={sourceProp}
                onLoad={() => setLoading(false)}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
            />

            {html && (
                <TouchableOpacity onPress={handleSaveAsPDF} disabled={isGenerating} style={styles.fab}>
                    {isGenerating ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <Ionicons name="download" size={24} color="#FFFFFF" />
                            <Text style={styles.fabText}>Save PDF</Text>
                        </>
                    )}
                </TouchableOpacity>
            )}
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
        flex: 1,
        textAlign: 'center',
    },
    downloadButton: {
        padding: 4,
        width: 80,
        alignItems: 'center',
    },
    downloadText: {
        color: '#5F60B9',
        fontWeight: '700',
        fontSize: 14,
    },
    placeholder: {
        width: 80,
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
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#5F60B9',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        zIndex: 999,
    },
    fabText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default WebViewScreen;
