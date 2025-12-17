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

    const previousServiceArray = watch('previousService');

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
                    // Create a new array with updated checkbox state
                    const updatedArray = [...previousServiceArray];
                    updatedArray[index] = {
                        ...updatedArray[index],
                        isChecked: !item.isChecked,
                    };

                    // Update the form with the new array
                    setValue('previousService', updatedArray);

                    // Calculate count from checked items
                    const checkedCount = updatedArray.filter(
                        (serviceItem: any) => serviceItem.isChecked,
                    ).length;
                    console.log(
                        'Updated count:',
                        checkedCount,
                        'for item:',
                        item.name,
                        'isChecked:',
                        !item.isChecked,
                    );
                    setValue('count', checkedCount);

                    // Update first selected name
                    const firstChecked = updatedArray.find(
                        (serviceItem: any) => serviceItem.isChecked,
                    );
                    setValue(
                        'firstSelectedName',
                        firstChecked ? firstChecked.name : '',
                    );
                }}>
                {item.isChecked
                    ? commonIcons('CheckedCheckbox')
                    : commonIcons('UnCheckedCheckbox')}

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
            headerTitle={`Select Service ${props.title}`}
            bgGradientType="blue"
            isFlatList={true}
            scrollViewStyle={{ backgroundColor: undefined }}>
            <BottomSheetView style={{ flex: 1 }}>
                <BottomSheetFlatList
                    data={previousServiceArray}
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
