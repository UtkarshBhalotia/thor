import {
    BottomSheetBackdrop,
    BottomSheetFooter,
    BottomSheetModal,
    BottomSheetScrollView,
    BottomSheetView,
    TouchableOpacity,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, StyleProp, Text, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ToastConfig } from 'react-native-toast-message';
import SODErrorToast from './ErrorToast';
import SODText from '../assets/css/SODText';
import Common from '../assets/css/common';
import { SODColors } from '../assets/colors';
import { closeBSModal, useBottomSheetBackHandler } from '../utils/BSModalUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BSModal = ({
    customBackButtonFlag = false,
    removeHeader = false,
    backButtonVisible = true,
    bgGradientType = 'no gradient',
    backButtonType = 'normal',
    handleIndicatorColor = 'default',
    backdropComponent,
    customHandleChangePosition,
    backdropPressBehavior,
    backdropOnPress,
    customOnDismiss,
    headerTitleBelowComponent,
    showCloseButton = true,
    onClosePress,
    ...props
}: BSModalProps) => {
    const footer = props.footer ? props.footer : <></>;
    const [modalIndex, setModalIndex] = useState(props?.index || -1);
    const isFlatList =
        props.isFlatList !== undefined ? props.isFlatList : false;

    const { bottom, top } = useSafeAreaInsets();

    const defaultSnapPoints = useMemo(() => {
        return Platform.OS === 'android' ? ['80%'] : ['90%'];
    }, []);

    const gradientColor = useMemo(() => {
        if (props.customGradientColor) return props.customGradientColor;
        switch (bgGradientType) {
            case 'no gradient':
                return '#FFF';
            case 'blue':
                return '#d8e5f8';
            case 'pink':
                return '#FDDEEC';
            case 'purple':
                return '#E1DCFF';
            default:
                return '#FFF';
        }
    }, [bgGradientType, props.customGradientColor]);

    // For backbutton handler
    const { handleSheetPositionChange } = useBottomSheetBackHandler(
        props.bsModalRef,
        customBackButtonFlag,
        props?.customBackButtonFn,
    );

    useEffect(() => {
        // Handles the backhandler if change in customBackButtonFn
        if (!customBackButtonFlag) {
            handleSheetPositionChange(modalIndex);
        } else {
            handleSheetPositionChange(modalIndex);
        }
    }, [customBackButtonFlag]);

    const backButtonHandler = useCallback(() => {
        if (customBackButtonFlag === false) closeBSModal(props.bsModalRef);
        props.customBackButtonFn && props.customBackButtonFn();
    }, [customBackButtonFlag]);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                pressBehavior={backdropPressBehavior}
                disappearsOnIndex={-1}
                opacity={0.8}
                appearsOnIndex={0}
                onPress={() => {
                    if (backdropOnPress) backdropOnPress();
                }}
            />
        ),
        [backdropPressBehavior, backdropOnPress],
    );

    const renderFooter = (props: any) => (
        <BottomSheetFooter {...props} bottomInset={0} style={[Common.bgWhite]}>
            {footer}
        </BottomSheetFooter>
    );

    const toastConfig: ToastConfig = {
        mazuError: (props) => <SODErrorToast {...props} />,
    };

    const handleIndicatorMemoColor = useMemo<StyleProp<ViewStyle>>(() => {
        if (handleIndicatorColor === 'grey') {
            return {
                backgroundColor: SODColors.Grey_82,
            };
        }
        return {};
    }, [handleIndicatorColor]);

    return (
        <BottomSheetModal
            handleIndicatorStyle={handleIndicatorMemoColor}
            enableDynamicSizing={false}
            ref={props.bsModalRef}
            index={props?.index || 0}
            snapPoints={props?.snapPoints || defaultSnapPoints}
            topInset={
                props?.inset ? (props.inset === 'top' ? top : bottom) : top
            }
            onDismiss={() => {
                if (customOnDismiss) {
                    customOnDismiss();
                }
            }}
            // onChange={handleSheetChanges}
            // enableDynamicSizing={true}
            // animationConfigs={animationConfigs}
            keyboardBlurBehavior={props?.keyboardBlurBehavior || 'restore'}
            enableContentPanningGesture={
                props.enableContentPanningGesture !== undefined
                    ? props.enableContentPanningGesture
                    : true
            }
            enableHandlePanningGesture={
                props.enableHandlePanningGesture !== undefined
                    ? props.enableHandlePanningGesture
                    : true
            }
            enableOverDrag={props.enableOverDrag ? props.enableOverDrag : false} //scroll instead of move up
            onChange={(index) => {
                setModalIndex(index);
                if (customHandleChangePosition) {
                    customHandleChangePosition(index);
                }
                handleSheetPositionChange(index);
                if (index === -1) {
                    if (props.onCloseRequest) props.onCloseRequest();
                }
            }}
            keyboardBehavior={props?.keyboardBehavior || 'interactive'}
            backdropComponent={
                backdropComponent ? backdropComponent : renderBackdrop
            }
            stackBehavior={props?.stackBehavior || 'push'}
            //android_keyboardInputMode="adjustResize"
            footerComponent={renderFooter}
            handleStyle={[
                {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    backgroundColor: props.nonGradientBackGroundColor
                        ? props.nonGradientBackGroundColor
                        : gradientColor,
                },
                props.handleStyle && props.handleStyle,
            ]}>
            <LinearGradient
                colors={[gradientColor, '#F7F7F7', '#F7F7F7']} // Purple to peach gradient
                start={{ x: 0.5, y: 0 }} // Gradient starts at the top center
                end={{ x: 0.5, y: 1 }} // Start and end colors of the gradient
                style={[Common.viewHeight]}>
                <BottomSheetView
                    style={[
                        Common.viewHeight,
                        {
                            backgroundColor:
                                props.nonGradientBackGroundColor &&
                                props.nonGradientBackGroundColor,
                        },
                    ]}>
                    {/* HEADER */}
                    {!removeHeader ? (
                        <BottomSheetView
                            style={[
                                Common.dFlex,
                                Common.row,
                                Common.alignCenter,
                                Common.mb15,
                                Common.px16,
                                Common.mt5,
                                props.headerStyle && props.headerStyle,
                            ]}>
                            <BottomSheetView
                                style={[
                                    Common.dFlex,
                                    Common.row,
                                    Common.viewHeight,
                                    Common.alignCenter,
                                    Common.justifyCenter,
                                ]}>
                                {showCloseButton && (
                                    <TouchableOpacity
                                        style={[Common.mr20]}
                                        onPress={() => {
                                            if (onClosePress) {
                                                onClosePress();
                                            } else {
                                                closeBSModal(props.bsModalRef);
                                            }
                                        }}>
                                        <Ionicons
                                            name="chevron-back"
                                            size={24}
                                            color="#1C1F34"
                                        />
                                    </TouchableOpacity>
                                )}
                                <BottomSheetView style={[Common.viewHeight]}>
                                    <Text
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                        style={[
                                            SODText.MazuFS22,
                                            SODText.bold600,
                                            SODText.Black_23,
                                            props.headerTitleTextStyle &&
                                            props.headerTitleTextStyle,
                                        ]}>
                                        {props.headerTitle}
                                    </Text>
                                    {headerTitleBelowComponent &&
                                        headerTitleBelowComponent}
                                </BottomSheetView>
                            </BottomSheetView>
                            <TouchableOpacity
                                style={[
                                    Common.dFlex,
                                    Common.row,
                                    Common.alignCenter,
                                    props.headerRightButtonStyle &&
                                    props.headerRightButtonStyle,
                                ]}
                                onPress={
                                    props.headerRightButtonOnPress &&
                                    props.headerRightButtonOnPress
                                }>
                                {props.headerRightButtonTitle &&
                                    !props.headerRightButtonComponent && (
                                        <Text
                                            style={[
                                                Common.textCenter,
                                                Common.bgWhite,
                                                Common.px8,
                                                Common.py4,
                                                Common.br8,
                                                props.headerRightButtonTextStyle &&
                                                props.headerRightButtonTextStyle,
                                            ]}>
                                            {props.headerRightButtonTitle}
                                        </Text>
                                    )}
                                {props.headerRightButtonComponent &&
                                    !props.headerRightButtonTitle &&
                                    props.headerRightButtonComponent}
                            </TouchableOpacity>
                        </BottomSheetView>
                    ) : (
                        <></>
                    )}

                    {/* BODY */}
                    {isFlatList ? (
                        props.children
                    ) : (
                        <BottomSheetScrollView
                            style={[
                                bgGradientType === 'no gradient' &&
                                    !props?.customGradientColor
                                    ? {}
                                    : {
                                        marginHorizontal: 16,
                                        borderTopRightRadius: 12,
                                        borderTopLeftRadius: 12,
                                    },
                                Common.bgWhite,
                                props.scrollViewStyle && props.scrollViewStyle,
                            ]}
                            contentContainerStyle={
                                props.scrollViewContentContainerStyle &&
                                props.scrollViewContentContainerStyle
                            }
                            showsVerticalScrollIndicator={true}
                            ref={props.scrollViewRef}
                            enableFooterMarginAdjustment={true}
                            keyboardShouldPersistTaps={'handled'}>
                            {props.children}
                        </BottomSheetScrollView>
                    )}
                </BottomSheetView>
            </LinearGradient>
            {/* <Toast config={toastConfig} /> */}
        </BottomSheetModal>
    );
};

export default React.memo(BSModal);
