import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Alert,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { profileStyles } from '../../assets/css/profileStyles';
import {
    CommonActions,
    NavigationProp,
    useNavigation,
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

    const formMethods = useForm({
        defaultValues: {
            name: globalState.name || '',
            email: globalState.email || '',
            mobileNumber: globalState.mobile || '',
            companyName: globalState.companyName || '',
            gstin: globalState.gstNo || '',
            address: '', // Assuming address is not in globalState yet or needs to be fetched
            state: '',
            city: '',
            cityCheckboxes: [], // For multi-select
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

    // Load country list and set default states
    useEffect(() => {
        loadCountryList();
    }, []);

    const loadCountryList = () => {
        props.registerActions('Get_Country_List_Api', {
            callBack: (data: any[]) => {
                const countryData = data.map((item: any) => ({
                    CountryID: item.CountryID,
                    CountryName: item.CountryName,
                }));
                setCountries(countryData);

                // Default to India
                const india = countryData.find(c => c.CountryName.toLowerCase() === 'india');
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
                    StateID: item.StateID,
                    StateName: item.StateName || item.Name || item,
                }));
                setStates(stateData);
            },
        });
    };

    const loadCityList = (stateId: string | number) => {
        props.registerActions('Get_City_List_Api', {
            stateId: stateId,
            callBack: (data: any[]) => {
                const cityNames = data.map((item: any) => item.CityName || item.Name || item);
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
            const stateData = states.find(s => s.StateName === selectedState);
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
        // Simulate API call
        setTimeout(() => {
            setSubmitting(false);
            Alert.alert('Success', 'Profile updated successfully');
        }, 2000);
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
            <View style={profileStyles.headerContainer}>
                <TouchableOpacity
                    style={profileStyles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={profileStyles.headerTitle}>Update Profile</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={profileStyles.scrollContent}>
                <View style={profileStyles.formSection}>
                    {/* Profile Photo Section */}
                    <View style={profileStyles.profilePhotoContainer}>
                        <TouchableOpacity style={profileStyles.profilePhotoButton} onPress={handleProfilePhotoUpload}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={profileStyles.profileImage} />
                            ) : (
                                <View style={profileStyles.profilePhotoPlaceholder}>
                                    <Text style={profileStyles.profilePhotoIcon}>👤</Text>
                                    <Text style={profileStyles.profilePhotoText}>Add Photo</Text>
                                </View>
                            )}
                            <View style={profileStyles.profilePhotoOverlay}>
                                <Text style={profileStyles.profilePhotoOverlayIcon}>{profileImage ? '✏️' : '➕'}</Text>
                            </View>
                        </TouchableOpacity>
                        {profileImage && (
                            <TouchableOpacity style={profileStyles.removePhotoButton} onPress={handleRemovePhoto}>
                                <Text style={profileStyles.removePhotoText}>Remove Photo</Text>
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
                                    isEditable={true}
                                    keyboard="numeric"
                                    placeholder="Mobile Number"
                                    name="mobileNumber"
                                />
                            )}
                        />

                        {/* Company Name (Read-only) */}
                        <SODTextInput
                            title="Company Name"
                            value={watchedValues.companyName}
                            isEditable={false}
                            placeholder="Company Name"
                            name="companyName"
                        />

                        {/* GSTIN (Read-only) */}
                        <SODTextInput
                            title="GSTIN"
                            value={watchedValues.gstin}
                            isEditable={false}
                            placeholder="GST Number"
                            name="gstin"
                        />

                        {/* Address (Editable, TextArea) */}
                        <Controller
                            control={control}
                            name="address"
                            render={({ field: { onChange, value } }) => (
                                <SODTextInput
                                    title="Address"
                                    value={value}
                                    onChangeText={onChange}
                                    isEditable={true}
                                    placeholder="Enter your address"
                                    name="address"
                                />
                            )}
                        />

                        {/* State Dropdown */}
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

                        {/* City Dropdown (Multi-select) */}
                        <Controller
                            control={control}
                            name="city"
                            render={({ field: { value } }) => (
                                <SODDropDown
                                    title="Select City"
                                    value={value || 'Select City'}
                                    ischeckBoxReq={true}
                                    name="cityCheckboxes"
                                    dropDownFormData={citiesWithCheckbox}
                                    type="default"
                                    disabled={false}
                                />
                            )}
                        />

                        {/* Update Button */}
                        <TouchableOpacity
                            style={[profileStyles.updateButton, submitting && profileStyles.disabledButton]}
                            onPress={handleSubmit(handleUpdateProfile)}
                            disabled={submitting}>
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
                snapPoints={['30%']}
                headerTitle="Profile Photo">
                <View style={profileStyles.uploadModalContainer}>
                    <TouchableOpacity style={profileStyles.uploadOption} onPress={handleCamera}>
                        <Text style={profileStyles.uploadOptionIcon}>📷</Text>
                        <Text style={profileStyles.uploadOptionText}>Take Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={profileStyles.uploadOption} onPress={handleGallery}>
                        <Text style={profileStyles.uploadOptionIcon}>🖼️</Text>
                        <Text style={profileStyles.uploadOptionText}>Choose from Gallery</Text>
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
