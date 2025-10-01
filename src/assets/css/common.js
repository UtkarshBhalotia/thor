/**
 * Plugins
 */
import { StyleSheet, Platform, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const screenHeight = Dimensions.get('window').height;

const Common = StyleSheet.create({
    m10: {
        margin: 10,
    },
    mt2: {
        marginTop: 2,
    },
    mt3: {
        marginTop: 3,
    },
    mt4: {
        marginTop: 4,
    },
    mt5: {
        marginTop: 5,
    },
    mt7: {
        marginTop: 7,
    },
    mt8: {
        marginTop: 8,
    },
    mt10: {
        marginTop: 10,
    },
    mt11: {
        marginTop: 11,
    },
    mt12: {
        marginTop: 12,
    },
    mt15: {
        marginTop: 15,
    },
    mt16: {
        marginTop: 16,
    },
    mt18: {
        marginTop: 18,
    },
    mt20: {
        marginTop: 20,
    },
    mt23: {
        marginTop: 23,
    },
    mt25: {
        marginTop: 25,
    },
    mt35: {
        marginTop: 35,
    },
    mt50: {
        marginTop: 50,
    },
    mt60: {
        marginTop: 60,
    },
    mr0: {
        marginRight: 0,
    },
    mr2: {
        marginRight: 2,
    },
    mr4: {
        marginRight: 4,
    },
    mr5: {
        marginRight: 5,
    },
    mr8: {
        marginRight: 8,
    },
    mr10: {
        marginRight: 10,
    },
    mr15: {
        marginRight: 15,
    },
    mr20: {
        marginRight: 20,
    },
    mr25: {
        marginRight: 25,
    },
    mb1: {
        marginBottom: 1,
    },
    mb2: {
        marginBottom: 2,
    },
    mb3: {
        marginBottom: 3,
    },
    mb4: {
        marginBottom: 4,
    },
    mb5: {
        marginBottom: 5,
    },
    mb8: {
        marginBottom: 8,
    },
    mb10: {
        marginBottom: 10,
    },
    mb15: {
        marginBottom: 15,
    },
    mb16: {
        marginBottom: 16,
    },
    mb20: {
        marginBottom: 20,
    },
    mb25: {
        marginBottom: 25,
    },
    mb35: {
        marginBottom: 35,
    },
    mb50: {
        marginBottom: 50,
    },
    ml0: {
        marginLeft: 0,
    },
    ml1: {
        marginLeft: 1,
    },
    ml2: {
        marginLeft: 2,
    },
    ml3: {
        marginLeft: 3,
    },
    ml5: {
        marginLeft: 5,
    },
    ml8: {
        marginLeft: 8,
    },
    ml10: {
        marginLeft: 10,
    },
    ml15: {
        marginLeft: 15,
    },
    ml20: {
        marginLeft: 20,
    },
    ml25: {
        marginLeft: 25,
    },
    ml30: {
        marginLeft: 30,
    },
    ml35: {
        marginLeft: 35,
    },
    ml40: {
        marginLeft: 40,
    },
    ml45: {
        marginLeft: 45,
    },
    pb4: {
        paddingBottom: 4,
    },
    p0: {
        padding: 0,
    },
    p5: {
        padding: 5,
    },
    p10: {
        padding: 10,
    },
    p15: {
        padding: 15,
    },
    p16: {
        padding: 16,
    },
    p8: {
        padding: 8,
    },
    pt0: {
        paddingTop: 0,
    },
    pt16: { paddingTop: 16 },
    pr0: {
        paddingRight: 0,
    },
    pb0: {
        paddingBottom: 0,
    },
    pl0: {
        paddingLeft: 0,
    },
    pt5: {
        paddingTop: 5,
    },
    pt2: {
        paddingTop: 2,
    },
    pt3: {
        paddingTop: 3,
    },
    pt4: {
        paddingTop: 4,
    },
    pr5: {
        paddingRight: 5,
    },
    pb5: {
        paddingBottom: 5,
    },
    pl5: {
        paddingLeft: 5,
    },
    pt8: {
        paddingTop: 8,
    },
    pb8: {
        paddingBottom: 8,
    },
    pt10: {
        paddingTop: 10,
    },
    pr10: {
        paddingRight: 10,
    },
    pb10: {
        paddingBottom: 10,
    },
    pl10: {
        paddingLeft: 10,
    },
    pt12: {
        paddingTop: 12,
    },
    pb12: {
        paddingBottom: 12,
    },
    pt15: {
        paddingTop: 15,
    },
    pr15: {
        paddingRight: 15,
    },
    pr16: {
        paddingRight: 16,
    },
    pl15: {
        paddingLeft: 15,
    },
    pl16: {
        paddingLeft: 15,
    },
    pb15: {
        paddingBottom: 15,
    },
    pb16: {
        paddingBottom: 16,
    },
    pt20: {
        paddingTop: 20,
    },
    pr20: {
        paddingRight: 20,
    },
    pb20: {
        paddingBottom: 20,
    },
    pl20: {
        paddingLeft: 20,
    },
    pt25: {
        paddingTop: 25,
    },
    pr25: {
        paddingRight: 25,
    },
    pr35: {
        paddingRight: 35,
    },
    pb25: {
        paddingBottom: 25,
    },
    pl25: {
        paddingLeft: 25,
    },
    pl35: {
        paddingLeft: 35,
    },
    pb40: {
        paddingBottom: 40,
    },
    px2: {
        paddingHorizontal: 2,
    },
    px4: {
        paddingHorizontal: 4,
    },
    px8: {
        paddingHorizontal: 8,
    },
    px16: {
        paddingHorizontal: 16,
    },
    py16: {
        paddingVertical: 16,
    },
    py12: {
        paddingVertical: 12,
    },
    py8: {
        paddingVertical: 8,
    },
    py6: {
        paddingVertical: 6,
    },
    py4: {
        paddingVertical: 4,
    },
    fs8: {
        fontSize: RFValue(7), //8
    },
    fs10: {
        fontSize: RFValue(9), //10
    },
    fs12: {
        fontSize: RFValue(10), //12
    },
    fs13: {
        fontSize: RFValue(11), //13
    },
    fs14: {
        fontSize: RFValue(12), //14
    },
    fs15: {
        fontSize: RFValue(13), //15
    },
    fs16: {
        fontSize: RFValue(14), //16
    },
    fs17: {
        fontSize: RFValue(15), //17
    },
    fs18: {
        fontSize: RFValue(15), //18
    },
    fs20: {
        fontSize: RFValue(17), //20
    },
    fs22: {
        fontSize: RFValue(19), //22
    },
    fs24: {
        fontSize: RFValue(20), //24
    },
    fs25: {
        fontSize: RFValue(21), //25
    },
    fs28: {
        fontSize: RFValue(24), //25
    },
    fs50: {
        fontSize: RFValue(42), //50
    },
    fs75: {
        fontSize: RFValue(63), //75
    },
    fs100: {
        fontSize: RFValue(83), //100
    },
    br15: {
        borderRadius: 15,
    },
    br12: {
        borderRadius: 12,
    },
    br8: {
        borderRadius: 8,
    },
    br4: {
        borderRadius: 4,
    },
    lineHeight16: {
        lineHeight: 16,
    },
    lineHeight18: {
        lineHeight: 18,
    },
    lineHeight20: {
        lineHeight: 20,
    },
    lineHeight22: {
        lineHeight: 22,
    },
    lineHeight24: {
        lineHeight: 24,
    },
    lineHeight26: {
        lineHeight: 26,
    },
    strikeThrough: {
        textDecorationLine: 'line-through',
    },
    underline: {
        textDecorationLine: 'underline',
    },
    capitalize: {
        textTransform: 'capitalize',
    },
    uppercase: {
        textTransform: 'uppercase',
    },
    textCenter: {
        textAlign: 'center',
    },
    textLeft: {
        textAlign: 'left',
    },
    textRight: {
        textAlign: 'right',
    },
    textVerticalBottom: {
        textAlignVertical: 'bottom',
    },
    textVerticalCenter: {
        textAlignVertical: 'center',
    },
    textVerticalTop: {
        textAlignVertical: 'top',
    },
    alignCenter: {
        alignItems: 'center',
    },
    alignLeft: {
        alignItems: 'flex-end',
    },
    alignRight: {
        alignItems: 'flex-start',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    justifyEnd: {
        justifyContent: 'flex-end',
    },
    justifyStart: {
        justifyContent: 'flex-start',
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },
    spaceAround: {
        justifyContent: 'space-around',
    },
    bgWhite: {
        backgroundColor: '#fff',
    },
    bgBlue: {
        backgroundColor: '#005DA4',
    },
    bgGray: {
        backgroundColor: '#E6E6E7',
    },
    bgLightGray: {
        backgroundColor: '#E0E0E0',
    },
    bgLightestGray: {
        backgroundColor: '#EBEBEB',
    },
    bgRed: {
        backgroundColor: '#FF7979',
    },
    bgBackGround: {
        backgroundColor: '#FAFAFA',
    },
    textColorDefault: {
        color: '#707888',
    },
    textColorList: {
        color: '#4D5358',
    },
    textColorSupportText: {
        color: '#8D9199',
    },
    textColorLabel: {
        color: '#A8ABB4',
    },
    textColorBlue: {
        color: '#2860CC',
    },
    textColorWhite: {
        color: '#fff',
    },
    textColorBlack: {
        color: '#444',
    },
    textColorErrorTitle: {
        color: '#242424',
    },
    textColorGreen: {
        color: '#186D1F',
    },
    textColorLightGreen: {
        color: '#4FA136',
    },
    textColorRed: {
        color: '#C50F1F',
    },
    textColorgray: {
        color: '#666B70',
    },
    textInvColor: {
        color: '#999D9F',
    },
    textItemSummaryColor: {
        color: '#656B71',
    },
    textPurpleColor: {
        color: '#7484D7',
    },
    dFlex: {
        display: 'flex',
    },
    dNone: {
        display: 'none',
    },
    loader: {
        color: '#eee',
        fontFamily: 'Roboto-Regular',
    },
    italic: {
        fontStyle: 'italic',
    },
    bold400: {
        fontFamily: 'Roboto-Regular',
    },
    bold500: {
        fontFamily: 'Roboto-Medium',
    },
    bold700: {
        fontFamily: 'Roboto-Bold',
    },
    textInput: {
        height: 46,
        color: '#707888',
        // paddingRight: 10,
        // paddingLeft: 10,
        // lineHeight: Platform.OS === 'ios' ? 22 : 26,
    },

    textInputNarration: {
        borderColor: '#707888',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        padding: 10,
    },

    cancelledContainer: {
        borderRadius: 10,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        padding: 10,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    row: {
        flexDirection: 'row',
    },
    viewHeight: {
        flex: 1,
    },
    topBorder: {
        borderTopColor: '#E0E0E0',
        borderTopWidth: 1,
    },
    allBorder: {
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
    },
    bottomBorder: {
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
    },
    bottomBorderGray: {
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
    },
    bottomBorderGray: {
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
    },

    //dropdowwn

    container: {
        backgroundColor: 'white',
        padding: 16,
    },
    dropdown: {
        height: 50,
        // borderColor: 'gray',
        // borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#005DA4',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    filterWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 0,
        backgroundColor: '#fff',
        // width: '100%',
        // maxHeight: screenHeight - screenHeight / 4,
    },
});

export default Common;
