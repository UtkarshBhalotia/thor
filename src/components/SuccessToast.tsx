import { Text, TouchableOpacity, View } from 'react-native';
import { SODColors } from '../assets/colors/index';
import { ToastConfigParams } from 'react-native-toast-message';
import { commonIcons } from '../assets/svg/index';

const SuccessToast = (props: ToastConfigParams<any>) => {
    const { text1, hide } = props;
    return (
        <View
            style={{
                width: '85%',
                paddingHorizontal: 16,
                paddingVertical: 11,
                borderRadius: 12,
                backgroundColor: SODColors.Green_96,
                boxShadow:
                    '0px 8px 16px 0px rgba(0, 0, 0, 0.14), 0px 0px 2px 0px rgba(0, 0, 0, 0.12)',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
            <Text
                style={{
                    width: '80%',
                    marginVertical: 5,
                    fontSize: 15,
                    fontWeight: '400',
                    lineHeight: 20,
                    flexWrap: 'wrap',
                    color: SODColors.Green_27,
                }}>
                {text1}
            </Text>
            <TouchableOpacity
                onPress={() => hide()}
                style={{
                    marginLeft: 16,
                }}>
                {commonIcons('dismiss_green' as any)}
            </TouchableOpacity>
        </View>
    );
};

export default SuccessToast;
