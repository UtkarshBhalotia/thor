import {
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Text, TouchableOpacity } from 'react-native';
import Common from '../assets/css/common';
import BSModal from './BSModal';
import { closeBSModal } from '../utils/BSModalUtils';
import SODText from '../assets/css/SODText';
import { commonIcons } from '../assets/svg';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

const DropDownModalWithCheckBox = (props: {
    dropDownModalRef: React.RefObject<BottomSheetModalMethods | null>;
    dropDownFormData: any;
    title: string;
    setDropDownModal: (value: boolean) => void;
    name: string | any;
    isFlatList?: boolean;
}) => {
    const { setValue, getValues, watch } = useFormContext();

    const previousBillArray = watch('previousBill');

    const renderItem = ({ item, index }: any) => {
        return (
            <TouchableOpacity
                style={[
                    Common.px16,
                    Common.py12,
                    Common.bottomBorder,
                    Common.dFlex,
                    Common.row,
                    Common.alignCenter,
                    Common.mr5,
                ]}
                onPress={() => {
                    setValue(
                        `previousBill.${index}.isChecked`,
                        !item.isChecked,
                    );
                    const countVal = getValues('count');
                    setValue(
                        'count',
                        !item.isChecked ? countVal - 1 : countVal + 1,
                    );
                    setValue(`firstSelectedName`, '');
                    for (let i = 0; i < previousBillArray.length; i++) {
                        if (previousBillArray[i].isChecked) {
                            setValue(
                                `firstSelectedName`,
                                previousBillArray[i].name,
                            );
                            break;
                        }
                    }
                    // closeBSModal(props.dropDownModalRef);
                    // props.setDropDownModal(false);
                }}>
                {item.isChecked
                    ? commonIcons('CheckedCheckbox')
                    : commonIcons('UnCheckedCheckbox')}

                {/* {svgs('common_svg', 'UnCheckedCheckbox')} */}
                <Text style={[SODText.MazuFS17, Common.ml10]}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    // const keyExtractor = React.useCallback(() => index, []);

    return (
        <BSModal
            bsModalRef={props.dropDownModalRef}
            snapPoints={['90%']}
            onCloseRequest={() => {
                closeBSModal(props.dropDownModalRef),
                    props.setDropDownModal(false);
            }}
            headerTitle={`Bill Sundry ${props.title}`}
            bgGradientType="blue"
            isFlatList={true}
            scrollViewStyle={{ backgroundColor: undefined }}>
            <BottomSheetView style={{ flex: 1 }}>
                <BottomSheetFlatList
                    data={previousBillArray}
                    renderItem={renderItem}
                    enableFooterMarginAdjustment={true}
                    initialNumToRender={15}
                    maxToRenderPerBatch={15}
                    keyExtractor={(item, index) => String(index)}
                    style={[
                        {
                            borderTopRightRadius: 12,
                            borderTopLeftRadius: 12,
                        },
                        Common.bgWhite,
                    ]}
                />
            </BottomSheetView>
        </BSModal>
    );
};

export default React.memo(DropDownModalWithCheckBox);
