import React from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moreStyles } from '../../assets/css/moreStyles';
import ProfileMenuItem from '../profile/components/ProfileMenuItem';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { removeItem, STORAGE_KEYS } from '../../utils/storage';

const More = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();

    const handleAction = (title: string) => {
        Alert.alert(title, `Functionality for ${title} coming soon.`);
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout from this application?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await removeItem(STORAGE_KEYS.USER_INFO);
                        await removeItem(STORAGE_KEYS.AUTH_TOKEN);
                        dispatch({ type: 'GLOBAL_RESET' });
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            })
                        );
                    },
                },
            ]
        );
    };

    const menuActions = [
        { title: 'Tax invoice', ionicon: 'receipt-outline' },
        { title: 'Report', ionicon: 'bar-chart-outline' },
        { title: 'Help and support', ionicon: 'help-circle-outline' },
        { title: 'Change password', ionicon: 'lock-closed-outline' },
        { title: 'Share', ionicon: 'share-social-outline' },
    ];

    return (
        <SafeAreaView style={moreStyles.container} edges={['top']}>
            <View style={moreStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={moreStyles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={moreStyles.headerTitle}>More</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={moreStyles.scrollContent}
            >
                <View style={moreStyles.section}>
                    {menuActions.map((item, index) => (
                        <ProfileMenuItem
                            key={index}
                            ionicon={item.ionicon}
                            title={item.title}
                            onPress={() => handleAction(item.title)}
                        />
                    ))}
                    <ProfileMenuItem
                        ionicon="log-out-outline"
                        title="Logout"
                        isLogout={true}
                        onPress={handleLogout}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default More;
