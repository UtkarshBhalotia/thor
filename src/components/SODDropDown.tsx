import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Keyboard, Text, TouchableOpacity, View } from 'react-native';
import Common from '../assets/css/common';
import SODText from '../assets/css/SODText';
import { openBSModal } from '../utils/BSModalUtils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import DropDownModal from './DropDownModal';
import DropDownModalWithCheckBox from './DropDownModalWithCheckBox';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SODDropDown = forwardRef(
    (
        {
            errorMsg,
            dropDownFormData,
            value,
            title,
            required,
            name,
            ischeckBoxReq,
            type,
            disabled,
            scrollRef,
        }: TSODDropDownProps,
        ref: any,
    ) => {
        console.log('dropDownModalRef');
        const dropDownModalRef = useRef<BottomSheetModalMethods | null>(null);
        //const [dropDownModal, setDropDownModal] = useState(false);
        // useEffect(() => {
        //     if (dropDownModal) {
        //         openBSModal(dropDownModalRef);
        //     }
        // }, [dropDownModal]);

        return (
            <View
                style={[
                    Common.row,
                    Common.spaceBetween,
                    Common.px16,
                    Common.py4,
                    Common.alignCenter,
                ]}>
                <Text
                    numberOfLines={3}
                    style={[
                        SODText.MazuFS17,
                        Common.viewHeight,
                        Common.mr8,
                        Common.mb4,
                        { opacity: disabled ? 1 : 0.5 },
                    ]}>
                    {title}
                    <Text style={[SODText.Red_31]}>{required ? '*' : ''}</Text>
                </Text>
                <View style={[Common.dFlex, { width: '60%' }]}>
                    <TouchableOpacity
                        //  disabled={disabled ? false : true}
                        style={[
                            Common.row,
                            Common.px16,
                            Common.alignCenter,
                            Common.spaceBetween,
                            {
                                backgroundColor: '#F0F4FD',
                                paddingHorizontal: 6,
                                borderRadius: 6,
                                width: '100%',
                                borderWidth: 1,
                                borderColor: errorMsg ? '#C50F1F' : '#F0F4FD',
                                opacity: disabled ? 1 : 0.5,
                            },
                            Common.py8,
                        ]}
                        onPress={() => {
                            console.log('Pressed', dropDownModalRef);

                            Keyboard.dismiss();

                            openBSModal(dropDownModalRef);
                        }}>
                        <Text
                            style={[
                                { width: '85%' },
                                SODText.MazuInputText,
                                SODText.bold400,
                                Common.textVerticalCenter,
                            ]}>
                            {value}
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#8F8F8F"
                        />
                    </TouchableOpacity>

                    {ischeckBoxReq ? (
                        <DropDownModalWithCheckBox
                            dropDownModalRef={dropDownModalRef}
                            dropDownFormData={dropDownFormData}
                            name={name}
                            title={title}
                            setDropDownModal={() => { }}
                        />
                    ) : (
                        <DropDownModal
                            dropDownModalRef={dropDownModalRef}
                            dropDownFormData={dropDownFormData}
                            name={name}
                            title={title}
                            setDropDownModal={() => { }}
                            scrollRef={scrollRef}
                            enableSearch={true}
                        />
                    )}
                    {errorMsg && (
                        <Text style={[{ color: '#C50F1F' }, Common.textRight]}>
                            {errorMsg}
                        </Text>
                    )}
                </View>
            </View>
        );
    },
);

export default SODDropDown;
