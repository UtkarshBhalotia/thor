import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { loginStyles } from '../../../assets/css/loginStyles';
import { registerStyles } from '../../../assets/css/registerStyles';

const Register = () => {
    const insets = useSafeAreaInsets();
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [cities, setCities] = useState<string[]>([]);
    const [citiesLoading, setCitiesLoading] = useState(false);
    const [states, setStates] = useState<string[]>([]);
    const [statesLoading, setStatesLoading] = useState(false);

    const stateSheetRef = useRef<BottomSheetModal>(null);
    const citySheetRef = useRef<BottomSheetModal>(null);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const openStatePicker = () => {
        console.log('Open state picker');
        stateSheetRef.current?.present();
    };
    const openCityPicker = () => {
        console.log('Open city picker');
        citySheetRef.current?.present();
    };

    const onSignupPress = async (data: any) => {
        console.log('Signup pressed:', data);
    };

    return (
        <SafeAreaView style={loginStyles.container}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={insets.top}>
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
                    {/* <View style={loginStyles.avatarContainer}>
                        <Feather name="user" size={40} color="#FFFFFF" />
                    </View> */}
                    <View style={loginStyles.headerContainer}>
                        <Text style={loginStyles.title}>Hello User !</Text>
                        <Text style={loginStyles.subtitle}>
                            Signup For Better Experience
                        </Text>
                    </View>

                    <Controller
                        control={control}
                        name="state"
                        render={({ field: { value } }) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={openStatePicker}>
                                <View
                                    style={[
                                        loginStyles.inputContainer,
                                        { justifyContent: 'space-between' },
                                    ]}>
                                    <Text
                                        style={[
                                            loginStyles.input,
                                            value
                                                ? registerStyles.selectText
                                                : registerStyles.selectPlaceholder,
                                        ]}
                                        numberOfLines={1}>
                                        {value || 'Select State'}
                                    </Text>
                                    {/* <Feather
                                        name="chevron-down"
                                        size={20}
                                        color="#8F8F8F"
                                    /> */}
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                    <Controller
                        control={control}
                        name="city"
                        render={({ field: { value } }) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={async () => {
                                    if (!selectedState) {
                                        Toast.show({
                                            type: 'info',
                                            text1: 'Please select a state first',
                                        });
                                        return;
                                    }
                                    // if (cities.length === 0) {
                                    //     await fetchCitiesForState(
                                    //         selectedState,
                                    //     );
                                    // }
                                    openCityPicker();
                                }}>
                                <View
                                    style={[
                                        loginStyles.inputContainer,
                                        { justifyContent: 'space-between' },
                                    ]}>
                                    <Text
                                        style={[
                                            loginStyles.input,
                                            value
                                                ? registerStyles.selectText
                                                : registerStyles.selectPlaceholder,
                                        ]}
                                        numberOfLines={1}>
                                        {value || 'Select City'}
                                    </Text>
                                    {/* <Feather
                                        name="chevron-down"
                                        size={20}
                                        color="#8F8F8F"
                                    /> */}
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                    <Controller
                        control={control}
                        name="fullName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={loginStyles.inputContainer}>
                                <TextInput
                                    style={loginStyles.input}
                                    placeholder="Full Name"
                                    placeholderTextColor="#8F8F8F"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {/* <Feather
                                    name="user"
                                    size={20}
                                    color="#8F8F8F"
                                /> */}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="userName"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={loginStyles.inputContainer}>
                                <TextInput
                                    style={loginStyles.input}
                                    placeholder="User Name"
                                    placeholderTextColor="#8F8F8F"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {/* <Feather
                                    name="user"
                                    size={20}
                                    color="#8F8F8F"
                                /> */}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={loginStyles.inputContainer}>
                                <TextInput
                                    style={loginStyles.input}
                                    placeholder="Email"
                                    placeholderTextColor="#8F8F8F"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                {/* <Feather
                                    name="mail"
                                    size={20}
                                    color="#8F8F8F"
                                /> */}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={loginStyles.inputContainer}>
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
                                        setIsPasswordSecure(!isPasswordSecure)
                                    }>
                                    {/* <Feather
                                        name={
                                            isPasswordSecure ? 'eye-off' : 'eye'
                                        }
                                        size={20}
                                        color="#8F8F8F"
                                    /> */}
                                </TouchableOpacity>
                            </View>
                        )}
                    />

                    <TouchableOpacity
                        style={loginStyles.signupButton}
                        onPress={handleSubmit(onSignupPress)}
                        disabled={submitting}>
                        <Text style={loginStyles.loginButtonText}>
                            {submitting ? 'PROCESSING...' : 'SIGNUP'}
                        </Text>
                    </TouchableOpacity>

                    <View style={loginStyles.signupContainer}>
                        <Text style={loginStyles.signupText}>
                            Already have an account?
                        </Text>
                        <TouchableOpacity>
                            <Pressable
                                onPress={() => navigation.navigate('Login')}>
                                <Text style={loginStyles.signupLink}>
                                    Sign In
                                </Text>
                            </Pressable>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* <BottomSheetModal
                ref={stateSheetRef}
                snapPoints={stateSnapPoints}
                enablePanDownToClose={false}
                enableHandlePanningGesture={false}
                enableContentPanningGesture={false}
                enableOverDrag={false}
                backdropComponent={renderBackdrop}
                topInset={insets.top}
                index={0}>
                <View style={sheetStyles.sheetContainer}>
                    <Text style={sheetStyles.sheetTitle}>Select State</Text>
                    <BottomSheetFlatList
                        data={states}
                        keyExtractor={(item) => item}
                        contentContainerStyle={{
                            paddingBottom: insets.bottom + 24,
                        }}
                        initialNumToRender={16}
                        maxToRenderPerBatch={16}
                        windowSize={8}
                        removeClippedSubviews={false}
                        updateCellsBatchingPeriod={16}
                        bounces={false}
                        alwaysBounceVertical={false}
                        overScrollMode="never"
                        decelerationRate={0.6} // ⬅ slower scroll
                        scrollEventThrottle={16}
                        keyboardShouldPersistTaps="handled"
                        renderItem={renderStateItem}
                        ListFooterComponent={
                            <View style={{ height: insets.bottom + 8 }} />
                        }
                        ListEmptyComponent={
                            statesLoading ? (
                                <View style={{ padding: 16 }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: '#8F8F8F',
                                        }}>
                                        Loading states...
                                    </Text>
                                </View>
                            ) : (
                                <View style={{ padding: 16 }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: '#8F8F8F',
                                        }}>
                                        No states found
                                    </Text>
                                </View>
                            )
                        }
                    />
                </View>
            </BottomSheetModal> */}

            {/* <BottomSheetModal
                ref={citySheetRef}
                snapPoints={citySnapPoints}
                enablePanDownToClose={false}
                enableHandlePanningGesture={false}
                enableContentPanningGesture={false}
                enableOverDrag={false}
                backdropComponent={renderBackdrop}
                topInset={insets.top}
                index={0}>
                <View style={sheetStyles.sheetContainer}>
                    <Text style={sheetStyles.sheetTitle}>
                        {selectedState
                            ? `Cities in ${selectedState}`
                            : 'Select City'}
                    </Text>

                    <BottomSheetFlatList
                        data={cities}
                        keyExtractor={(item) => item}
                        contentContainerStyle={{
                            paddingBottom: insets.bottom + 24,
                        }}
                        initialNumToRender={24}
                        maxToRenderPerBatch={24}
                        windowSize={10}
                        removeClippedSubviews={false}
                        updateCellsBatchingPeriod={50}
                        bounces={false}
                        alwaysBounceVertical={false}
                        overScrollMode="never"
                        decelerationRate={0.6} // ⬅ slower scroll
                        scrollEventThrottle={16}
                        keyboardShouldPersistTaps="handled"
                        renderItem={renderCityItem}
                        ListFooterComponent={
                            <View style={{ height: insets.bottom + 8 }} />
                        }
                        ListEmptyComponent={
                            citiesLoading ? (
                                <View style={{ padding: 16 }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: '#8F8F8F',
                                        }}>
                                        Loading cities...
                                    </Text>
                                </View>
                            ) : (
                                <View style={{ padding: 16 }}>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            color: '#8F8F8F',
                                        }}>
                                        No cities found
                                    </Text>
                                </View>
                            )
                        }
                    />
                </View>
            </BottomSheetModal> */}
        </SafeAreaView>
    );
};

export default Register;
