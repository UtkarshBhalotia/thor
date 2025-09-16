import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

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
