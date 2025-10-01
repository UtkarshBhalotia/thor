/**
 * Plugins
 */
import { StyleSheet, Platform, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const screenHeight = Dimensions.get('window').height;

const SODText = StyleSheet.create({
    // SF_PRO_REGULAR: {
    //     // fontFamily: 'sf pro regular',
    //     fontFamily: 'AntDesign',
    // },
    MazuFS34: {
        // fontFamily: 'SF Pro Display',
        fontSize: RFValue(30),
        lineHeight: 41,
        letterSpacing: 0.4,
    },
    MazuFS30: {
        // fontFamily: 'SF Pro Display',
        fontSize: RFValue(26),
        lineHeight: 41,
        letterSpacing: 0.2,
    },
    MazuFS26: {
        // fontFamily: 'SF Pro Display',
        fontSize: RFValue(23),
        lineHeight: 41,
        letterSpacing: 0.2,
    },
    MazuInputText: {
        // fontFamily: 'SF Pro Display',
        fontSize: RFValue(15),
        letterSpacing: -0.43,
    },
    MazuFS17: {
        // fontFamily: 'SF Pro Display',
        fontSize: RFValue(15),
        // lineHeight: 17,
        letterSpacing: -0.43,
    },
    MazuFS15: {
        // fontFamily: 'SF Pro Display',
        fontSize: RFValue(13),
        // lineHeight: 20,
        letterSpacing: -0.23,
    },
    MazuFS13: {
        // fontFamily: 'SF Pro Display',
        fontSize: RFValue(12),
        // lineHeight: 20,
        letterSpacing: -0.23,
    },
    MazuFS12: {
        // fontFamily: 'SF Pro Display',
        fontSize: RFValue(10),
        // lineHeight: 20,
        // letterSpacing: -0.23,
    },
    MazuFS20: {
        // fontFamily: 'SF Pro Display',
        fontSize: RFValue(17),
        lineHeight: 25,
        letterSpacing: -0.45,
    },
    MazuFS22: {
        // fontFamily: 'SF Pro Display',
        fontSize: RFValue(19),
        lineHeight: 28,
        letterSpacing: -0.26,
    },
    bold400: {
        fontWeight: 400,
    },
    bold500: {
        fontWeight: 500,
    },
    bold600: {
        fontWeight: 600,
    },
    bold700: {
        fontWeight: 700,
    },
    Red_31: { color: '#C50F1F' },
    Red_32: { color: '#960B18' },
    Red_97: { color: '#FDF3F4' },
    Blue_50: { color: '#1E5CDF' },
    Blue_60: { color: '#1D40B0' },
    Blue_81: { color: '#9EB7FF' },
    Blue_85: { color: '#B2C7FF' },
    Black_14: { color: '#242424' },
    Black_23: { color: '#1E1E58' },
    Black_38: { color: '#616161' },
    Green_27: { color: '#107C10' },
    Green_96: { color: '#F1FAF1' },
    Grey_50: { color: '#808080' },
    Grey_74: { color: '#BDBDBD' },
    Grey_88: { color: '#E0E0E0' },
    Grey_94: { color: '#F0F0F0' },
    White_98: { color: '#FAFAFA' },
});

export default SODText;
