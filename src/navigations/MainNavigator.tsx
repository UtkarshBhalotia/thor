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
import More from '../modules/more';
import ChangePassword from '../modules/changePassword';
import Onboarding from '../modules/gettingStarted/onboarding';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getItem, STORAGE_KEYS } from '../utils/storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

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
                tabBarActiveTintColor: '#4A90E2',
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
                options={{ tabBarLabel: 'Recharge' }}
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
            initialRouteName={userExists ? 'HomeTabs' : 'Onboarding'}>
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
                    name="More"
                    component={More}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ChangePassword"
                    component={ChangePassword}
                    options={{ headerShown: false }}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default MainNavigator;
