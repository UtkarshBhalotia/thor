import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { profileStyles } from '../../assets/css/profileStyles';
import { RootStackParamList } from '../../navigations/navigation';
import SODDropDown from '../../components/SODDropDown';
import { AppDispatch, RootState } from '../../../store';
import { connect } from 'react-redux';
import { registerActions_dispatch } from '../../../store/action/mainTypedAction';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { showToast } from '../../utils/common';

type ServiceLocationRouteProp = RouteProp<RootStackParamList, 'ServiceLocation'>;

const ServiceLocation = (props: any) => {
    const { globalState } = props;
    const navigation = useNavigation();
    const route = useRoute<ServiceLocationRouteProp>();
    const { state: initialState, city: initialCity, citiesWithCheckbox: initialCheckboxes, onSave } = route.params;

    const [states, setStates] = useState<any[]>([]);
    const [citiesWithCheckbox, setCitiesWithCheckbox] = useState<any[]>(initialCheckboxes || []);

    const formMethods = useForm({
        defaultValues: {
            state: initialState || '',
            city: initialCity || '',
            cityCheckboxes: initialCheckboxes || [],
        },
    });

    const { control, handleSubmit, watch, setValue } = formMethods;

    const selectedState = watch('state');

    // Load states on mount
    useEffect(() => {
        loadCountryList();
    }, []);

    const loadCountryList = () => {
        props.registerActions('Get_Country_List_Api', {
            callBack: (data: any[]) => {
                const india = data.find(
                    (c: any) => c.countryName?.toLowerCase() === 'india',
                );
                if (india) {
                    loadStateList(india.countryId);
                }
            },
        });
    };

    const loadStateList = (countryId: string | number) => {
        props.registerActions('Get_State_List_Api', {
            countryId: countryId,
            callBack: (data: any[]) => {
                const stateData = data.map((item: any) => ({
                    StateID: item.stateId,
                    StateName: item.stateName || item.Name || item,
                }));
                setStates(stateData);
            },
        });
    };

    const loadCityList = (stateId: string | number) => {
        props.registerActions('Get_City_List_Api', {
            stateId: stateId,
            callBack: (data: any[]) => {
                const checkboxData = data.map((item: any) => {
                    const name = item.cityName || item.Name || item;
                    const id = item.cityId || item.ID || item;
                    // Check if this city was previously selected
                    const previous = (initialCheckboxes || []).find(c => c.name === name);
                    return {
                        name,
                        id,
                        isChecked: previous ? previous.isChecked : false,
                    };
                });
                setCitiesWithCheckbox(checkboxData);
                setValue('cityCheckboxes', checkboxData as any);
            },
        });
    };

    // Watch for state changes
    useEffect(() => {
        if (selectedState && states.length > 0) {
            const stateObj = states.find((s: any) => s.StateName === selectedState);
            if (stateObj) {
                loadCityList(stateObj.StateID);
            }
        }
    }, [selectedState, states]);

    // Handle multi-select city text display
    const cityCheckboxes = watch('cityCheckboxes');
    useEffect(() => {
        if (cityCheckboxes && cityCheckboxes.length > 0) {
            const selectedCitiesText = cityCheckboxes
                .filter((c: any) => c.isChecked)
                .map((c: any) => c.name)
                .join(', ');
            setValue('city', selectedCitiesText);
        }
    }, [cityCheckboxes]);

    const handleSave = (formData: any) => {
        const selectedStateObj = states.find(s => s.StateName === formData.state);
        const stateId = selectedStateObj ? selectedStateObj.StateID : '';

        const checkedCities = formData.cityCheckboxes.filter((c: any) => c.isChecked);
        const cityString = checkedCities.map((c: any) => c.name).join(', ');

        // New REST API takes a real JSON array instead of the old stringified
        // "[{\"StateID\":\"8\",\"CityID\":\"8\"}]" param.
        const locations = checkedCities.map((c: any) => ({
            stateId: String(stateId),
            cityId: String(c.id),
        }));

        // New REST API: POST /vendor/service-locations (vendor from the JWT).
        props.registerActions('Map_City_List_By_Vendor_Api', {
            locations: locations,
            callBack: (success: boolean, message?: string) => {
                console.log('Map City List Response:', success, message);
                if (success) {
                    showToast({
                        type: 'mazuSuccess',
                        text1: message || 'Service locations updated successfully',
                    });
                    // After successful API call, call the onSave callback and go back
                    onSave({
                        state: formData.state,
                        city: cityString,
                        citiesWithCheckbox: formData.cityCheckboxes
                    });
                    setTimeout(() => {
                        navigation.goBack();
                    }, 500);
                } else {
                    Alert.alert('Error', message || 'Failed to update service locations');
                }
            }
        });
    };

    return (
        <SafeAreaView style={profileStyles.container} edges={['top']}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />

            {/* Header */}
            <View style={profileStyles.headerContainer}>
                <TouchableOpacity
                    style={profileStyles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={profileStyles.headerTitle}>Service Locations</Text>
            </View>

            <ScrollView contentContainerStyle={profileStyles.scrollContent}>
                <FormProvider {...formMethods}>
                    <View style={{ marginTop: 20 }}>
                        <Controller
                            control={control}
                            name="state"
                            render={({ field: { value } }) => (
                                <SODDropDown
                                    title="Select State"
                                    value={value || 'Select State'}
                                    dropDownFormData={states.map(s => s.StateName)}
                                    name="state"
                                    type="default"
                                    disabled={false}
                                />
                            )}
                        />

                        <View style={{ marginTop: 20 }}>
                            <Controller
                                control={control}
                                name="cityCheckboxes"
                                render={({ field: { value } }) => (
                                    <SODDropDown
                                        title="Select City"
                                        value={watch('city') || 'Select City'}
                                        ischeckBoxReq={true}
                                        name="cityCheckboxes"
                                        dropDownFormData={citiesWithCheckbox}
                                        type="default"
                                        disabled={!selectedState}
                                    />
                                )}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={profileStyles.updateButton}
                        onPress={handleSubmit(handleSave)}>
                        <Text style={profileStyles.updateButtonText}>SAVE</Text>
                    </TouchableOpacity>
                </FormProvider>
            </ScrollView>
        </SafeAreaView>
    );
};

const mapStateToProps = (state: RootState) => ({
    globalState: state.globalState,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    registerActions: registerActions_dispatch(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceLocation);
