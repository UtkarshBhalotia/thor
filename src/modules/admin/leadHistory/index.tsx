import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { bookingStyles } from '../../../assets/css/bookingStyles';
import SODTextInput from '../../../components/SODTextInput';
import LinearGradient from 'react-native-linear-gradient';
import LeadHistoryList from './components/list';
import { RootState } from '../../../../store';

const AdminLeadHistory = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    
    // Get state from Redux
    const { historyList, loading, hasSearched } = useSelector((state: RootState) => state.leadHistoryState);
    
    const [leadNo, setLeadNo] = useState('');
    const [mobileNo, setMobileNo] = useState('');

    useFocusEffect(
        useCallback(() => {
            // When user enters the screen, or we can use the cleanup function to reset when leaving
            return () => {
                setLeadNo('');
                setMobileNo('');
                dispatch({ type: 'LEAD_HISTORY_RESET' });
            };
        }, [dispatch])
    );

    const handleSearch = () => {
        if (!leadNo && !mobileNo) return;

        Keyboard.dismiss();
        
        dispatch({
            type: 'LeadHistory_Actions',
            payload: {
                actionName: 'Get_Lead_History_Api',
                actionParam: {
                    data: {
                        LeadNo: leadNo,
                        MobileNo: mobileNo,
                    }
                }
            }
        });
    };

    return (
        <SafeAreaView style={bookingStyles.container} edges={['top']}>
            <StatusBar backgroundColor="#086364" barStyle="light-content" />
            
            {/* Header */}
            <View style={[bookingStyles.header, { backgroundColor: '#0A8485' }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={bookingStyles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={[bookingStyles.headerTitle, { color: '#FFFFFF' }]}>Lead History</Text>
            </View>

            {/* Search Filters */}
            <View style={styles.searchContainer}>
                <View style={styles.inputRow}>
                    <View style={styles.inputWrapper}>
                        <SODTextInput
                            title="Lead Number"
                            placeholder="Enter Lead No"
                            value={leadNo}
                            onChangeText={setLeadNo}
                            isEditable={true}
                            gradientColors={['#0A8485', '#26A69A', '#80CBC4']}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <SODTextInput
                            title="Mobile Number"
                            placeholder="Enter Mobile No"
                            value={mobileNo}
                            onChangeText={setMobileNo}
                            isEditable={true}
                            keyboard="numeric"
                            maxlength={10}
                            gradientColors={['#0A8485', '#26A69A', '#80CBC4']}
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.searchButtonWrapper}
                    onPress={handleSearch}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#0A8485', '#26A69A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.searchButton}
                    >
                        <Ionicons name="search" size={20} color="#FFFFFF" />
                        <Text style={styles.searchButtonText}>Search History</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            <LeadHistoryList 
                data={historyList} 
                loading={loading} 
                hasSearched={hasSearched} 
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    inputWrapper: {
        flex: 1,
    },
    searchButtonWrapper: {
        marginTop: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default AdminLeadHistory;
