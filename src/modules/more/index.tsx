import React from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moreStyles } from '../../assets/css/moreStyles';
import ProfileMenuItem from '../profile/components/ProfileMenuItem';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const More = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
                    onPress: () => {
                        console.log('Logging out...');
                        navigation.navigate('Login');
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
                    <Ionicons name="arrow-back" size={24} color="#000" />
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
