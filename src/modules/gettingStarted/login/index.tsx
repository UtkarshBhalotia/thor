import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
} from 'react-native';

import {
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { loginStyles } from '../../../assets/css/loginStyles';
import { Controller, useForm } from 'react-hook-form';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const Login = () => {
    const insets = useSafeAreaInsets();
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();
    return (
        <SafeAreaView style={loginStyles.container}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={insets.top}
                style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={loginStyles.scrollContainer}
                    contentInsetAdjustmentBehavior="automatic"
                    contentInset={{ top: insets.top, bottom: insets.bottom }}
                    scrollIndicatorInsets={{
                        top: insets.top,
                        bottom: insets.bottom,
                    }}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode={
                        Platform.OS === 'ios' ? 'interactive' : 'on-drag'
                    }>
                    <View style={loginStyles.headerContainer}>
                        <Text style={loginStyles.title}>Hello Sara!</Text>
                        <Text style={loginStyles.subtitle}>
                            Welcome Back, You Have Been Missed For Long Time
                        </Text>
                    </View>

                    {/* Email Input */}
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <View style={loginStyles.inputContainer}>
                                    {/* <Feather
                                        name="mail"
                                        size={20}
                                        color="#8F8F8F"
                                    /> */}
                                    <TextInput
                                        style={loginStyles.input}
                                        placeholder="Email Address"
                                        placeholderTextColor="#8F8F8F"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                                {/* {errors.email && (
                                    <Text style={loginStyles.errorText}>
                                        {errors.email.message}
                                    </Text>
                                )} */}
                            </>
                        )}
                    />

                    {/* Password Input */}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <View style={loginStyles.inputContainer}>
                                    {/* <Feather
                                        name="lock"
                                        size={20}
                                        color="#8F8F8F"
                                    /> */}
                                    <TextInput
                                        style={loginStyles.input}
                                        placeholder="Password"
                                        placeholderTextColor="#8F8F8F"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        secureTextEntry={isPasswordSecure}
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            setIsPasswordSecure(
                                                !isPasswordSecure,
                                            )
                                        }>
                                        {/* <Feather
                                            name={
                                                isPasswordSecure
                                                    ? 'eye-off'
                                                    : 'eye'
                                            }
                                            size={20}
                                            color="#8F8F8F"
                                        /> */}
                                    </TouchableOpacity>
                                </View>
                                {errors.password && (
                                    <Text style={loginStyles.errorText}>
                                        {typeof errors.password.message ===
                                        'string'
                                            ? errors.password.message
                                            : ''}
                                    </Text>
                                )}
                            </>
                        )}
                    />

                    <View style={loginStyles.optionsContainer}>
                        <TouchableOpacity
                            style={loginStyles.rememberMeContainer}
                            onPress={() => setRememberMe(!rememberMe)}>
                            <View
                                style={[
                                    loginStyles.checkbox,
                                    rememberMe && loginStyles.checkboxChecked,
                                ]}>
                                {/* {rememberMe && (
                                    <Feather
                                        name="check"
                                        size={14}
                                        color="#FFF"
                                    />
                                )} */}
                            </View>
                            <Text style={loginStyles.rememberMeText}>
                                Remember me
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={loginStyles.forgotPasswordText}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={loginStyles.loginButton}
                        // onPress={handleSubmit(onLoginPress)}
                    >
                        <Text style={loginStyles.loginButtonText}>LOGIN</Text>
                    </TouchableOpacity>

                    <View style={loginStyles.signupContainer}>
                        <Text style={loginStyles.signupText}>
                            Don't have an account?
                        </Text>
                        <TouchableOpacity>
                            <Pressable
                                onPress={() => {
                                    navigation.navigate('Register');
                                }}>
                                <Text style={loginStyles.signupLink}>
                                    Sign Up
                                </Text>
                            </Pressable>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;
