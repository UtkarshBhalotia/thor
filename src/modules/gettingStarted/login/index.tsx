import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    ActivityIndicator,
} from 'react-native';

import { Platform } from 'react-native';

import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { loginStyles } from '../../../assets/css/loginStyles';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { AppDispatch, RootState } from '../../../../store';
import { connect } from 'react-redux';
import { loginActions_dispatch } from '../../../../store/action/mainTypedAction';
import { globalReducer_dispatch } from '../../../../store/reducer/mainTypedReducer';
import Layout from '../../../assets/css/layout';
import SODTextInput from '../../../components/SODTextInput';
import { Character_Limit } from '../../../utils/common';
import { regex_validation } from '../../../utils/regex';
import { commonIcons } from '../../../assets/svg';
import BSModal from '../../../components/BSModal';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';

const Login = (props: any) => {
    const insets = useSafeAreaInsets();
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const forgotPasswordModalRef = React.useRef<BottomSheetModal>(null);
    const [forgotPasswordMobile, setForgotPasswordMobile] = useState('');

    const formMethods = useForm({
        defaultValues: {
            email: 'ruhienterprises01@gmail.com',
            password: '9472197062',
        },
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        clearErrors,
        trigger,
    } = formMethods;

    const email_watch = watch('email');
    const password_watch = watch('password');

    const disableFn = React.useCallback(() => {
        // Check if fields are empty
        if (email_watch === '' || password_watch === '') {
            return true;
        }
        // Check if there are any validation errors
        if (errors.email || errors.password) {
            return true;
        }
        // Check if email format is valid
        if (email_watch && !regex_validation('email', email_watch)) {
            return true;
        }

        return false;
    }, [email_watch, password_watch, errors.email, errors.password]);

    const onLoginPress = async (data: {
        email: string;
        password: string;
    }) => {

        props.loginActions('UserAuth_Login_Api', {
            ...data,
            callBack: () => {
                navigation.navigate('HomeTabs');
            }
        });
    };

    return (
        <SafeAreaView style={loginStyles.container} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={insets.top}
                style={[Layout.viewHeight]}>
                <View style={loginStyles.headerContainer}>
                    <Text style={loginStyles.title}>
                        Login to App!
                    </Text>
                </View>

                <FormProvider {...formMethods}>
                    {/* Email Input */}
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: 'Email is required',
                            validate: (value = 'ruhienterprises01@gmail.com') => {
                                if (!regex_validation('email', value)) {
                                    return 'Please enter a valid email address';
                                }
                                return true;
                            },
                        }}
                        render={({
                            field: { onChange, value, ref, onBlur },
                            fieldState: { error },
                        }) => (
                            <>
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
                                        // Trigger validation when user leaves email field
                                        trigger('email');
                                    }}
                                    value={value}
                                    required={true}
                                    errorMsg={error?.message}
                                    name="email"
                                    maxlength={Character_Limit.email}
                                    keyboard={'email-address'}
                                    isEditable={true}
                                    autoFocus={true}
                                />
                            </>
                        )}
                    />

                    {/* Password Input */}
                    <Controller
                        control={control}
                        name="password"
                        rules={{ required: 'Password is required' }}
                        render={({
                            field: { onChange, value, ref, onBlur },
                            fieldState: { error },
                        }) => (
                            <>
                                <View style={{ position: 'relative' }}>
                                    <SODTextInput
                                        ref={ref}
                                        title="password"
                                        placeholder="Enter Password"
                                        placeholderTextColor="#8F8F8F"
                                        onChangeText={(text: string) => {
                                            onChange(text);
                                            clearErrors('password');
                                        }}
                                        onBlurText={() => {
                                            // Trigger validation when user leaves password field
                                            trigger('password');
                                        }}
                                        value={value}
                                        required={true}
                                        errorMsg={error?.message}
                                        name="password"
                                        maxlength={Character_Limit.password}
                                        keyboard={'default'}
                                        isEditable={true}
                                        secureTextEntry={isPasswordSecure}
                                    />
                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute',
                                            right: 12,
                                            top: '50%',
                                            transform: [{ translateY: -15 }],
                                            padding: 2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() =>
                                            setIsPasswordSecure(
                                                !isPasswordSecure,
                                            )
                                        }>
                                        {isPasswordSecure
                                            ? commonIcons('eye_closed')
                                            : commonIcons('eye_open')}
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    />

                    <View style={loginStyles.optionsContainer}>
                        <TouchableOpacity onPress={() => forgotPasswordModalRef.current?.present()}>
                            <Text style={loginStyles.forgotPasswordText}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={
                            disableFn()
                                ? loginStyles.loginButtonDisabled
                                : loginStyles.loginButton
                        }
                        disabled={disableFn()}
                        onPress={handleSubmit(onLoginPress)}>
                        <Text style={loginStyles.loginButtonText}>LOGIN</Text>
                    </TouchableOpacity>

                    <View style={loginStyles.signupContainer}>
                        <Text style={loginStyles.signupText}>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('Register');
                            }}>
                            <Text style={loginStyles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </FormProvider>
            </KeyboardAvoidingView>

            <BSModal
                bsModalRef={forgotPasswordModalRef}
                headerTitle="Forgot Password"
                snapPoints={['40%']}
            >
                <View style={loginStyles.bottomSheetContent}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={loginStyles.inputLabel}>Mobile Number</Text>
                        <BottomSheetTextInput
                            style={loginStyles.amountInput}
                            placeholder="Enter mobile number"
                            keyboardType="phone-pad"
                            value={forgotPasswordMobile}
                            onChangeText={setForgotPasswordMobile}
                        />
                    </View>
                    <TouchableOpacity
                        style={loginStyles.continueButton}
                        onPress={() => {
                            console.log('Continuing with mobile:', forgotPasswordMobile);
                            forgotPasswordModalRef.current?.dismiss();
                        }}
                    >
                        <Text style={loginStyles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </BSModal>
        </SafeAreaView>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        global: state.globalState,
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        loginActions: loginActions_dispatch(dispatch),
        global_reducer: globalReducer_dispatch(dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
