import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-toast-message';

export function hasDynamicIslandIphone() {
    try {
        let flag = false;
        if (Platform.OS === 'ios') {
            let dName = parseInt(
                DeviceInfo.getDeviceId().split(',')[0].slice(6),
            );

            if (dName > 14) {
                flag = true;
            }

            return flag;
        }
    } catch (e: any) {
        console.log(e);
    }
}

export const showToast = ({
    type = 'info',
    text1 = 'Something Went Wrong. Please Try Again Later.',
    text2,
    visibilityTime = 2000,
    onPress,
}: {
    type?: 'success' | 'error' | 'info' | 'mazuSuccess';
    text1?: string;
    text2?: string;
    visibilityTime?: number;
    onPress?: () => void;
} = {}) => {
    // Platform.OS === "ios" ? Toast.show({ type }) : Toast.show({ ...params });
    console.log({ type, text1 });
    if (type === 'error') {
        console.log('showToast error', text1);
        Toast.show({
            text1: text1,
            type: 'mazuError',
            text2,
            visibilityTime,
            onPress,
            topOffset: 70,
        });
    } else if (type === 'mazuSuccess') {
        Toast.show({
            text1: text1,
            type: 'mazuSuccess',
            text2,
            visibilityTime,
            onPress,
            topOffset: 70,
        });
    } else {
        Toast.show({
            type,
            text1,
            text2,
            visibilityTime,
            onPress,
            topOffset: 70,
        });
    }
};

export const Character_Limit = {
    email: 64,
    password: 20,
    name: 50,
    mobile: 10,
    address: 200,
    companyName: 100,
    gstin: 15,
};
