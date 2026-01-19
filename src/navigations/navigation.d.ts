import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    WelcomeToSOD: { setShowWelcomeScreen: (show: boolean) => void };
    Login: undefined;
    Onboarding: undefined;
    Register: undefined;
    HomeTabs: NavigatorScreenParams<TabParamList>;
    Dashboard: undefined;
    Booking: { initialTab?: 'New' | 'Ongoing' | 'Follow Up' | 'Denied' | 'Completed' | 'Complaint' };
    Wallet: undefined;
    Profile: undefined;
    More: undefined;
    ChangePassword: undefined;
    Report: undefined;
    IdVerification: undefined;
};

export type TabParamList = {
    Home: undefined;
    Bookings: { initialTab?: 'New' | 'Ongoing' | 'Follow Up' | 'Denied' | 'Completed' | 'Complaint' };
    Recharge: undefined;
    Profile: undefined;
    More: undefined;
};
