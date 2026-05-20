import React, { useState, forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import BSModal from './BSModal';

interface DeniedReason {
    id: string | number;
    reason: string;
}

interface DeniedLeadFormModalProps {
    onSubmit: (reason: string) => void;
    deniedReasons?: DeniedReason[];
    isLoadingReasons?: boolean;
}

const DeniedLeadFormModal = forwardRef<
    BottomSheetModal,
    DeniedLeadFormModalProps
>(({ onSubmit, deniedReasons = [], isLoadingReasons = false }, ref) => {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [customReason, setCustomReason] = useState<string>('');
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

    const isOthersSelected = selectedReason.toLowerCase() === 'others';
    const isReadyToSubmit = isOthersSelected ? customReason.trim().length > 0 : selectedReason !== '';

    const handleSubmit = () => {
        if (isReadyToSubmit) {
            onSubmit(isOthersSelected ? customReason.trim() : selectedReason);
            setSelectedReason('');
            setCustomReason('');
            if (ref && 'current' in ref && ref.current) {
                ref.current.dismiss();
            }
        }
    };

    const handleDismiss = () => {
        setSelectedReason('');
        setCustomReason('');
    };

    const handleReasonSelect = (reason: string) => {
        setSelectedReason(reason);
        if (reason.toLowerCase() !== 'others') {
            setCustomReason('');
        }
    };

    return (
        <BSModal
            bsModalRef={ref as React.RefObject<BottomSheetModal>}
            headerTitle="Denied Lead"
            snapPoints={isOthersSelected ? ['100%'] : ['85%']}
            customOnDismiss={handleDismiss}>
            <View style={styles.container}>
                <View style={[styles.inputContainer, { flex: undefined }]}>
                    <Text style={styles.label}>Select Denied Reason</Text>

                    {isLoadingReasons ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#B71C1C" />
                            <Text style={styles.loadingText}>Loading reasons...</Text>
                        </View>
                    ) : deniedReasons.length > 0 ? (
                        <View style={styles.reasonsContainer}>
                            <BottomSheetScrollView 
                                style={styles.reasonsScrollView}
                                showsVerticalScrollIndicator={true}
                                onScroll={(event) => {
                                    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                                    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                                    setIsScrolledToBottom(isBottom);
                                }}>
                                {deniedReasons.map((item, index) => (
                                    <TouchableOpacity
                                        key={item.id || index}
                                        style={[
                                            styles.radioOption,
                                            selectedReason === item.reason && styles.radioOptionSelected,
                                        ]}
                                        onPress={() => handleReasonSelect(item.reason)}
                                        activeOpacity={0.7}>
                                        <View style={styles.radioCircle}>
                                            {selectedReason === item.reason && (
                                                <View style={styles.radioCircleInner} />
                                            )}
                                        </View>
                                        <Text
                                            style={[
                                                styles.radioText,
                                                selectedReason === item.reason && styles.radioTextSelected,
                                            ]}>
                                            {item.reason}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </BottomSheetScrollView>
                            {!isScrolledToBottom && deniedReasons.length > 3 && (
                                <LinearGradient
                                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.95)', '#FFFFFF']}
                                    style={styles.scrollIndicator}
                                    pointerEvents="none">
                                    <Text style={styles.scrollIndicatorText}>⌄ Scroll for more</Text>
                                </LinearGradient>
                            )}
                        </View>
                    ) : (
                        <View style={styles.noReasonsContainer}>
                            <Text style={styles.noReasonsText}>No reasons available</Text>
                        </View>
                    )}

                    {isOthersSelected && (
                        <View style={styles.customReasonContainer}>
                            <Text style={styles.label}>Specify Reason *</Text>
                            <BottomSheetTextInput
                                style={styles.textArea}
                                placeholder="Enter your reason here..."
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={customReason}
                                onChangeText={setCustomReason}
                                autoFocus={true}
                            />
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        !isReadyToSubmit && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!isReadyToSubmit}
                    activeOpacity={0.8}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </BSModal>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 30,
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1F34',
        marginBottom: 12,
    },
    reasonsContainer: {
        position: 'relative',
    },
    reasonsScrollView: {
        maxHeight: 400,
    },
    scrollIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 8,
    },
    scrollIndicatorText: {
        fontSize: 12,
        color: '#B71C1C',
        fontWeight: '600',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    radioOptionSelected: {
        backgroundColor: '#FFEBEE',
        borderColor: '#B71C1C',
    },
    radioCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#B71C1C',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    radioCircleInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#B71C1C',
    },
    radioText: {
        fontSize: 14,
        color: '#1C1F34',
        flex: 1,
    },
    radioTextSelected: {
        fontWeight: '600',
        color: '#B71C1C',
    },
    customReasonContainer: {
        marginTop: 20,
    },
    textArea: {
        backgroundColor: '#F7F8FA',
        borderRadius: 10,
        padding: 14,
        fontSize: 14,
        color: '#1C1F34',
        minHeight: 100,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#8F8F8F',
    },
    noReasonsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    noReasonsText: {
        fontSize: 14,
        color: '#8F8F8F',
    },
    submitButton: {
        backgroundColor: '#B71C1C',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default DeniedLeadFormModal;
