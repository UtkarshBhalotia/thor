import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeToSOD from '../components/WelcomeToSOD';
import Login from '../modules/gettingStarted/login';
import Register from '../modules/gettingStarted/register';
import Dashboard from '../modules/dashboard';
import Booking from '../modules/booking';
import Wallet from '../modules/wallet';
import Profile from '../modules/profile';
import ServiceLocation from '../modules/profile/ServiceLocation';
import More from '../modules/more';
import ChangePassword from '../modules/changePassword';
import Onboarding from '../modules/gettingStarted/onboarding';
import Report from '../modules/report';
import IdVerification from '../modules/idVerification';
import WebViewScreen from '../components/WebViewScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getItem, STORAGE_KEYS } from '../utils/storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import type { RootStackParamList, TabParamList, AdminTabParamList } from './navigation';
import AdminDashboard from '../modules/admin/dashboard';
import AdminLeadList from '../modules/admin/leadList';
import AdminPartnerList from '../modules/admin/partnerList';
import AdminLeadHistory from '../modules/admin/leadHistory';


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();

// Bottom Tab Navigator Component
const HomeTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = 'home';

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Bookings') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Recharge') {
                        iconName = focused ? 'wallet' : 'wallet-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'More') {
                        iconName = focused ? 'menu' : 'menu-outline';
                    }

                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: '#5F60B9',
                tabBarInactiveTintColor: '#8E8E93',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5EA',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            })}>
            <Tab.Screen
                name="Home"
                component={Dashboard}
                options={{ tabBarLabel: 'Home' }}
            />
            <Tab.Screen
                name="Bookings"
                component={Booking}
                options={{ tabBarLabel: 'Leads' }}
            />
            <Tab.Screen
                name="Recharge"
                component={Wallet}
                options={{ tabBarLabel: 'Wallet' }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{ tabBarLabel: 'Profile' }}
            />
            <Tab.Screen
                name="More"
                component={More}
                options={{ tabBarLabel: 'More' }}
            />
        </Tab.Navigator>
    );
};

// Admin Bottom Tab Navigator Component
const AdminTabs = () => {
    return (
        <AdminTab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string = 'home';
                    if (route.name === 'AdminDashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'AdminLeadList') {
                        iconName = focused ? 'document-text' : 'document-text-outline';
                    } else if (route.name === 'AdminPartnerList') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'AdminLeadHistory') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'AdminReport') {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    }
                    return (
                        <Ionicons name={iconName} size={size} color={color} />
                    );
                },
                tabBarActiveTintColor: '#0A8485',
                tabBarInactiveTintColor: '#8E8E93',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5EA',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            })}>
            <AdminTab.Screen
                name="AdminDashboard"
                component={AdminDashboard}
                options={{ tabBarLabel: 'Home' }}
            />
            <AdminTab.Screen
                name="AdminLeadList"
                component={AdminLeadList}
                options={{ tabBarLabel: 'Lead List' }}
            />
            <AdminTab.Screen
                name="AdminPartnerList"
                component={AdminPartnerList}
                options={{ tabBarLabel: 'Partner List' }}
            />
            <AdminTab.Screen
                name="AdminLeadHistory"
                component={AdminLeadHistory}
                options={{ tabBarLabel: 'Lead History' }}
            />
            <AdminTab.Screen
                name="AdminReport"
                component={Report}
                options={{ tabBarLabel: 'Report' }}
            />
        </AdminTab.Navigator>
    );
};

const MainNavigator = () => {
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const globalState = useSelector((state: RootState) => state.globalState);
    const userExists = !!globalState?.userId;

    React.useEffect(() => {
        const checkUser = async () => {
            const userInfo = await getItem(STORAGE_KEYS.USER_INFO);
            console.log(userInfo, 'userInfo');

            if (userInfo) {
                dispatch({
                    type: 'GLOBAL_STATE_MUTATE',
                    value: userInfo,
                });
            }
            setIsLoading(false);
        };
        checkUser();
    }, [dispatch]);

    if (showWelcomeScreen || isLoading)
        return <WelcomeToSOD setShowWelcomeScreen={setShowWelcomeScreen} />;

    return (
        <Stack.Navigator
            initialRouteName={userExists ? (globalState.userType === 'A' ? 'AdminTabs' : 'HomeTabs') : 'Onboarding'}>
            <Stack.Group>
                <Stack.Screen
                    name="Onboarding"
                    component={Onboarding}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HomeTabs"
                    component={HomeTabs}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="AdminTabs"
                    component={AdminTabs}
                    options={{ headerShown: false }}
                />
                {/* Keep individual screens for direct navigation if needed */}
                <Stack.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Booking"
                    component={Booking}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Wallet"
                    component={Wallet}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Profile"
                    component={Profile}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ServiceLocation"
                    component={ServiceLocation}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="More"
                    component={More}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ChangePassword"
                    component={ChangePassword}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Report"
                    component={Report}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="IdVerification"
                    component={IdVerification}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="WebViewScreen"
                    component={WebViewScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default MainNavigator;
