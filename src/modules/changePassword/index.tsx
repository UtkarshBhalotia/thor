import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { changePasswordStyles } from '../../assets/css/changePasswordStyles';
import {
    NavigationProp,
    useNavigation,
} from '@react-navigation/native';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import SODTextInput from '../../components/SODTextInput';

const ChangePassword = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [submitting, setSubmitting] = useState(false);

    const formMethods = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            recheckPassword: '',
        },
    });

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = formMethods;

    const watchedValues = watch();

    const handleUpdatePassword = (data: any) => {
        if (data.newPassword !== data.recheckPassword) {
            Alert.alert('Error', 'New password and re-check password do not match');
            return;
        }

        console.log('Update Password Data:', data);
        setSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setSubmitting(false);
            Alert.alert(
                'Success',
                'Password updated successfully',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }, 2000);
    };

    return (
        <SafeAreaView style={changePasswordStyles.container} edges={['top']}>
            <View style={changePasswordStyles.headerContainer}>
                <TouchableOpacity
                    style={changePasswordStyles.backButton}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={changePasswordStyles.headerTitle}>Change Password</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={changePasswordStyles.scrollContent}>
                <View style={changePasswordStyles.formSection}>
                    <Text style={changePasswordStyles.descriptionText}>
                        Your new password must be different from previous used passwords.
                    </Text>

                    <FormProvider {...formMethods}>
                        <Controller
                            control={control}
                            name="currentPassword"
                            rules={{ required: 'Current password is required' }}
                            render={({ field: { onChange, value } }) => (
                                <SODTextInput
                                    title="Current Password"
                                    value={value}
                                    onChangeText={onChange}
                                    secureTextEntry={true}
                                    isEditable={true}
                                    placeholder="Enter current password"
                                    errorMsg={errors.currentPassword?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="newPassword"
                            rules={{ required: 'New password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
                            render={({ field: { onChange, value } }) => (
                                <SODTextInput
                                    title="New Password"
                                    value={value}
                                    onChangeText={onChange}
                                    secureTextEntry={true}
                                    isEditable={true}
                                    placeholder="Enter new password"
                                    errorMsg={errors.newPassword?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="recheckPassword"
                            rules={{ required: 'Please re-check your password' }}
                            render={({ field: { onChange, value } }) => (
                                <SODTextInput
                                    title="Re-check Password"
                                    value={value}
                                    onChangeText={onChange}
                                    secureTextEntry={true}
                                    isEditable={true}
                                    placeholder="Re-enter new password"
                                    errorMsg={errors.recheckPassword?.message}
                                />
                            )}
                        />

                        <TouchableOpacity
                            style={[changePasswordStyles.updateButton, submitting && changePasswordStyles.disabledButton]}
                            onPress={handleSubmit(handleUpdatePassword)}
                            disabled={submitting}>
                            <Text style={changePasswordStyles.updateButtonText}>
                                {submitting ? 'UPDATING...' : 'UPDATE PASSWORD'}
                            </Text>
                        </TouchableOpacity>
                    </FormProvider>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChangePassword;
