import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    Alert,
    TouchableOpacity,
    Image,
    Platform,
    StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { profileStyles } from '../../assets/css/profileStyles';
import {
    CommonActions,
    NavigationProp,
    useNavigation,
    useFocusEffect,
} from '@react-navigation/native';
import { removeItem, STORAGE_KEYS } from '../../utils/storage';
import { useDispatch, useSelector, connect } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import SODTextInput from '../../components/SODTextInput';
import SODDropDown from '../../components/SODDropDown';
import BSModal from '../../components/BSModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
    launchImageLibrary,
    launchCamera,
    ImagePickerResponse,
    MediaType,
    PhotoQuality,
} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { registerActions_dispatch } from '../../../store/action/mainTypedAction';

import LogoutModal from '../../components/LogoutModal';
import { RootStackParamList } from '../../navigations/navigation';
import { showToast } from '../../utils/common';
import * as RootNavigation from '../../utils/rootNavigation';

const Profile = (props: any) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const globalState = useSelector((state: RootState) => state.globalState);

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const photoUploadModalRef = useRef<BottomSheetModal>(null);

    // State, City data
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [citiesWithCheckbox, setCitiesWithCheckbox] = useState<any[]>([]);

    const photoUploadSnapPoints = React.useMemo(() => ['30%'], []);

    const formMethods = useForm({
        defaultValues: {
            name: '',
            email: '',
            mobileNumber: '',
            companyName: '',
            gstin: '',
            address: '', // Assuming address is not in globalState yet or needs to be fetched
            state: '',
            city: '',
            cityCheckboxes: [], // For multi-select
            ProfileLocked: 0,
            ValidateGST: 0,
        },
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = formMethods;

    const watchedValues = watch();
    const profileLocked = watch('ProfileLocked');
    const validateGST = watch('ValidateGST');

    // Calculate editable states based on flags
    const isCompanyNameEditable = profileLocked === 0 && validateGST === 0;
    const isMobileEditable = profileLocked === 0;
    const isAddressEditable = profileLocked === 0;
    const isGSTINEditable = profileLocked === 0 && validateGST === 0;
    const isStateEditable = profileLocked === 0;
    const isCityEditable = profileLocked === 0;

    // Update button is enabled only if ProfileLocked is 0 (user can edit at least some fields)
    const isUpdateButtonEnabled = profileLocked === 0 && !submitting;

    // Load vendor details every time the profile screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadVendorDetails();
        }, [])
    );

    const loadVendorDetails = () => {
        // New REST API: the vendor is derived from the JWT, so no UserID is sent
        // and the callback receives a single profile object (camelCase fields).
        props.registerActions('Get_Vendor_Details_By_ID_Api', {
            callBack: (data: any) => {
                console.log('Vendor Details:', data);
                // Capture the response
                if (data) {
                    setValue('name', data.name);
                    setValue('email', data.emailId);
                    setValue('mobileNumber', data.mobileNo);
                    setValue('companyName', data.companyName);
                    setValue('gstin', data.gstNo);
                    setValue('address', data.address);
                    setValue('state', data.state);
                    setValue('city', data.city);
                    setValue('ProfileLocked', data.profileLocked);
                    setValue('ValidateGST', data.validateGst);
                }

                loadCountryList();
            },
        });
    };

    const loadCountryList = () => {
        props.registerActions('Get_Country_List_Api', {
            callBack: (data: any[]) => {
                const countryData = data.map((item: any) => ({
                    CountryID: item.countryId,
                    CountryName: item.countryName,
                }));
                setCountries(countryData);

                // Default to India
                const india = countryData.find(
                    (c) => c.CountryName?.toLowerCase() === 'india',
                );
                if (india) {
                    loadStateList(india.CountryID);
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
                const cityNames = data.map(
                    (item: any) => item.cityName || item.Name || item,
                );
                setCities(cityNames);

                // Initialize checkbox array
                const checkboxData = cityNames.map((name: string) => ({
                    name,
                    isChecked: false,
                }));
                setCitiesWithCheckbox(checkboxData);
                setValue('cityCheckboxes', checkboxData as any);
            },
        });
    };

    // Watchers for dependencies
    const selectedState = watch('state');
    useEffect(() => {
        if (selectedState && states.length > 0) {
            const stateData = states.find((s) => s.StateName === selectedState);
            if (stateData) {
                loadCityList(stateData.StateID);
                setValue('city', '');
                setValue('cityCheckboxes', []);
            }
        }
    }, [selectedState, states.length]);

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

    const handleProfilePhotoUpload = () => {
        photoUploadModalRef.current?.present();
    };

    const handleNavigateToLocationSelection = () => {
        navigation.navigate('ServiceLocation', {
            state: watchedValues.state,
            city: watchedValues.city,
            citiesWithCheckbox: watchedValues.cityCheckboxes,
            onSave: (data: { state: string; city: string; citiesWithCheckbox: any[] }) => {
                setValue('state', data.state);
                setValue('city', data.city);
                setValue('cityCheckboxes', data.citiesWithCheckbox as any);
            }
        });
    };

    const handleCamera = () => {
        photoUploadModalRef.current?.dismiss();
        const options = {
            mediaType: 'photo' as MediaType,
            quality: 0.8 as PhotoQuality,
        };
        setTimeout(() => {
            launchCamera(options, (response: ImagePickerResponse) => {
                if (response.assets && response.assets[0]) {
                    setProfileImage(response.assets[0].uri || null);
                }
            });
        }, 300);
    };

    const handleGallery = () => {
        photoUploadModalRef.current?.dismiss();
        const options = {
            mediaType: 'photo' as MediaType,
            quality: 0.8 as PhotoQuality,
        };
        setTimeout(() => {
            launchImageLibrary(options, (response: ImagePickerResponse) => {
                if (response.assets && response.assets[0]) {
                    setProfileImage(response.assets[0].uri || null);
                }
            });
        }, 300);
    };

    const handleRemovePhoto = () => {
        setProfileImage(null);
        photoUploadModalRef.current?.dismiss();
    };

    const handleUpdateProfile = (data: any) => {
        console.log('Update Profile Data:', data);

        setSubmitting(true);
        // New REST API: PUT /vendor/profile — vendor comes from the JWT and the
        // callback reports success via the HTTP status, not a `d` payload.
        props.registerActions('Update_Vendor_Profile_Api', {
            companyName: data.companyName,
            gstNo: data.gstin,
            mobileNo: data.mobileNumber,
            address: data.address,
            callBack: async (success: boolean, message?: string) => {
                setSubmitting(false);
                if (success) {
                    // Update Global State and AsyncStorage
                    const updatedUserInfo = {
                        ...globalState,
                        companyName: data.companyName,
                        gstNo: data.gstin,
                        mobile: data.mobileNumber,
                        // Address is not in globalState yet but we can add it if needed
                        // address: data.address,
                    };

                    // Persist to AsyncStorage
                    const { setItem, STORAGE_KEYS } = require('../../utils/storage');
                    await setItem(STORAGE_KEYS.USER_INFO, updatedUserInfo);

                    // Update Redux Global State
                    dispatch({
                        type: 'GLOBAL_STATE_MUTATE',
                        value: updatedUserInfo,
                    });

                    showToast({
                        type: 'mazuSuccess',
                        text1: message || 'Profile updated successfully',
                    });

                    setTimeout(() => {
                        RootNavigation.navigate('HomeTabs');
                    }, 1000);

                    loadVendorDetails(); // Refresh local form data
                } else {
                    Alert.alert('Error', message || 'Failed to update profile');
                }
            },
        });
    };

    const confirmLogout = async () => {
        setShowLogoutModal(false);
        await removeItem(STORAGE_KEYS.USER_INFO);
        await removeItem(STORAGE_KEYS.AUTH_TOKEN);
        dispatch({ type: 'GLOBAL_RESET' });
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            }),
        );
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    return (
        <SafeAreaView style={profileStyles.container} edges={['top']}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />
            <View style={profileStyles.headerContainer}>
                <TouchableOpacity
                    style={profileStyles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={profileStyles.headerTitle}>Profile</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={profileStyles.scrollContent}>
                
                {profileLocked === 1 && (
                    <View style={profileStyles.lockedMessageContainer}>
                        <Ionicons name="lock-closed" size={20} color="#D32F2F" />
                        <Text style={profileStyles.lockedMessageText}>
                            Profile is Locked. Please contact admin to update details.
                        </Text>
                    </View>
                )}

                <View style={profileStyles.formSection}>
                    {/* Profile Photo Section */}
                    <View style={profileStyles.profilePhotoContainer}>
                        <TouchableOpacity
                            style={profileStyles.profilePhotoButton}
                            onPress={profileLocked === 0 ? handleProfilePhotoUpload : undefined}
                            activeOpacity={profileLocked === 0 ? 0.7 : 1}>
                            {profileImage ? (
                                <Image
                                    source={{ uri: profileImage }}
                                    style={profileStyles.profileImage}
                                />
                            ) : (
                                <View
                                    style={
                                        profileStyles.profilePhotoPlaceholder
                                    }>
                                    <Text
                                        style={profileStyles.profilePhotoIcon}>
                                        👤
                                    </Text>
                                    <Text
                                        style={profileStyles.profilePhotoText}>
                                        Add Photo
                                    </Text>
                                </View>
                            )}
                            <View style={profileStyles.profilePhotoOverlay}>
                                <Text
                                    style={
                                        profileStyles.profilePhotoOverlayIcon
                                    }>
                                    {profileImage ? '✏️' : '➕'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {profileImage && profileLocked === 0 && (
                            <TouchableOpacity
                                style={profileStyles.removePhotoButton}
                                onPress={handleRemovePhoto}>
                                <Text style={profileStyles.removePhotoText}>
                                    Remove Photo
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <FormProvider {...formMethods}>
                        {/* Name (Read-only) */}
                        <SODTextInput
                            title="Name"
                            value={watchedValues.name}
                            isEditable={false}
                            placeholder="Full Name"
                            name="name"
                        />

                        {/* Email (Read-only) */}
                        <SODTextInput
                            title="Email"
                            value={watchedValues.email}
                            isEditable={false}
                            placeholder="Email Address"
                            name="email"
                        />

                        {/* Mobile No (Editable) */}
                        <Controller
                            control={control}
                            name="mobileNumber"
                            render={({ field: { onChange, value } }) => (
                                <SODTextInput
                                    title="Mobile No"
                                    value={value}
                                    onChangeText={onChange}
                                    isEditable={isMobileEditable}
                                    keyboard="numeric"
                                    placeholder="Mobile Number"
                                    name="mobileNumber"
                                />
                            )}
                        />

                        {/* Company Name (Conditionally Editable) */}
                        <Controller
                            control={control}
                            name="companyName"
                            render={({ field: { onChange, value } }) => (
                                <SODTextInput
                                    title="Company Name"
                                    value={value}
                                    onChangeText={onChange}
                                    isEditable={isCompanyNameEditable}
                                    placeholder="Company Name"
                                    name="companyName"
                                />
                            )}
                        />

                        {/* GSTIN (Conditionally Editable) */}
                        <Controller
                            control={control}
                            name="gstin"
                            render={({ field: { onChange, value } }) => (
                                <SODTextInput
                                    title="GSTIN"
                                    value={value}
                                    onChangeText={onChange}
                                    isEditable={isGSTINEditable}
                                    placeholder="GST Number"
                                    name="gstin"
                                />
                            )}
                        />

                        {/* Address (Conditionally Editable, TextArea) */}
                        <Controller
                            control={control}
                            name="address"
                            render={({ field: { onChange, value } }) => (
                                <SODTextInput
                                    title="Address"
                                    value={value}
                                    onChangeText={onChange}
                                    isEditable={isAddressEditable}
                                    placeholder="Enter your address"
                                    name="address"
                                    autoExpand={true}
                                    minHeight={80}
                                />
                            )}
                        />

                        {/* Location Selection CTA */}
                        <TouchableOpacity
                            style={[
                                profileStyles.locationCTA,
                                profileLocked === 1 && profileStyles.disabledButton,
                            ]}
                            onPress={profileLocked === 0 ? handleNavigateToLocationSelection : undefined}
                            disabled={profileLocked === 1}
                            activeOpacity={0.7}>
                            <View style={profileStyles.locationCTALeft}>
                                <Text style={profileStyles.locationCTATitle}>Service Locations</Text>
                                <Text
                                    numberOfLines={1}
                                    style={
                                        watchedValues.city
                                            ? profileStyles.locationCTAValue
                                            : profileStyles.locationCTAPlaceholder
                                    }>
                                    {watchedValues.city
                                        ? `${watchedValues.city}, ${watchedValues.state}`
                                        : 'Select State and City'}
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={profileLocked === 1 ? '#8F8F8F' : '#5F60B9'}
                            />
                        </TouchableOpacity>

                        {/* Update Button */}
                        <TouchableOpacity
                            style={[
                                profileStyles.updateButton,
                                (!isUpdateButtonEnabled || submitting) &&
                                profileStyles.disabledButton,
                            ]}
                            onPress={handleSubmit(handleUpdateProfile)}
                            disabled={!isUpdateButtonEnabled || submitting}>
                            <Text style={profileStyles.updateButtonText}>
                                {submitting ? 'UPDATING...' : 'UPDATE PROFILE'}
                            </Text>
                        </TouchableOpacity>
                    </FormProvider>
                </View>
            </ScrollView>

            {/* Photo Upload Modal */}
            <BSModal
                bsModalRef={photoUploadModalRef}
                index={0}
                snapPoints={photoUploadSnapPoints}
                headerTitle="Profile Photo">
                <View style={profileStyles.uploadModalContainer}>
                    <TouchableOpacity
                        style={profileStyles.uploadOption}
                        onPress={handleCamera}>
                        <Text style={profileStyles.uploadOptionIcon}>📷</Text>
                        <Text style={profileStyles.uploadOptionText}>
                            Take Photo
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={profileStyles.uploadOption}
                        onPress={handleGallery}>
                        <Text style={profileStyles.uploadOptionIcon}>🖼️</Text>
                        <Text style={profileStyles.uploadOptionText}>
                            Choose from Gallery
                        </Text>
                    </TouchableOpacity>
                </View>
            </BSModal>

            {/* Logout Modal */}
            <LogoutModal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onLogout={confirmLogout}
            />
        </SafeAreaView>
    );
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    registerActions: registerActions_dispatch(dispatch),
});

export default connect(null, mapDispatchToProps)(Profile);
