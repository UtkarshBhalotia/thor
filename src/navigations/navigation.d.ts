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
    WebViewScreen: { url: string; title: string };
    ServiceLocation: {
        state?: string;
        city?: string;
        citiesWithCheckbox?: { name: string; isChecked: boolean }[];
        onSave: (data: { state: string; city: string; citiesWithCheckbox: { name: string; isChecked: boolean }[] }) => void;
    };
    AdminTabs: NavigatorScreenParams<AdminTabParamList>;
};

export type AdminTabParamList = {
    AdminDashboard: undefined;
    AdminLeadList: undefined;
    AdminPartnerList: undefined;
    AdminLeadHistory: undefined;
    AdminMore: undefined;
};

export type TabParamList = {
    Home: undefined;
    Bookings: { initialTab?: 'New' | 'Ongoing' | 'Follow Up' | 'Denied' | 'Completed' | 'Complaint' };
    Recharge: undefined;
    Profile: undefined;
    More: undefined;
};
