import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    TextInput,
    TouchableOpacity,
    Image,
    InteractionManager,
} from 'react-native';
import {
    launchImageLibrary,
    launchCamera,
    ImagePickerResponse,
    MediaType,
    PhotoQuality,
} from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../../../store';
import { connect } from 'react-redux';
import { registerActions_dispatch } from '../../../../store/action/mainTypedAction';
import { loginStyles } from '../../../assets/css/loginStyles';
import { registerStyles } from '../../../assets/css/registerStyles';
import SODTextInput from '../../../components/SODTextInput';
import SODDropDown from '../../../components/SODDropDown';
import { Character_Limit } from '../../../utils/common';
import { regex_validation, Regex_Patterns } from '../../../utils/regex';
import Layout from '../../../assets/css/layout';
import BSModal from '../../../components/BSModal';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../../../navigations/navigation';
import { getFcmToken } from '../../../utils/FirebaseNotifications';

const Register = (props: any) => {
    const insets = useSafeAreaInsets();
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [profileImage, setProfileImage] = useState<any>(null);
    const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

    // Mobile verification states
    const [isMobileVerified, setIsMobileVerified] = useState(true);
    const [otpCode, setOtpCode] = useState('');
    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    // Document upload states
    const [aadharFront, setAadharFront] = useState<any>(null);
    const [aadharBack, setAadharBack] = useState<any>(null);
    const [gstCertificate, setGstCertificate] = useState<any>(null);
    const [panCard, setPanCard] = useState<any>(null);

    // Modal refs
    const otpModalRef = useRef<BottomSheetModal>(null);
    const photoUploadModalRef = useRef<BottomSheetModal>(null);
    const documentUploadModalRef = useRef<BottomSheetModal>(null);

    // Current document being uploaded
    const [currentDocumentType, setCurrentDocumentType] = useState<
        | 'profile'
        | 'aadharFront'
        | 'aadharBack'
        | 'gstCertificate'
        | 'panCard'
        | null
    >(null);

    // Service types state - will be filled from API
    const [serviceTypes, setServiceTypes] = useState<string[]>([]);
    const [serviceTypesWithCheckbox, setServiceTypesWithCheckbox] = useState<
        { name: string; isChecked: boolean; id: string | number }[]
    >([]);
    // Country list state - will be filled from API
    const [countries, setCountries] = useState<
        { CountryID: string | number; CountryName: string }[]
    >([]);
    // State list state - will be filled from API
    const [states, setStates] = useState<
        { StateID: string | number; StateName: string }[]
    >([]);
    // City list state - will be filled from API
    const [cities, setCities] = useState<
        { CityID: string | number; CityName: string }[]
    >([]);

    const formMethods = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            mobileNumber: '',
            alternateMobileNumber: '',
            address: '',
            companyName: '',
            gstin: '',
            serviceType: '',
            country: '',
            state: '',
            city: '',
            previousService: [],
            count: 0,
            firstSelectedName: '',
        },
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        clearErrors,
        trigger,
        setValue,
        getValues,
    } = formMethods;

    console.log('getValues', getValues());

    // Load service types and country list on component mount
    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            loadServiceTypes();
            loadCountryList();
        });
        return () => {
            task.cancel();
        };
    }, []);

    // Initialize count when serviceTypesWithCheckbox is loaded
    useEffect(() => {
        if (serviceTypesWithCheckbox.length > 0) {
            const initialCount = serviceTypesWithCheckbox.filter(
                (item: any) => item.isChecked,
            ).length;
            console.log('Initial count set to:', initialCount);
            setValue('count', initialCount);
            setValue('previousService', serviceTypesWithCheckbox as any);
        }
    }, [serviceTypesWithCheckbox]);

    const loadServiceTypes = () => {
        props.registerActions('Get_Service_Types_Api', {
            callBack: (data: any[]) => {
                // Extract service type names from API response
                const types = data.map((item: any) => item.ServiceName);
                setServiceTypes(types);

                // Create checkbox array from API data
                const checkboxData = data.map((item: any) => ({
                    name: item.ServiceName,
                    isChecked: false,
                    id: item.ServiceTypeID,
                }));
                setServiceTypesWithCheckbox(checkboxData);
            },
        });
    };

    const loadCountryList = () => {
        props.registerActions('Get_Country_List_Api', {
            callBack: (data: any[]) => {
                // Extract CountryID and Name from API response
                const countryData = data.map((item: any) => ({
                    CountryID: item.CountryID,
                    CountryName: item.CountryName,
                }));
                setCountries(countryData);

                // Set India as default selected country
                const indiaCountry = countryData.find(
                    (country) => country.CountryName.toLowerCase() === 'india',
                );
                if (indiaCountry) {
                    setValue('country', indiaCountry.CountryName);
                    // Load states for India by default
                    loadStateList(indiaCountry.CountryID);
                }
            },
        });
    };

    const loadStateList = (countryId: string | number) => {
        props.registerActions('Get_State_List_Api', {
            countryId: countryId,
            callBack: (data: any[]) => {
                // Extract StateID and StateName from API response
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
                // Extract city names and IDs from API response
                const cityData = data.map((item: any) => ({
                    CityID: item.CityID,
                    CityName: item.CityName || item.Name || item,
                }));
                setCities(cityData);
            },
        });
    };

    // Watch country value and load states when country changes
    const selectedCountry = watch('country');
    useEffect(() => {
        if (selectedCountry && countries.length > 0) {
            // Find the country by name to get CountryID
            const selectedCountryData = countries.find(
                (country) => country.CountryName === selectedCountry,
            );
            if (selectedCountryData) {
                loadStateList(selectedCountryData.CountryID);
                // Clear state and city when country changes
                setValue('state', '');
                setValue('city', '');
                setStates([]);
                setCities([]);
            }
        }
    }, [selectedCountry, countries.length]);

    // Watch state value and load cities when state changes
    const selectedState = watch('state');
    useEffect(() => {
        if (selectedState && states.length > 0) {
            // Find the state by name to get StateID
            const selectedStateData = states.find(
                (state) => state.StateName === selectedState,
            );
            if (selectedStateData) {
                loadCityList(selectedStateData.StateID);
                // Clear city when state changes
                setValue('city', '');
            }
        }
    }, [selectedState, states.length]);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // Watch all form values to check if mandatory fields are filled
    const watchedValues = watch();

    // Check if all mandatory fields are filled
    const areMandatoryFieldsFilled = () => {
        const mandatoryTextFields: (keyof typeof watchedValues)[] = [
            'name',
            'email',
            'password',
            'mobileNumber',
            'address',
            'companyName',
            'country',
            'state',
            'city',
        ];

        const allTextFieldsFilled = mandatoryTextFields.every((field) => {
            const value = watchedValues[field];
            return typeof value === 'string' && value.trim() !== '';
        });

        // Check if at least one service is selected
        const servicesSelected = (watchedValues.count || 0) > 0;

        return allTextFieldsFilled && servicesSelected;
    };

    // Check if all form validations are passing (no errors)
    const areAllValidationsPassing = () => {
        return Object.keys(errors).length === 0;
    };

    // Check if all required documents are uploaded
    const areDocumentsUploaded = () => {
        const gstValue = watchedValues.gstin;
        const hasGst = gstValue && gstValue.trim() !== '';

        // Aadhar card (front and back) is always required
        const aadharUploaded = aadharFront && aadharBack;

        // GST certificate if GST is provided, otherwise PAN card
        const additionalDocUploaded = hasGst ? gstCertificate : panCard;

        return aadharUploaded && additionalDocUploaded;
    };

    // Check if signup button should be enabled
    const isSignupEnabled =
        areMandatoryFieldsFilled() &&
        acceptTerms &&
        areAllValidationsPassing() &&
        isMobileVerified &&
        areDocumentsUploaded();

    // Mobile verification functions
    const handleSendOTP = async () => {
        const mobileNumber = watchedValues.mobileNumber;
        if (!mobileNumber || !regex_validation('indiaMobile', mobileNumber)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Mobile Number',
                text2: 'Please enter a valid 10-digit mobile number',
            });
            return;
        }

        setOtpSending(true);
        try {
            // Simulate API call to send OTP
            await new Promise((resolve) => setTimeout(resolve, 2000));

            setOtpSent(true);
            setOtpCode('');

            // Open the modal
            otpModalRef.current?.present();

            Toast.show({
                type: 'success',
                text1: 'OTP Sent',
                text2: `OTP sent to ${mobileNumber}`,
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Failed to Send OTP',
                text2: 'Please try again',
            });
        } finally {
            setOtpSending(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otpCode || otpCode.length !== 6) {
            Toast.show({
                type: 'error',
                text1: 'Invalid OTP',
                text2: 'Please enter a 6-digit OTP',
            });
            return;
        }

        setOtpVerifying(true);
        try {
            // Simulate API call to verify OTP
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // For demo purposes, accept any 6-digit OTP
            if (otpCode.length === 6) {
                setIsMobileVerified(true);
                setOtpCode('');

                // Close the modal
                otpModalRef.current?.dismiss();

                Toast.show({
                    type: 'success',
                    text1: 'Mobile Verified',
                    text2: 'Your mobile number has been verified successfully',
                });
            } else {
                throw new Error('Invalid OTP');
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Verification Failed',
                text2: 'Invalid OTP. Please try again.',
            });
        } finally {
            setOtpVerifying(false);
        }
    };

    const handleResendOTP = async () => {
        await handleSendOTP();
    };

    // Document upload functions
    // Open document upload modal
    const handleDocumentUpload = (
        documentType:
            | 'aadharFront'
            | 'aadharBack'
            | 'gstCertificate'
            | 'panCard',
    ) => {
        setCurrentDocumentType(documentType);
        documentUploadModalRef.current?.present();
    };

    // Handle camera selection for documents
    const handleDocumentCamera = () => {
        documentUploadModalRef.current?.dismiss();
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8 as PhotoQuality,
        };

        setTimeout(() => {
            launchCamera(options, (response: ImagePickerResponse) => {
                if (response.didCancel || response.errorMessage) {
                    return;
                }
                if (response.assets && response.assets[0]) {
                    const asset = response.assets[0];
                    switch (currentDocumentType) {
                        case 'aadharFront':
                            setAadharFront(asset);
                            break;
                        case 'aadharBack':
                            setAadharBack(asset);
                            break;
                        case 'gstCertificate':
                            setGstCertificate(asset);
                            break;
                        case 'panCard':
                            setPanCard(asset);
                            break;
                    }
                }
            });
        }, 300);
    };

    // Handle gallery selection for documents
    const handleDocumentGallery = () => {
        documentUploadModalRef.current?.dismiss();
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8 as PhotoQuality,
        };

        setTimeout(() => {
            launchImageLibrary(options, (response: ImagePickerResponse) => {
                if (response.didCancel || response.errorMessage) {
                    return;
                }
                if (response.assets && response.assets[0]) {
                    const asset = response.assets[0];
                    switch (currentDocumentType) {
                        case 'aadharFront':
                            setAadharFront(asset);
                            break;
                        case 'aadharBack':
                            setAadharBack(asset);
                            break;
                        case 'gstCertificate':
                            setGstCertificate(asset);
                            break;
                        case 'panCard':
                            setPanCard(asset);
                            break;
                    }
                }
            });
        }, 300);
    };

    // Handle remove document
    const handleRemoveDocument = (
        documentType:
            | 'aadharFront'
            | 'aadharBack'
            | 'gstCertificate'
            | 'panCard',
    ) => {
        switch (documentType) {
            case 'aadharFront':
                setAadharFront(null);
                break;
            case 'aadharBack':
                setAadharBack(null);
                break;
            case 'gstCertificate':
                setGstCertificate(null);
                break;
            case 'panCard':
                setPanCard(null);
                break;
        }
    };

    // Open profile photo upload modal
    const handleProfilePhotoUpload = () => {
        setCurrentDocumentType('profile');
        photoUploadModalRef.current?.present();
    };

    // Handle camera selection for profile photo
    const handleProfileCamera = () => {
        photoUploadModalRef.current?.dismiss();
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8 as PhotoQuality,
        };

        setTimeout(() => {
            launchCamera(options, (response: ImagePickerResponse) => {
                if (response.didCancel || response.errorMessage) {
                    return;
                }
                if (response.assets && response.assets[0]) {
                    setProfileImage(response.assets[0]);
                }
            });
        }, 300);
    };

    // Handle gallery selection for profile photo
    const handleProfileGallery = () => {
        photoUploadModalRef.current?.dismiss();
        const options = {
            mediaType: 'photo' as MediaType,
            includeBase64: true,
            maxHeight: 2000,
            maxWidth: 2000,
            quality: 0.8 as PhotoQuality,
        };

        setTimeout(() => {
            launchImageLibrary(options, (response: ImagePickerResponse) => {
                if (response.didCancel || response.errorMessage) {
                    return;
                }
                if (response.assets && response.assets[0]) {
                    setProfileImage(response.assets[0]);
                }
            });
        }, 300);
    };

    // Handle remove profile photo
    const handleRemovePhoto = () => {
        photoUploadModalRef.current?.dismiss();
        setProfileImage(null);
    };

    // Get document title for modal
    const getDocumentTitle = () => {
        switch (currentDocumentType) {
            case 'profile':
                return 'Upload Profile Photo';
            case 'aadharFront':
                return 'Upload Aadhar Front';
            case 'aadharBack':
                return 'Upload Aadhar Back';
            case 'gstCertificate':
                return 'Upload GST Certificate';
            case 'panCard':
                return 'Upload PAN Card';
            default:
                return 'Upload Document';
        }
    };

    const getImageType = (type?: string) => {
        if (!type) {
            return '';
        }
        const parts = type.split('/');
        return parts.length > 1 ? parts[1] : type;
    };

    const onSignupPress = async (formData: any) => {
        setSubmitting(true);
        try {
            if (!isSignupEnabled) {
                let missingMessage = 'Please fill all mandatory fields.';

                if (!areMandatoryFieldsFilled()) {
                    if ((watchedValues.count || 0) === 0) {
                        missingMessage = 'Please select at least one service type.';
                    } else {
                        missingMessage = 'Please fill all mandatory personal and company details.';
                    }
                } else if (!acceptTerms) {
                    missingMessage = 'Please accept the Terms and Conditions.';
                } else if (!areAllValidationsPassing()) {
                    missingMessage = 'Please fix the errors in the form.';
                } else if (!isMobileVerified) {
                    missingMessage = 'Mobile number verification is required.';
                } else if (!areDocumentsUploaded()) {
                    const hasGst = watchedValues.gstin && watchedValues.gstin.trim() !== '';
                    if (!aadharFront || !aadharBack) {
                        missingMessage = 'Please upload both front and back of Aadhar card.';
                    } else if (hasGst && !gstCertificate) {
                        missingMessage = 'Please upload GST Certificate.';
                    } else if (!hasGst && !panCard) {
                        missingMessage = 'Please upload PAN Card.';
                    }
                }

                Toast.show({
                    type: 'error',
                    text1: 'Incomplete Form',
                    text2: missingMessage,
                });
                setSubmitting(false);
                return;
            }

            const countryData = countries.find(
                (c) => c.CountryName === formData.country,
            );
            const stateData = states.find(
                (s) => s.StateName === formData.state,
            );
            const cityData = cities.find((c) => c.CityName === formData.city);

            const selectedServices = (formData.previousService || [])
                .filter((s: any) => s.isChecked)
                .map((s: any) => String(s.id));

            const registerData = {
                data: [
                    {
                        Name: formData.name,
                        EmailID: formData.email,
                        Password: formData.password,
                        MobileNo: formData.mobileNumber,
                        AltMobileNo: formData.alternateMobileNumber || '',
                        CompanyName: formData.companyName,
                        GstNo: formData.gstin || '',
                        Address: formData.address,
                        UserType: 'P',

                        CountryID: String(countryData?.CountryID || ''),
                        StateID: String(stateData?.StateID || ''),
                        CityID: String(cityData?.CityID || ''),
                        RoleID: '1',
                        IsActive: '0',

                        FCMTokenID: (await getFcmToken()) || '',

                        ServiceTypeList: selectedServices,

                        ProfileImageType: getImageType(profileImage?.type),
                        ProfileImageBase64: profileImage?.base64 || '',

                        PanImageType: getImageType(panCard?.type),
                        PanImageBase64: panCard?.base64 || '',

                        GstFileType: getImageType(gstCertificate?.type),
                        GstFileBase64: gstCertificate?.base64 || '',

                        AadhaarFrontImageType: getImageType(aadharFront?.type),
                        AadhaarFrontImageBase64: aadharFront?.base64 || '',

                        AadhaarBackImageType: getImageType(aadharBack?.type),
                        AadhaarBackImageBase64: aadharBack?.base64 || '',
                    },
                ],
            };

            props.registerActions('Vendor_Registration_Api', {
                data: registerData,
                callBack: (response: any) => {
                    setSubmitting(false);
                    if (response && response.status === 'success') {
                        Toast.show({
                            type: 'success',
                            text1: 'Registration Successful',
                            text2: response?.msg || 'Redirecting to login...',
                        });
                        setTimeout(() => {
                            navigation.navigate('Login' as any);
                        }, 2000);
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Registration Failed',
                            text2: response?.msg || 'Please try again later',
                        });
                    }
                },
            });
        } catch (error) {
            setSubmitting(false);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An unexpected error occurred',
            });
        }
    };

    return (
        <View style={loginStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
            <LinearGradient
                colors={['#5F60B9', '#8A8BDD', '#B5B6E8', '#E6E5F7', '#FFFFFF']}
                style={loginStyles.gradientBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.3 }}>
                {/* Background decorative circles */}
                <View style={loginStyles.backgroundCircle1} />
                <View style={loginStyles.backgroundCircle2} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={insets.top}
                    style={[Layout.viewHeight]}>
                    <ScrollView
                        contentContainerStyle={
                            registerPageStyles.scrollContainer
                        }
                        contentInsetAdjustmentBehavior="automatic"
                        contentInset={{
                            top: insets.top,
                            bottom: insets.bottom,
                        }}
                        showsVerticalScrollIndicator={false}
                        scrollIndicatorInsets={{
                            top: insets.top,
                            bottom: insets.bottom,
                        }}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode={
                            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
                        }>
                        {/* Header */}
                        <View style={[registerPageStyles.headerContainer, { paddingTop: insets.top + 20 }]}>
                            <Text style={registerPageStyles.title}>
                                Partner Registration
                            </Text>
                            <Text style={registerPageStyles.subtitle}>
                                Join SOD Partner Network
                            </Text>
                        </View>

                        {/* Form Card */}
                        <View style={registerPageStyles.formCard}>
                            {/* Profile Photo Upload Section */}
                            <View style={styles.profilePhotoContainer}>
                                <Text style={styles.profilePhotoLabel}>
                                    Profile Photo{' '}
                                    {profileImage ? '(Optional)' : ''}
                                </Text>
                                <TouchableOpacity
                                    style={styles.profilePhotoButton}
                                    onPress={handleProfilePhotoUpload}
                                    activeOpacity={0.8}>
                                    {profileImage ? (
                                        <Image
                                            source={{ uri: profileImage?.uri }}
                                            style={styles.profileImage}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View
                                            style={
                                                styles.profilePhotoPlaceholder
                                            }>
                                            <Text
                                                style={styles.profilePhotoIcon}>
                                                📷
                                            </Text>
                                            <Text
                                                style={styles.profilePhotoText}>
                                                Add Photo
                                            </Text>
                                        </View>
                                    )}
                                    <View style={styles.profilePhotoOverlay}>
                                        <Text
                                            style={
                                                styles.profilePhotoOverlayIcon
                                            }>
                                            {profileImage ? '✏️' : '+'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {profileImage && (
                                    <TouchableOpacity
                                        style={styles.removePhotoButton}
                                        onPress={handleRemovePhoto}
                                        activeOpacity={0.7}>
                                        <Text style={styles.removePhotoText}>
                                            Remove Photo
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <FormProvider {...formMethods}>
                                {/* Name Input */}
                                <Controller
                                    control={control}
                                    name="name"
                                    rules={{
                                        required: 'Name is required',
                                        validate: (value) => {
                                            if (
                                                !regex_validation('name', value)
                                            ) {
                                                return 'Please enter a valid name';
                                            }
                                            return true;
                                        },
                                    }}
                                    render={({
                                        field: { onChange, value, ref, onBlur },
                                        fieldState: { error },
                                    }) => (
                                        <SODTextInput
                                            ref={ref}
                                            title="name"
                                            placeholder="Enter Full Name"
                                            placeholderTextColor="#8F8F8F"
                                            onChangeText={(text: string) => {
                                                onChange(text);
                                                clearErrors('name');
                                            }}
                                            onBlurText={() => {
                                                trigger('name');
                                            }}
                                            value={value}
                                            required={true}
                                            errorMsg={error?.message}
                                            name="name"
                                            maxlength={Character_Limit.name}
                                            keyboard={'default'}
                                            isEditable={true}
                                            disallowUnicode={true}
                                        />
                                    )}
                                />

                                {/* Email Input */}
                                <Controller
                                    control={control}
                                    name="email"
                                    rules={{
                                        required: 'Email is required',
                                        validate: (value) => {
                                            if (
                                                !regex_validation(
                                                    'email',
                                                    value,
                                                )
                                            ) {
                                                return 'Please enter a valid email address';
                                            }
                                            return true;
                                        },
                                    }}
                                    render={({
                                        field: { onChange, value, ref, onBlur },
                                        fieldState: { error },
                                    }) => (
                                        <SODTextInput
                                            ref={ref}
                                            title="email"
                                            placeholder="Enter Email"
                                            placeholderTextColor="#8F8F8F"
                                            onChangeText={(text: string) => {
                                                onChange(text);
                                                clearErrors('email');
                                            }}
                                            onBlurText={() => {
                                                trigger('email');
                                            }}
                                            value={value}
                                            required={true}
                                            errorMsg={error?.message}
                                            name="email"
                                            maxlength={Character_Limit.email}
                                            keyboard={'email-address'}
                                            isEditable={true}
                                            disallowUnicode={true}
                                            autoCapitalize="none"
                                        />
                                    )}
                                />

                                {/* Password Input */}
                                <Controller
                                    control={control}
                                    name="password"
                                    rules={{
                                        required: 'Password is required',
                                        validate: (value) => {
                                            if (
                                                !regex_validation(
                                                    'password',
                                                    value,
                                                )
                                            ) {
                                                return 'Password must be at least 6 characters';
                                            }
                                            return true;
                                        },
                                    }}
                                    render={({
                                        field: { onChange, value, ref, onBlur },
                                        fieldState: { error },
                                    }) => (
                                        <View style={{ position: 'relative' }}>
                                            <SODTextInput
                                                ref={ref}
                                                title="password"
                                                placeholder="Enter Password"
                                                placeholderTextColor="#8F8F8F"
                                                onChangeText={(
                                                    text: string,
                                                ) => {
                                                    onChange(text);
                                                    clearErrors('password');
                                                }}
                                                onBlurText={() => {
                                                    trigger('password');
                                                }}
                                                value={value}
                                                required={true}
                                                errorMsg={error?.message}
                                                name="password"
                                                maxlength={
                                                    Character_Limit.password
                                                }
                                                keyboard={'default'}
                                                isEditable={true}
                                                disallowUnicode={true}
                                                secureTextEntry={
                                                    isPasswordSecure
                                                }
                                            />
                                            <TouchableOpacity
                                                style={{
                                                    position: 'absolute',
                                                    right: 12,
                                                    top: '50%',
                                                    transform: [
                                                        { translateY: -15 },
                                                    ],
                                                    padding: 2,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() =>
                                                    setIsPasswordSecure(
                                                        !isPasswordSecure,
                                                    )
                                                }>
                                                <Text
                                                    style={{
                                                        color: '#8F8F8F',
                                                    }}>
                                                    {isPasswordSecure
                                                        ? '👁️'
                                                        : '👁️‍🗨️'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />

                                {/* Mobile Number Input */}
                                <Controller
                                    control={control}
                                    name="mobileNumber"
                                    rules={{
                                        required: 'Mobile number is required',
                                        validate: (value) => {
                                            if (
                                                !regex_validation(
                                                    'indiaMobile',
                                                    value,
                                                )
                                            ) {
                                                return 'Please enter a valid 10-digit mobile number';
                                            }
                                            return true;
                                        },
                                    }}
                                    render={({
                                        field: { onChange, value, ref, onBlur },
                                        fieldState: { error },
                                    }) => (
                                        <View>
                                            <SODTextInput
                                                ref={ref}
                                                title="mobileNumber"
                                                placeholder="Enter Mobile Number"
                                                placeholderTextColor="#8F8F8F"
                                                onChangeText={(
                                                    text: string,
                                                ) => {
                                                    onChange(text);
                                                    clearErrors('mobileNumber');
                                                    // Reset verification status if mobile number changes
                                                    // if (isMobileVerified) {
                                                    //     setIsMobileVerified(
                                                    //         false,
                                                    //     );
                                                    // }
                                                }}
                                                onBlurText={() => {
                                                    trigger('mobileNumber');
                                                }}
                                                value={value}
                                                required={true}
                                                errorMsg={error?.message}
                                                name="mobileNumber"
                                                maxlength={
                                                    Character_Limit.mobile
                                                }
                                                keyboard={'numeric'}
                                                isEditable={true}
                                                disallowUnicode={true}
                                            />

                                            {/* Mobile Verification Section */}
                                            {/* {value &&
                                                !error &&
                                                regex_validation(
                                                    'indiaMobile',
                                                    value,
                                                ) && (
                                                    <View
                                                        style={
                                                            styles.mobileVerificationContainer
                                                        }>
                                                        {isMobileVerified ? (
                                                            <View
                                                                style={
                                                                    styles.verifiedContainer
                                                                }>
                                                                <Text
                                                                    style={
                                                                        styles.verifiedText
                                                                    }>
                                                                    ✓ Verified
                                                                </Text>
                                                                <Text
                                                                    style={
                                                                        styles.verifiedSubText
                                                                    }>
                                                                    Mobile
                                                                    number
                                                                    verified
                                                                    successfully
                                                                </Text>
                                                            </View>
                                                        ) : (
                                                            <TouchableOpacity
                                                                style={[
                                                                    styles.verifyButton,
                                                                    otpSending &&
                                                                    styles.verifyButtonDisabled,
                                                                ]}
                                                                onPress={
                                                                    handleSendOTP
                                                                }
                                                                disabled={
                                                                    otpSending
                                                                }
                                                                activeOpacity={
                                                                    0.7
                                                                }>
                                                                <Text
                                                                    style={[
                                                                        styles.verifyButtonText,
                                                                        otpSending &&
                                                                        styles.verifyButtonTextDisabled,
                                                                    ]}>
                                                                    {otpSending
                                                                        ? 'Sending...'
                                                                        : 'Verify'}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                )} */}
                                        </View>
                                    )}
                                />

                                {/* Alternate Mobile Number Input */}
                                <Controller
                                    control={control}
                                    name="alternateMobileNumber"
                                    rules={{
                                        validate: (value) => {
                                            if (
                                                value &&
                                                !regex_validation(
                                                    'indiaMobile',
                                                    value,
                                                )
                                            ) {
                                                return 'Please enter a valid 10-digit mobile number';
                                            }
                                            return true;
                                        },
                                    }}
                                    render={({
                                        field: { onChange, value, ref, onBlur },
                                        fieldState: { error },
                                    }) => (
                                        <SODTextInput
                                            ref={ref}
                                            title="alternateMobileNumber"
                                            placeholder="Enter Alt Mobile No. (Optional)"
                                            placeholderTextColor="#8F8F8F"
                                            onChangeText={(text: string) => {
                                                onChange(text);
                                                clearErrors(
                                                    'alternateMobileNumber',
                                                );
                                            }}
                                            onBlurText={() => {
                                                trigger(
                                                    'alternateMobileNumber',
                                                );
                                            }}
                                            value={value}
                                            required={false}
                                            errorMsg={error?.message}
                                            name="alternateMobileNumber"
                                            maxlength={Character_Limit.mobile}
                                            keyboard={'numeric'}
                                            isEditable={true}
                                            disallowUnicode={true}
                                        />
                                    )}
                                />

                                {/* Address Input */}
                                <Controller
                                    control={control}
                                    name="address"
                                    rules={{
                                        required: 'Address is required',
                                    }}
                                    render={({
                                        field: { onChange, value, ref, onBlur },
                                        fieldState: { error },
                                    }) => (
                                        <SODTextInput
                                            ref={ref}
                                            title="address"
                                            placeholder="Enter Address"
                                            placeholderTextColor="#8F8F8F"
                                            onChangeText={(text: string) => {
                                                onChange(text);
                                                clearErrors('address');
                                            }}
                                            onBlurText={() => {
                                                trigger('address');
                                            }}
                                            value={value}
                                            required={true}
                                            errorMsg={error?.message}
                                            name="address"
                                            maxlength={Character_Limit.address}
                                            keyboard={'default'}
                                            isEditable={true}
                                            disallowUnicode={true}
                                        />
                                    )}
                                />

                                {/* Company Name Input */}
                                <Controller
                                    control={control}
                                    name="companyName"
                                    rules={{
                                        required: 'Company name is required',
                                    }}
                                    render={({
                                        field: { onChange, value, ref, onBlur },
                                        fieldState: { error },
                                    }) => (
                                        <SODTextInput
                                            ref={ref}
                                            title="companyName"
                                            placeholder="Enter Company Name"
                                            placeholderTextColor="#8F8F8F"
                                            onChangeText={(text: string) => {
                                                onChange(text);
                                                clearErrors('companyName');
                                            }}
                                            onBlurText={() => {
                                                trigger('companyName');
                                            }}
                                            value={value}
                                            required={true}
                                            errorMsg={error?.message}
                                            name="companyName"
                                            maxlength={
                                                Character_Limit.companyName
                                            }
                                            keyboard={'default'}
                                            isEditable={true}
                                            disallowUnicode={true}
                                        />
                                    )}
                                />

                                {/* GSTIN Input */}
                                <Controller
                                    control={control}
                                    name="gstin"
                                    rules={{
                                        validate: (value) => {
                                            if (
                                                value &&
                                                !regex_validation(
                                                    'gstin',
                                                    value,
                                                )
                                            ) {
                                                return 'Please enter a valid GSTIN';
                                            }
                                            return true;
                                        },
                                    }}
                                    render={({
                                        field: { onChange, value, ref, onBlur },
                                        fieldState: { error },
                                    }) => (
                                        <SODTextInput
                                            ref={ref}
                                            title="gstin"
                                            placeholder="Enter GSTIN (Optional)"
                                            placeholderTextColor="#8F8F8F"
                                            onChangeText={(text: string) => {
                                                onChange(text);
                                                clearErrors('gstin');
                                            }}
                                            onBlurText={() => {
                                                trigger('gstin');
                                            }}
                                            value={value}
                                            required={false}
                                            errorMsg={error?.message}
                                            name="gstin"
                                            maxlength={Character_Limit.gstin}
                                            keyboard={'default'}
                                            isEditable={true}
                                            disallowUnicode={true}
                                            autoCapitalize={'characters'}
                                        />
                                    )}
                                />
                                {/* Select Service Type Dropdown with Checkbox */}
                                <Controller
                                    control={control}
                                    name="firstSelectedName"
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => {
                                        // Calculate display value based on count
                                        const getDisplayValue = () => {
                                            const count =
                                                watchedValues.count || 0;
                                            if (count === 0) {
                                                return 'Service Types';
                                            } else if (count === 1) {
                                                return (
                                                    watchedValues.firstSelectedName ||
                                                    '1 service selected'
                                                );
                                            } else {
                                                return `${count} services selected`;
                                            }
                                        };

                                        return (
                                            <SODDropDown
                                                title="Service Types"
                                                value={getDisplayValue()}
                                                required={true}
                                                name="previousService"
                                                disabled={false}
                                                type="BSModal"
                                                ischeckBoxReq={true}
                                                errorMsg={error?.message}
                                                dropDownFormData={
                                                    serviceTypesWithCheckbox
                                                }
                                            />
                                        );
                                    }}
                                />

                                {/* Selected Service Types Display */}
                                {watchedValues.previousService &&
                                    watchedValues.count > 0 && (
                                        <View
                                            style={
                                                styles.selectedItemsContainer
                                            }>
                                            <Text
                                                style={
                                                    styles.selectedItemsTitle
                                                }>
                                                Selected Service Types (
                                                {watchedValues.count})
                                            </Text>
                                            <View
                                                style={
                                                    styles.selectedItemsList
                                                }>
                                                {watchedValues.previousService
                                                    .filter(
                                                        (item: any) =>
                                                            item.isChecked,
                                                    )
                                                    .map(
                                                        (
                                                            item: any,
                                                            index: number,
                                                        ) => (
                                                            <View
                                                                key={index}
                                                                style={
                                                                    styles.selectedItem
                                                                }>
                                                                <Text
                                                                    style={
                                                                        styles.selectedItemText
                                                                    }>
                                                                    {item.name}
                                                                </Text>
                                                                <TouchableOpacity
                                                                    style={
                                                                        styles.removeItemButton
                                                                    }
                                                                    onPress={() => {
                                                                        const updatedItems: any[] =
                                                                            [
                                                                                ...(watchedValues.previousService as any[]),
                                                                            ];
                                                                        const itemIndex =
                                                                            updatedItems.findIndex(
                                                                                (
                                                                                    serviceItem: any,
                                                                                ) =>
                                                                                    serviceItem.name ===
                                                                                    item.name,
                                                                            );
                                                                        if (
                                                                            itemIndex !==
                                                                            -1
                                                                        ) {
                                                                            updatedItems[
                                                                                itemIndex
                                                                            ].isChecked =
                                                                                false;
                                                                            setValue(
                                                                                'previousService',
                                                                                updatedItems as any,
                                                                            );

                                                                            // Calculate count from checked items
                                                                            const checkedCount =
                                                                                updatedItems.filter(
                                                                                    (
                                                                                        serviceItem: any,
                                                                                    ) =>
                                                                                        serviceItem.isChecked,
                                                                                ).length;
                                                                            console.log(
                                                                                'Remove item - Updated count:',
                                                                                checkedCount,
                                                                                'for item:',
                                                                                item.name,
                                                                            );
                                                                            setValue(
                                                                                'count',
                                                                                checkedCount,
                                                                            );

                                                                            // Update first selected name
                                                                            const firstChecked =
                                                                                updatedItems.find(
                                                                                    (
                                                                                        serviceItem: any,
                                                                                    ) =>
                                                                                        serviceItem.isChecked,
                                                                                );
                                                                            setValue(
                                                                                'firstSelectedName',
                                                                                firstChecked
                                                                                    ? firstChecked.name
                                                                                    : '',
                                                                            );
                                                                        }
                                                                    }}>
                                                                    <Text
                                                                        style={
                                                                            styles.removeItemText
                                                                        }>
                                                                        ×
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        ),
                                                    )}
                                            </View>
                                        </View>
                                    )}

                                {/* Country Dropdown */}
                                <Controller
                                    control={control}
                                    name="country"
                                    rules={{
                                        required: 'Country is required',
                                    }}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <SODDropDown
                                            title="Country"
                                            value={value || 'Select Country'}
                                            required={true}
                                            name="country"
                                            disabled={false}
                                            type="BSModal"
                                            errorMsg={error?.message}
                                            dropDownFormData={countries.map(
                                                (country) =>
                                                    country.CountryName,
                                            )}
                                        />
                                    )}
                                />

                                {/* State Dropdown */}
                                <Controller
                                    control={control}
                                    name="state"
                                    rules={{
                                        required: 'State is required',
                                    }}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <SODDropDown
                                            title="State"
                                            value={value || 'Select State'}
                                            required={true}
                                            name="state"
                                            disabled={false}
                                            type="BSModal"
                                            errorMsg={error?.message}
                                            dropDownFormData={states.map(
                                                (state) => state.StateName,
                                            )}
                                        />
                                    )}
                                />

                                {/* City Dropdown */}
                                <Controller
                                    control={control}
                                    name="city"
                                    rules={{
                                        required: 'City is required',
                                    }}
                                    render={({
                                        field: { onChange, value },
                                        fieldState: { error },
                                    }) => (
                                        <SODDropDown
                                            title="City"
                                            value={value || 'Select City'}
                                            required={true}
                                            name="city"
                                            disabled={false}
                                            type="BSModal"
                                            errorMsg={error?.message}
                                            dropDownFormData={cities.map(
                                                (city) => city.CityName,
                                            )}
                                        />
                                    )}
                                />

                                {/* Address Proof Documents Section */}
                                <View style={styles.documentsSection}>
                                    <Text style={styles.documentsSectionTitle}>
                                        Address Proof Documents
                                    </Text>
                                    <Text
                                        style={styles.documentsSectionSubtitle}>
                                        Please upload the required documents for
                                        verification
                                    </Text>

                                    {/* Aadhar Card Upload */}
                                    <View
                                        style={styles.documentUploadContainer}>
                                        <Text style={styles.documentTitle}>
                                            Aadhar Card{' '}
                                            <Text style={styles.required}>
                                                *
                                            </Text>
                                        </Text>
                                        <Text style={styles.documentSubtitle}>
                                            Upload both front and back side of
                                            Aadhar card
                                        </Text>

                                        <View style={styles.aadharUploadRow}>
                                            {/* Aadhar Front */}
                                            <View
                                                style={
                                                    styles.documentUploadItem
                                                }>
                                                <TouchableOpacity
                                                    style={
                                                        styles.documentUploadButton
                                                    }
                                                    onPress={() =>
                                                        handleDocumentUpload(
                                                            'aadharFront',
                                                        )
                                                    }
                                                    activeOpacity={0.8}>
                                                    {aadharFront ? (
                                                        <Image
                                                            source={{
                                                                uri: aadharFront?.uri,
                                                            }}
                                                            style={
                                                                styles.documentPreview
                                                            }
                                                            resizeMode="cover"
                                                        />
                                                    ) : (
                                                        <View
                                                            style={
                                                                styles.documentPlaceholder
                                                            }>
                                                            <Text
                                                                style={
                                                                    styles.documentIcon
                                                                }>
                                                                📄
                                                            </Text>
                                                            <Text
                                                                style={
                                                                    styles.documentPlaceholderText
                                                                }>
                                                                Front
                                                            </Text>
                                                        </View>
                                                    )}
                                                    <View
                                                        style={
                                                            styles.documentOverlay
                                                        }>
                                                        <Text
                                                            style={
                                                                styles.documentOverlayIcon
                                                            }>
                                                            {aadharFront ? '✏️' : '+'}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                                {aadharFront && (
                                                    <TouchableOpacity
                                                        style={
                                                            styles.removeDocumentButton
                                                        }
                                                        onPress={() =>
                                                            handleRemoveDocument(
                                                                'aadharFront',
                                                            )
                                                        }
                                                        activeOpacity={0.7}>
                                                        <Text
                                                            style={
                                                                styles.removeDocumentText
                                                            }>
                                                            Remove
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>

                                            {/* Aadhar Back */}
                                            <View
                                                style={
                                                    styles.documentUploadItem
                                                }>
                                                <TouchableOpacity
                                                    style={
                                                        styles.documentUploadButton
                                                    }
                                                    onPress={() =>
                                                        handleDocumentUpload(
                                                            'aadharBack',
                                                        )
                                                    }
                                                    activeOpacity={0.8}>
                                                    {aadharBack ? (
                                                        <Image
                                                            source={{
                                                                uri: aadharBack?.uri,
                                                            }}
                                                            style={
                                                                styles.documentPreview
                                                            }
                                                            resizeMode="cover"
                                                        />
                                                    ) : (
                                                        <View
                                                            style={
                                                                styles.documentPlaceholder
                                                            }>
                                                            <Text
                                                                style={
                                                                    styles.documentIcon
                                                                }>
                                                                📄
                                                            </Text>
                                                            <Text
                                                                style={
                                                                    styles.documentPlaceholderText
                                                                }>
                                                                Back
                                                            </Text>
                                                        </View>
                                                    )}
                                                    <View
                                                        style={
                                                            styles.documentOverlay
                                                        }>
                                                        <Text
                                                            style={
                                                                styles.documentOverlayIcon
                                                            }>
                                                            {aadharBack ? '✏️' : '+'}
                                                        </Text>
                                                    </View>
                                                </TouchableOpacity>
                                                {aadharBack && (
                                                    <TouchableOpacity
                                                        style={
                                                            styles.removeDocumentButton
                                                        }
                                                        onPress={() =>
                                                            handleRemoveDocument(
                                                                'aadharBack',
                                                            )
                                                        }
                                                        activeOpacity={0.7}>
                                                        <Text
                                                            style={
                                                                styles.removeDocumentText
                                                            }>
                                                            Remove
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                    </View>

                                    {/* Conditional Document Upload */}
                                    <View
                                        style={styles.documentUploadContainer}>
                                        {watchedValues.gstin &&
                                            watchedValues.gstin.trim() !== '' ? (
                                            <>
                                                <Text
                                                    style={
                                                        styles.documentTitle
                                                    }>
                                                    GST Certificate{' '}
                                                    <Text
                                                        style={styles.required}>
                                                        *
                                                    </Text>
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.documentSubtitle
                                                    }>
                                                    Upload GST certificate since
                                                    GST number is provided
                                                </Text>
                                            </>
                                        ) : (
                                            <>
                                                <Text
                                                    style={
                                                        styles.documentTitle
                                                    }>
                                                    PAN Card{' '}
                                                    <Text
                                                        style={styles.required}>
                                                        *
                                                    </Text>
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.documentSubtitle
                                                    }>
                                                    Upload PAN card since no GST
                                                    number is provided
                                                </Text>
                                            </>
                                        )}

                                        <View
                                            style={styles.singleDocumentUpload}>
                                            <TouchableOpacity
                                                style={
                                                    styles.documentUploadButton
                                                }
                                                onPress={() =>
                                                    watchedValues.gstin &&
                                                        watchedValues.gstin.trim() !==
                                                        ''
                                                        ? handleDocumentUpload(
                                                            'gstCertificate',
                                                        )
                                                        : handleDocumentUpload(
                                                            'panCard',
                                                        )
                                                }
                                                activeOpacity={0.8}>
                                                {(
                                                    watchedValues.gstin &&
                                                        watchedValues.gstin.trim() !==
                                                        ''
                                                        ? gstCertificate
                                                        : panCard
                                                ) ? (
                                                    <Image
                                                        source={{
                                                            uri:
                                                                watchedValues.gstin &&
                                                                    watchedValues.gstin.trim() !==
                                                                    ''
                                                                    ? gstCertificate?.uri
                                                                    : panCard?.uri,
                                                        }}
                                                        style={
                                                            styles.documentPreview
                                                        }
                                                        resizeMode="cover"
                                                    />
                                                ) : (
                                                    <View
                                                        style={
                                                            styles.documentPlaceholder
                                                        }>
                                                        <Text
                                                            style={
                                                                styles.documentIcon
                                                            }>
                                                            {watchedValues.gstin &&
                                                                watchedValues.gstin.trim() !==
                                                                ''
                                                                ? '🏢'
                                                                : '💳'}
                                                        </Text>
                                                        <Text
                                                            style={
                                                                styles.documentPlaceholderText
                                                            }>
                                                            {watchedValues.gstin &&
                                                                watchedValues.gstin.trim() !==
                                                                ''
                                                                ? 'GST Certificate'
                                                                : 'PAN Card'}
                                                        </Text>
                                                    </View>
                                                )}
                                                <View
                                                    style={
                                                        styles.documentOverlay
                                                    }>
                                                    <Text
                                                        style={
                                                            styles.documentOverlayIcon
                                                        }>
                                                        {((watchedValues.gstin && watchedValues.gstin.trim() !== '' ? gstCertificate : panCard)) ? '✏️' : '+'}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            {(watchedValues.gstin &&
                                                watchedValues.gstin.trim() !== ''
                                                ? gstCertificate
                                                : panCard) && (
                                                    <TouchableOpacity
                                                        style={
                                                            styles.removeDocumentButton
                                                        }
                                                        onPress={() =>
                                                            watchedValues.gstin &&
                                                                watchedValues.gstin.trim() !==
                                                                ''
                                                                ? handleRemoveDocument(
                                                                    'gstCertificate',
                                                                )
                                                                : handleRemoveDocument(
                                                                    'panCard',
                                                                )
                                                        }
                                                        activeOpacity={0.7}>
                                                        <Text
                                                            style={
                                                                styles.removeDocumentText
                                                            }>
                                                            Remove
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}
                                        </View>
                                    </View>
                                </View>

                                {/* Terms and Conditions Checkbox */}
                                <View style={styles.termsContainer}>
                                    <TouchableOpacity
                                        style={styles.checkboxContainer}
                                        onPress={() =>
                                            setAcceptTerms(!acceptTerms)
                                        }
                                        activeOpacity={0.7}>
                                        <View
                                            style={[
                                                styles.checkbox,
                                                acceptTerms &&
                                                styles.checkboxChecked,
                                            ]}>
                                            {acceptTerms && (
                                                <Text style={styles.checkmark}>
                                                    ✓
                                                </Text>
                                            )}
                                        </View>
                                        <View style={styles.termsTextContainer}>
                                            <Text style={styles.termsText}>
                                                I accept the{' '}
                                                <Text
                                                    style={styles.termsLink}
                                                    onPress={() => {
                                                        navigation.navigate('WebViewScreen', {
                                                            url: 'https://serviceondoors.com/Terms-And-Conditions',
                                                            title: 'Terms and Conditions',
                                                        });
                                                    }}>
                                                    Terms and Conditions
                                                </Text>
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        registerPageStyles.signupButton,
                                        // !isSignupEnabled &&
                                        // styles.disabledButton,
                                    ]}
                                    onPress={handleSubmit(onSignupPress)}
                                    // disabled={submitting || !isSignupEnabled}
                                    disabled={submitting}>
                                    <Text
                                        style={[
                                            registerPageStyles.signupButtonText,
                                            // !isSignupEnabled &&
                                            // styles.disabledButtonText,
                                        ]}>
                                        {submitting
                                            ? 'PROCESSING...'
                                            : 'REGISTER'}
                                    </Text>
                                </TouchableOpacity>
                            </FormProvider>
                        </View>
                        {/* End Form Card */}

                        {/* Sign In Link */}
                        <View style={registerPageStyles.signinContainer}>
                            <Text style={registerPageStyles.signinText}>
                                Already have an account?
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}>
                                <Text style={registerPageStyles.signinLink}>
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>

            {/* OTP Verification Modal */}
            {/* <BSModal
                bsModalRef={otpModalRef}
                index={0}
                snapPoints={['40%']}
                onCloseRequest={() => {
                    setOtpCode('');
                }}
                headerTitle="Verify Mobile Number">
                <View style={styles.otpModalContainer}>
                    <Text style={styles.otpModalTitle}>
                        Enter OTP sent to {watchedValues.mobileNumber}
                    </Text>

                    <View style={styles.otpInputContainer}>
                        <TextInput
                            style={styles.otpInput}
                            value={otpCode}
                            onChangeText={(text) =>
                                setOtpCode(
                                    text.replace(
                                        Regex_Patterns.stripUnicode,
                                        '',
                                    ),
                                )
                            }
                            placeholder="Enter 6-digit OTP"
                            placeholderTextColor="#8F8F8F"
                            keyboardType="numeric"
                            maxLength={6}
                            textAlign="center"
                        />
                    </View>

                    <View style={styles.otpButtonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.otpButton,
                                (!otpCode ||
                                    otpCode.length !== 6 ||
                                    otpVerifying) &&
                                styles.otpButtonDisabled,
                            ]}
                            onPress={handleVerifyOTP}
                            disabled={
                                !otpCode || otpCode.length !== 6 || otpVerifying
                            }
                            activeOpacity={0.7}>
                            <Text
                                style={[
                                    styles.otpButtonText,
                                    (!otpCode ||
                                        otpCode.length !== 6 ||
                                        otpVerifying) &&
                                    styles.otpButtonTextDisabled,
                                ]}>
                                {otpVerifying ? 'Verifying...' : 'Verify OTP'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.resendButton}
                            onPress={handleResendOTP}
                            disabled={otpSending}
                            activeOpacity={0.7}>
                            <Text
                                style={[
                                    styles.resendButtonText,
                                    otpSending &&
                                    styles.resendButtonTextDisabled,
                                ]}>
                                {otpSending ? 'Sending...' : 'Resend OTP'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BSModal> */}

            {/* Profile Photo Upload Modal */}
            <BSModal
                bsModalRef={photoUploadModalRef}
                index={0}
                snapPoints={['35%']}
                headerTitle={
                    profileImage ? 'Profile Photo' : 'Upload Profile Photo'
                }
                headerRightButtonComponent={
                    <TouchableOpacity
                        onPress={() => photoUploadModalRef.current?.dismiss()}
                        style={styles.modalCloseButton}>
                        <Text style={styles.modalCloseText}>✕</Text>
                    </TouchableOpacity>
                }>
                <View style={styles.uploadModalContainer}>
                    <TouchableOpacity
                        style={styles.uploadOption}
                        onPress={handleProfileCamera}
                        activeOpacity={0.7}>
                        <Text style={styles.uploadOptionIcon}>📷</Text>
                        <Text style={styles.uploadOptionText}>Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.uploadOption}
                        onPress={handleProfileGallery}
                        activeOpacity={0.7}>
                        <Text style={styles.uploadOptionIcon}>🖼️</Text>
                        <Text style={styles.uploadOptionText}>
                            Choose from Gallery
                        </Text>
                    </TouchableOpacity>

                    {profileImage && (
                        <TouchableOpacity
                            style={[styles.uploadOption, styles.removeOption]}
                            onPress={handleRemovePhoto}
                            activeOpacity={0.7}>
                            <Text style={styles.uploadOptionIcon}>🗑️</Text>
                            <Text
                                style={[
                                    styles.uploadOptionText,
                                    styles.removeOptionText,
                                ]}>
                                Remove Photo
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </BSModal>

            {/* Document Upload Modal */}
            <BSModal
                bsModalRef={documentUploadModalRef}
                index={0}
                snapPoints={['30%']}
                headerTitle={getDocumentTitle()}
                headerRightButtonComponent={
                    <TouchableOpacity
                        onPress={() =>
                            documentUploadModalRef.current?.dismiss()
                        }
                        style={styles.modalCloseButton}>
                        <Text style={styles.modalCloseText}>✕</Text>
                    </TouchableOpacity>
                }>
                <View style={styles.uploadModalContainer}>
                    <TouchableOpacity
                        style={styles.uploadOption}
                        onPress={handleDocumentCamera}
                        activeOpacity={0.7}>
                        <Text style={styles.uploadOptionIcon}>📷</Text>
                        <Text style={styles.uploadOptionText}>Take Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.uploadOption}
                        onPress={handleDocumentGallery}
                        activeOpacity={0.7}>
                        <Text style={styles.uploadOptionIcon}>🖼️</Text>
                        <Text style={styles.uploadOptionText}>
                            Choose from Gallery
                        </Text>
                    </TouchableOpacity>
                </View>
            </BSModal>
        </View>
    );
};

const registerPageStyles = {
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    headerContainer: {
        alignItems: 'center' as const,
        paddingTop: 50,
        paddingBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: '#FFFFFF',
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500' as const,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 24,
        padding: 20,
        // shadowColor: '#000',
        elevation: 0,
    },
    signinContainer: {
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        marginTop: 24,
        marginBottom: 20,
    },
    signinText: {
        fontSize: 14,
        color: '#666666',
    },
    signinLink: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: '#5F60B9',
        marginLeft: 5,
        textDecorationLine: 'underline' as const,
    },
    signupButton: {
        backgroundColor: '#5F60B9',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center' as const,
        marginTop: 20,
        marginBottom: 10,
        shadowColor: '#5F60B9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    signupButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700' as const,
        letterSpacing: 1,
    },
};

const styles = {
    profilePhotoContainer: {
        alignItems: 'center' as const,
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    profilePhotoLabel: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: '#333',
        marginBottom: 15,
        textAlign: 'center' as const,
    },
    profilePhotoButton: {
        position: 'relative' as const,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F5F5F5',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    profilePhotoPlaceholder: {
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    profilePhotoIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    profilePhotoText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500' as const,
    },
    profilePhotoOverlay: {
        position: 'absolute' as const,
        bottom: 5,
        right: 8,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#5F60B9',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    profilePhotoOverlayIcon: {
        fontSize: 12,
        color: '#FFFFFF',
    },
    removePhotoButton: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FF3B30',
        borderRadius: 20,
        alignSelf: 'center' as const,
    },
    removePhotoText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600' as const,
        textAlign: 'center' as const,
    },
    termsContainer: {
        marginVertical: 15,
        paddingHorizontal: 20,
    },
    checkboxContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#8F8F8F',
        borderRadius: 4,
        marginRight: 12,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        backgroundColor: '#FFFFFF',
    },
    checkboxChecked: {
        backgroundColor: '#5F60B9',
        borderColor: '#5F60B9',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold' as const,
    },
    termsTextContainer: {
        flex: 1,
    },
    termsText: {
        fontSize: 14,
        color: '#333333',
        lineHeight: 20,
    },
    termsLink: {
        color: '#29B6D1',
        textDecorationLine: 'underline' as const,
        fontWeight: '600' as const,
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
        opacity: 0.6,
    },
    disabledButtonText: {
        color: '#666666',
    },
    // Mobile verification styles
    mobileVerificationContainer: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    verifiedContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    verifiedText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '600' as const,
        marginRight: 8,
    },
    verifiedSubText: {
        color: '#4CAF50',
        fontSize: 12,
        flex: 1,
    },
    verifyButton: {
        backgroundColor: '#5F60B9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        alignSelf: 'flex-start' as const,
    },
    verifyButtonDisabled: {
        backgroundColor: '#CCCCCC',
        opacity: 0.6,
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600' as const,
    },
    verifyButtonTextDisabled: {
        color: '#666666',
    },
    // OTP Modal styles
    otpModalContainer: {
        padding: 20,
        alignItems: 'center' as const,
    },
    otpModalTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: '#333333',
        textAlign: 'center' as const,
        marginBottom: 20,
        lineHeight: 22,
    },
    otpInputContainer: {
        width: '100%' as const,
        marginBottom: 20,
    },
    otpInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 18,
        fontWeight: '600' as const,
        backgroundColor: '#FFFFFF',
        color: '#333333',
    },
    otpButtonContainer: {
        width: '100%' as const,
        gap: 12,
    },
    otpButton: {
        backgroundColor: '#5F60B9',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center' as const,
    },
    otpButtonDisabled: {
        backgroundColor: '#CCCCCC',
        opacity: 0.6,
    },
    otpButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600' as const,
    },
    otpButtonTextDisabled: {
        color: '#666666',
    },
    resendButton: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center' as const,
        borderWidth: 1,
        borderColor: '#5F60B9',
    },
    resendButtonText: {
        color: '#5F60B9',
        fontSize: 16,
        fontWeight: '600' as const,
    },
    resendButtonTextDisabled: {
        color: '#CCCCCC',
        borderColor: '#CCCCCC',
    },
    // Document upload styles
    documentsSection: {
        marginVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingVertical: 16,
    },
    documentsSectionTitle: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: '#333333',
        marginBottom: 4,
    },
    documentsSectionSubtitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 16,
        lineHeight: 20,
    },
    documentUploadContainer: {
        marginBottom: 20,
    },
    documentTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: '#333333',
        marginBottom: 4,
    },
    documentSubtitle: {
        fontSize: 13,
        color: '#666666',
        marginBottom: 12,
        lineHeight: 18,
    },
    required: {
        color: '#FF3B30',
        fontWeight: 'bold' as const,
    },
    aadharUploadRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        gap: 12,
    },
    documentUploadItem: {
        flex: 1,
        alignItems: 'center' as const,
    },
    singleDocumentUpload: {
        alignItems: 'center' as const,
    },
    documentUploadButton: {
        position: 'relative' as const,
        width: 120,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        overflow: 'hidden' as const,
        marginBottom: 8,
    },
    documentPreview: {
        width: 120,
        height: 80,
        borderRadius: 6,
    },
    documentPlaceholder: {
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    documentIcon: {
        fontSize: 24,
        marginBottom: 4,
    },
    documentPlaceholderText: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '500' as const,
        textAlign: 'center' as const,
    },
    documentOverlay: {
        position: 'absolute' as const,
        bottom: 4,
        right: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#5F60B9',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    documentOverlayIcon: {
        fontSize: 12,
        color: '#FFFFFF',
    },
    removeDocumentButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: '#FF3B30',
        borderRadius: 12,
        alignSelf: 'center' as const,
    },
    removeDocumentText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600' as const,
        textAlign: 'center' as const,
    },
    // Selected items display styles
    selectedItemsContainer: {
        marginVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        paddingVertical: 16,
    },
    selectedItemsTitle: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: '#333333',
        marginBottom: 12,
    },
    selectedItemsList: {
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        gap: 8,
    },
    selectedItem: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#2196F3',
    },
    selectedItemText: {
        fontSize: 14,
        color: '#1976D2',
        fontWeight: '500' as const,
        marginRight: 8,
    },
    removeItemButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FF5722',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    removeItemText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold' as const,
        lineHeight: 16,
    },
    // Upload Modal Styles
    uploadModalContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    uploadOption: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    uploadOptionIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    uploadOptionText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: '#333333',
    },
    removeOption: {
        backgroundColor: '#FFF5F5',
        borderColor: '#FF3B30',
    },
    removeOptionText: {
        color: '#FF3B30',
    },
    // Modal Close Button
    modalCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    modalCloseText: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: '#666666',
    },
};

const mapStateToProps = (state: RootState) => ({
    globalState: state.globalState,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    registerActions: registerActions_dispatch(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
