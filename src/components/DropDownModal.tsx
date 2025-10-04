import React, { useState, useMemo } from 'react';
import {
    BottomSheetFlatList,
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useFormContext } from 'react-hook-form';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    TextInput,
    View,
} from 'react-native';
import Common from '../assets/css/common';
import SODText from '../assets/css/SODText';
import BSModal from '../components/BSModal';
import { closeBSModal } from '../utils/BSModalUtils';

const DropDownModal = (props: {
    dropDownModalRef: React.RefObject<BottomSheetModalMethods | null>;
    title: string;
    dropDownFormData: any;
    setDropDownModal?: (value: boolean) => void;
    name: string | any;
    isFlatList?: boolean;
    scrollRef?: React.RefObject<ScrollView>;
    enableSearch?: boolean;
}) => {
    const { setValue, setFocus } = useFormContext();
    const [searchQuery, setSearchQuery] = useState('');

    // Filter data based on search query
    const filteredData = useMemo(() => {
        if (!props.enableSearch || !searchQuery.trim()) {
            return props.dropDownFormData || [];
        }

        return (props.dropDownFormData || []).filter((item: string) =>
            item.toLowerCase().includes(searchQuery.toLowerCase()),
        );
    }, [props.dropDownFormData, searchQuery, props.enableSearch]);

    const renderItem = ({ item }: any) => {
        return (
            <TouchableOpacity
                style={[Common.px16, Common.py12, Common.bottomBorder]}
                onPress={() => {
                    setValue(props.name, item);
                    closeBSModal(props.dropDownModalRef);
                    setSearchQuery(''); // Clear search when item is selected
                }}>
                <Text style={[SODText.MazuFS17]}> {item}</Text>
            </TouchableOpacity>
        );
    };

    const keyExtractor = React.useCallback((item: any) => item, []);

    return (
        <BSModal
            bsModalRef={props.dropDownModalRef}
            snapPoints={['90%']}
            onCloseRequest={() => {
                closeBSModal(props.dropDownModalRef);
                setSearchQuery(''); // Clear search when modal closes
                //props.setDropDownModal(false);
            }}
            headerTitle={props.title}
            bgGradientType="blue"
            isFlatList={true}
            scrollViewStyle={{ backgroundColor: undefined }}>
            <BottomSheetView style={{ flex: 1 }}>
                {/* Search Input */}
                {props.enableSearch && (
                    <View style={searchStyles.searchContainer}>
                        <TextInput
                            style={searchStyles.searchInput}
                            placeholder="Search..."
                            placeholderTextColor="#8F8F8F"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                style={searchStyles.clearButton}
                                onPress={() => setSearchQuery('')}
                                activeOpacity={0.7}>
                                <Text style={searchStyles.clearButtonText}>
                                    ✕
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Results Count */}
                {props.enableSearch && (
                    <View style={searchStyles.resultsContainer}>
                        <Text style={searchStyles.resultsText}>
                            {filteredData.length} result
                            {filteredData.length !== 1 ? 's' : ''}
                            {searchQuery.trim() && ` for "${searchQuery}"`}
                        </Text>
                    </View>
                )}

                <BottomSheetFlatList
                    data={filteredData}
                    renderItem={renderItem}
                    enableFooterMarginAdjustment={true}
                    initialNumToRender={15}
                    maxToRenderPerBatch={15}
                    keyExtractor={keyExtractor}
                    style={[
                        {
                            borderTopRightRadius: 12,
                            borderTopLeftRadius: 12,
                        },
                        Common.bgWhite,
                    ]}
                    ListEmptyComponent={
                        props.enableSearch && searchQuery.trim() ? (
                            <View style={searchStyles.emptyContainer}>
                                <Text style={searchStyles.emptyText}>
                                    No results found for "{searchQuery}"
                                </Text>
                            </View>
                        ) : null
                    }
                />
            </BottomSheetView>
        </BSModal>
    );
};

// Search styles
const searchStyles = {
    searchContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        paddingVertical: 4,
    },
    clearButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#CCCCCC',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        marginLeft: 8,
    },
    clearButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold' as const,
    },
    resultsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        backgroundColor: '#F8F9FA',
    },
    resultsText: {
        fontSize: 12,
        color: '#666666',
        fontStyle: 'italic' as const,
    },
    emptyContainer: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center' as const,
    },
    emptyText: {
        fontSize: 16,
        color: '#999999',
        textAlign: 'center' as const,
    },
};

export default React.memo(DropDownModal);
