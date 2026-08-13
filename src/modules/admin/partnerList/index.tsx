import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { bookingStyles } from '../../../assets/css/bookingStyles';
import SODDropDown from '../../../components/SODDropDown';
import LinearGradient from 'react-native-linear-gradient';
import PartnerList from './components/list';
import { RootState } from '../../../../store';
import { partnerListActions_dispatch, registerActions_dispatch } from '../../../../store/action/mainTypedAction';

const AdminPartnerList = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    
    // Form Setup
    const methods = useForm({
        defaultValues: {
            state: 'Select State',
            city: 'Select City',
            service: 'Select Service Type'
        }
    });

    const { setValue, control } = methods;
    const watchedValues = useWatch({ control });

    // Connected Actions
    const partnerListActions = useMemo(() => partnerListActions_dispatch(dispatch), [dispatch]);
    const registerActions = useMemo(() => registerActions_dispatch(dispatch), [dispatch]);

    // Get state from Redux
    const { partnerList, loading, hasSearched } = useSelector((state: RootState) => state.partnerListState);
    
    // Dropdown Data
    const [serviceTypes, setServiceTypes] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);

    const loadStates = useCallback((cId: string | number) => {
        registerActions('Get_State_List_Api', {
            countryId: cId,
            callBack: (data: any[]) => {
                const formatted = data.map(item => ({
                    id: item.stateId,
                    name: item.stateName || item.Name || item
                }));
                setStates(formatted);
            }
        });
    }, [registerActions]);

    const loadCities = useCallback((sId: string | number) => {
        registerActions('Get_City_List_Api', {
            stateId: sId,
            callBack: (data: any[]) => {
                const formatted = data.map(item => ({
                    id: item.cityId,
                    name: item.cityName || item.Name || item
                }));
                setCities(formatted);
            }
        });
    }, [registerActions]);

    // Load initial data
    useEffect(() => {
        // Load Service Types
        registerActions('Get_Service_Types_Api', {
            callBack: (data: any[]) => {
                const formatted = data.map(item => ({
                    id: item.serviceTypeId,
                    name: item.serviceName
                }));
                setServiceTypes(formatted);
            }
        });

        // Load Country List to find India (for States)
        registerActions('Get_Country_List_Api', {
            callBack: (data: any[]) => {
                const india = data.find(c => c.countryName?.toLowerCase() === 'india');
                if (india) {
                    loadStates(india.countryId);
                }
            }
        });
    }, [registerActions, loadStates]);

    // Watch for state change to load cities
    useEffect(() => {
        const selectedStateName = watchedValues.state;
        if (selectedStateName && selectedStateName !== 'Select State') {
            const stateObj = states.find(s => s.name === selectedStateName);
            if (stateObj) {
                setValue('city', 'Select City');
                loadCities(stateObj.id);
            }
        }
    }, [watchedValues.state, states, loadCities, setValue]);

    const handleSearch = useCallback(() => {
        const stateName = watchedValues.state;
        const cityName = watchedValues.city;
        const serviceName = watchedValues.service;

        const stateObj = states.find(s => s.name === stateName);
        const cityObj = cities.find(c => c.name === cityName);
        const serviceObj = serviceTypes.find(st => st.name === serviceName);

        if (!stateObj) {
            return;
        }

        partnerListActions('GET_USER_LIST_BY_CITY_STATE_API', {
            data: {
                StateID: stateObj.id,
                CityID: cityObj ? cityObj.id : '0',
                ServiceType: serviceObj ? serviceObj.id : '0',
            }
        });
    }, [watchedValues.state, watchedValues.city, watchedValues.service, states, cities, serviceTypes, partnerListActions]);

    useFocusEffect(
        useCallback(() => {
            return () => {
                dispatch({ type: 'PARTNER_LIST_RESET' });
            };
        }, [dispatch])
    );

    return (
        <FormProvider {...methods}>
            <SafeAreaView style={bookingStyles.container} edges={['top']}>
                <StatusBar backgroundColor="#086364" barStyle="light-content" />
                
                {/* Header */}
                <View style={[bookingStyles.header, { backgroundColor: '#0A8485' }]}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={bookingStyles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={[bookingStyles.headerTitle, { color: '#FFFFFF' }]}>Partner List</Text>
                </View>

                {/* Filter Section */}
                <View style={styles.filterContainer}>
                    <SODDropDown
                        title="State"
                        value={watchedValues.state}
                        required={true}
                        dropDownFormData={states.map(s => s.name)}
                        name="state"
                        type="BSModal"
                        disabled={false}
                    />

                    <SODDropDown
                        title="City"
                        value={watchedValues.city}
                        required={false}
                        disabled={watchedValues.state === 'Select State'}
                        dropDownFormData={cities.map(c => c.name)}
                        name="city"
                        type="BSModal"
                    />

                    <SODDropDown
                        title="Service"
                        value={watchedValues.service}
                        required={false}
                        dropDownFormData={serviceTypes.map(st => st.name)}
                        name="service"
                        type="BSModal"
                        disabled={false}
                    />

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
                            <Text style={styles.searchButtonText}>Filter Partners</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* List Results */}
                <PartnerList 
                    data={partnerList} 
                    loading={loading} 
                    hasSearched={hasSearched} 
                />
            </SafeAreaView>
        </FormProvider>
    );
};

const styles = StyleSheet.create({
    filterContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchButtonWrapper: {
        marginTop: 12,
        marginHorizontal: 16,
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

export default AdminPartnerList;
