/**
 * Plugins
 */
import { StyleSheet, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import DeviceInfo from 'react-native-device-info';

/**
 * Utils
 */
import { hasDynamicIslandIphone } from '../../utils/common';

const Layout = StyleSheet.create({
    viewHeight: {
        flex: 1,
    },
    header: {
        height: 58,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        marginBottom: 30,
    },
    headerInv: {
        height: 58,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    blankHeader: {
        marginBottom: 0,
    },
    network: {
        alignSelf: 'stretch',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:
            DeviceInfo.hasNotch() || hasDynamicIslandIphone()
                ? 60
                : Platform.OS === 'ios'
                ? 25
                : 10,
        paddingBottom: 10,
        elevation: 0,
    },
    btnHover: {
        backgroundColor: '#D3E4FF',
    },
    noNetworkBg: {
        backgroundColor: '#DE3730',
    },
    lowNetworkBg: {
        backgroundColor: '#EB9A17',
    },
    row: {
        flexDirection: 'row',
    },
    rrow: {
        flexDirection: 'row-reverse',
    },
    column: {
        flexDirection: 'column',
    },
    balanceBox: {
        backgroundColor: '#f7f7f7',
        zIndex: 999,
    },
    balanceBoxInv: {
        zIndex: 999,
    },
    reload: {
        backgroundColor: '#E05A5A',
        borderRadius: 80,
        borderColor: '#fff',
        borderWidth: 2,
        borderStyle: 'solid',
        marginBottom: RFValue(100),
        padding: 20,
    },
    col1: {
        flex: 1,
    },
    col2: {
        flex: 2,
    },
    col3: {
        flex: 3,
    },
    col4: {
        flex: 4,
    },
    col5: {
        flex: 5,
    },
    col6: {
        flex: 6,
    },
    col7: {
        flex: 7,
    },
    col8: {
        flex: 8,
    },
    col9: {
        flex: 9,
    },
    col10: {
        flex: 10,
    },
});

export default Layout;
