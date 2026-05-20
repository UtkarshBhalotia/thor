import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, ActivityIndicator, StatusBar, Platform, Alert } from 'react-native';
import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { clientPostHandler } from '../../services/request';
import projectEnv from '../../services/env';
import { showToast } from '../../utils/common';
import { RootStackParamList } from '../../navigations/navigation';
import { generateInvoiceHtml } from './template';

const MONTHS = Array.from({ length: 12 }, (_, i) => {
    const num = (i + 1).toString().padStart(2, '0');
    return { label: num, value: num };
});

const YEARS = Array.from({ length: 11 }, (_, i) => {
    const year = (2020 + i).toString();
    return { label: year, value: year };
});

const Invoice = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const globalState = useSelector((state: RootState) => state.globalState);
    const userId = globalState.userId;
    
    const isAdmin = globalState?.userType === 'A';
    const statusBarColor = isAdmin ? '#086364' : '#F8F9FA';
    const headerBgColor = isAdmin ? '#0A8485' : '#F8F9FA';
    const headerTitleColor = isAdmin ? '#FFFFFF' : '#1C1F34';
    const backBtnColor = isAdmin ? '#FFFFFF' : '#1C1F34';

    const [selectedMonth, setSelectedMonth] = useState('01');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const dataObj = {
                UserID: userId,
                Month: selectedMonth,
                Year: selectedYear,
            };

            const response: any = await clientPostHandler({
                url: projectEnv.getInvoiceDetailsUrl,
                data: dataObj,
            });

            if (response && response.body) {
                const responseData = response.body;
                if (responseData.d && responseData.d !== '') {
                    const parsedData = JSON.parse(responseData.d);
                    console.log('Invoice API Response:', parsedData);
                    
                    if (parsedData && parsedData.HeadTable && parsedData.HeadTable.length > 0) {
                        const htmlContent = generateInvoiceHtml(parsedData);
                        navigation.navigate('WebViewScreen', { 
                            title: `Tax Invoice - ${parsedData.HeadTable[0].InvoiceNo || 'Report'}`, 
                            html: htmlContent 
                        });
                    } else {
                        showToast({
                            type: 'info',
                            text1: 'Info',
                            text2: 'No invoice records found for this duration.',
                        });
                    }
                } else {
                    showToast({
                        type: 'info',
                        text1: 'Info',
                        text2: 'No invoice data found for selected duration.',
                    });
                }
            } else {
                throw new Error('Invalid response');
            }
        } catch (error) {
            console.error('Invoice fetch error:', error);
            showToast({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to fetch invoice details',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderPickerModal = (visible: boolean, setVisible: (v: boolean) => void, data: any[], selectedValue: string, onSelect: (val: string) => void, title: string) => (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)} activeOpacity={1}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.value}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.modalItem, selectedValue === item.value && styles.modalItemSelected]}
                                onPress={() => {
                                    onSelect(item.value);
                                    setVisible(false);
                                }}
                            >
                                <Text style={[styles.modalItemText, selectedValue === item.value && styles.modalItemTextSelected]}>
                                    {item.label}
                                </Text>
                                {selectedValue === item.value && (
                                    <Ionicons name="checkmark-circle" size={20} color="#5F60B9" />
                                )}
                            </TouchableOpacity>
                        )}
                        style={{ maxHeight: 300 }}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <SafeAreaView style={[styles.container, isAdmin && { backgroundColor: '#F5F6FA' }]} edges={['top']}>
            <StatusBar backgroundColor={statusBarColor} barStyle={isAdmin ? 'light-content' : 'dark-content'} />
            
            <View style={[styles.header, { backgroundColor: headerBgColor }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={backBtnColor} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: headerTitleColor }]}>Tax Invoice</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>Select Month</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowMonthPicker(true)}>
                    <Text style={styles.dropdownText}>
                        {MONTHS.find(m => m.value === selectedMonth)?.label || 'Select Month'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#8E8E93" />
                </TouchableOpacity>

                <Text style={styles.label}>Select Year</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowYearPicker(true)}>
                    <Text style={styles.dropdownText}>
                        {YEARS.find(y => y.value === selectedYear)?.label || 'Select Year'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color="#8E8E93" />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
                    onPress={handleSubmit} 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit</Text>
                    )}
                </TouchableOpacity>
            </View>

            {renderPickerModal(showMonthPicker, setShowMonthPicker, MONTHS, selectedMonth, setSelectedMonth, 'Select Month')}
            {renderPickerModal(showYearPicker, setShowYearPicker, YEARS, selectedYear, setSelectedYear, 'Select Year')}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        // We can optionally hide the border if it's admin, but keeping it is fine or removing:
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1F34',
    },
    content: {
        padding: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#495057',
        marginBottom: 8,
        marginTop: 16,
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5EA',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    dropdownText: {
        fontSize: 16,
        color: '#1C1F34',
    },
    submitButton: {
        backgroundColor: '#5F60B9',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 32,
    },
    submitButtonDisabled: {
        backgroundColor: '#A0A0CD',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 24,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1C1F34',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F3F5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalItemSelected: {
        backgroundColor: '#F8F9FA',
    },
    modalItemText: {
        fontSize: 16,
        color: '#495057',
    },
    modalItemTextSelected: {
        color: '#5F60B9',
        fontWeight: '600',
    },
});

export default Invoice;