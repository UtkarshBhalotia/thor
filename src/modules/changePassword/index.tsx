import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { changePasswordStyles } from '../../assets/css/changePasswordStyles';
import {
    NavigationProp,
    useNavigation,
} from '@react-navigation/native';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import SODTextInput from '../../components/SODTextInput';
import { connect } from 'react-redux';
import { loginActions_dispatch } from '../../../store/action/mainTypedAction';
import { AppDispatch, RootState } from '../../../store';
import { getItem, setItem, STORAGE_KEYS } from '../../utils/storage';

const ChangePassword = (props: any) => {
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
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'New password and re-check password do not match',
            });
            return;
        }
        console.log('Update Password Data:', data);
        setSubmitting(true);

        props.loginActions('Update_User_Password_Api', {
            oldPassword: data.currentPassword,
            newPassword: data.newPassword,
            userId: props.globalState.userId,
            callBack: async (success: boolean, message: string) => {
                setSubmitting(false);
                if (success) {
                    // Update password in AsyncStorage
                    try {
                        const userInfo = await getItem(STORAGE_KEYS.USER_INFO);
                        if (userInfo) {
                            userInfo.password = data.newPassword;
                            await setItem(STORAGE_KEYS.USER_INFO, userInfo);
                            console.log('Password updated in AsyncStorage');
                        }
                    } catch (error) {
                        console.error('Failed to update password in storage', error);
                    }

                    Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: message === '1' ? 'Password updated successfully' : message,
                        visibilityTime: 2000,
                    });
                    setTimeout(() => {
                        navigation.goBack();
                    }, 2000);
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: message,
                    });
                }
            }
        });
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

const mapStateToProps = (state: RootState) => ({
    globalState: state.globalState,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    loginActions: loginActions_dispatch(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
