import React, { useState, forwardRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { BottomSheetModal, BottomSheetTextInput, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import BSModal from './BSModal';

interface FollowUpReason {
    id: string | number;
    reason: string;
}

interface FollowUpLeadFormData {
    nextFollowUpDate: Date;
    followUpDetails: string;
}

interface FollowUpLeadFormModalProps {
    onSubmit: (data: FollowUpLeadFormData) => void;
    followUpReasons?: FollowUpReason[];
    isLoadingReasons?: boolean;
}

const FollowUpLeadFormModal = forwardRef<
    BottomSheetModal,
    FollowUpLeadFormModalProps
>(({ onSubmit, followUpReasons = [], isLoadingReasons = false }, ref) => {
    const [nextFollowUpDate, setNextFollowUpDate] = useState<Date>(new Date());
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [customReason, setCustomReason] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

    const isOthersSelected = selectedReason.toLowerCase() === 'others';
    // Valid if reason is selected (and custom reason if "others") OR (fallback to just text if no reasons)
    // Actually, following logic: If reasons exist, user MUST select one. If "others", MUST enter text.
    // If no reasons passed (fallback), maybe just rely on text? But API is implemented now.
    
    const isReasonValid = isOthersSelected ? customReason.trim().length > 0 : selectedReason !== '';

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = () => {
        if (isReasonValid) {
            onSubmit({
                nextFollowUpDate,
                followUpDetails: isOthersSelected ? customReason.trim() : selectedReason,
            });
            resetForm();
            if (ref && 'current' in ref && ref.current) {
                ref.current.dismiss();
            }
        }
    };

    const resetForm = () => {
        setNextFollowUpDate(new Date());
        setSelectedReason('');
        setCustomReason('');
        setShowDatePicker(false);
    };

    const handleDismiss = () => {
        resetForm();
    };

    const handleReasonSelect = (reason: string) => {
        setSelectedReason(reason);
        if (reason.toLowerCase() !== 'others') {
            setCustomReason('');
        }
    };

    // Generate next 30 days for selection
    const generateDateOptions = () => {
        const dates: Date[] = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const getDateLabel = (date: Date) => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            const days = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ];
            const months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
            ];
            return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
        }
    };

    const dateOptions = generateDateOptions();

    // Snap points: if others selected (keyboard shown), expand to 90% or 100%. Else ~60-70%
    const snapPoints = isOthersSelected ? ['90%'] : ['70%'];

    return (
        <>
            <BSModal
                bsModalRef={ref as React.RefObject<BottomSheetModal>}
                headerTitle="Follow Up Lead"
                snapPoints={snapPoints}
                customOnDismiss={handleDismiss}>
                <View style={styles.container}>
                    {/* Next Follow Up Date */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Next Follow Up Date</Text>
                        <TouchableOpacity
                            style={styles.datePickerButton}
                            onPress={() => setShowDatePicker(true)}
                            activeOpacity={0.7}>
                            <Text style={styles.dateText}>
                                {formatDate(nextFollowUpDate)}
                            </Text>
                            <Text style={styles.calendarIcon}>📅</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Reasons List */}
                    <View style={[styles.inputContainer, { flex: 1, marginBottom: 0 }]}>
                        <Text style={styles.label}>Select Follow Up Reason</Text>

                         {isLoadingReasons ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#7B1FA2" />
                                <Text style={styles.loadingText}>Loading reasons...</Text>
                            </View>
                         ) : followUpReasons.length > 0 ? (
                            <View style={styles.reasonsContainer}>
                                <BottomSheetScrollView 
                                    style={styles.reasonsScrollView}
                                    showsVerticalScrollIndicator={true}
                                    onScroll={(event) => {
                                        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                                        const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                                        setIsScrolledToBottom(isBottom);
                                    }}>
                                    {followUpReasons.map((item, index) => (
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
                                {!isScrolledToBottom && followUpReasons.length > 3 && (
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
                                {/* Fallback to manual entry if needed, but for now enforcing selection */}
                            </View>
                        )}
                        
                        {isOthersSelected && (
                            <View style={styles.customReasonContainer}>
                                <Text style={styles.label}>Follow Up Details *</Text>
                                <BottomSheetTextInput
                                    style={styles.textArea}
                                    placeholder="Enter follow up details..."
                                    placeholderTextColor="#999"
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    value={customReason}
                                    onChangeText={setCustomReason}
                                />
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !isReasonValid && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={!isReasonValid}
                        activeOpacity={0.8}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </BSModal>

            {/* Custom Date Picker Modal */}
            <Modal
                visible={showDatePicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowDatePicker(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.datePickerModal}>
                        <View style={styles.datePickerHeader}>
                            <Text style={styles.datePickerTitle}>
                                Select Follow Up Date
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            style={styles.dateList}
                            showsVerticalScrollIndicator={false}>
                            {dateOptions.map((date, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.dateOption,
                                        date.toDateString() ===
                                            nextFollowUpDate.toDateString() &&
                                            styles.dateOptionSelected,
                                    ]}
                                    onPress={() => {
                                        setNextFollowUpDate(date);
                                        setShowDatePicker(false);
                                    }}>
                                    <Text
                                        style={[
                                            styles.dateOptionText,
                                            date.toDateString() ===
                                                nextFollowUpDate.toDateString() &&
                                                styles.dateOptionTextSelected,
                                        ]}>
                                        {getDateLabel(date)}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.dateOptionSubText,
                                            date.toDateString() ===
                                                nextFollowUpDate.toDateString() &&
                                                styles.dateOptionTextSelected,
                                        ]}>
                                        {formatDate(date)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
});

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 20, // Reduced from 30 to fit better
        flex: 1,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1F34',
        marginBottom: 8,
    },
    datePickerButton: {
        backgroundColor: '#F7F8FA',
        borderRadius: 10,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 14,
        color: '#1C1F34',
        fontWeight: '500',
    },
    calendarIcon: {
        fontSize: 18,
    },
    reasonsContainer: {
        position: 'relative',
    },
    reasonsScrollView: {
        maxHeight: 250, // Limit height
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
        color: '#7B1FA2',
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
        backgroundColor: '#F3E5F5',
        borderColor: '#7B1FA2',
    },
    radioCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#7B1FA2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    radioCircleInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#7B1FA2',
    },
    radioText: {
        fontSize: 14,
        color: '#1C1F34',
        flex: 1,
    },
    radioTextSelected: {
        fontWeight: '600',
        color: '#7B1FA2',
    },
    customReasonContainer: {
        marginTop: 10,
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
        marginBottom: 10,
    },
    loadingContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#8F8F8F',
    },
    noReasonsContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noReasonsText: {
        fontSize: 14,
        color: '#8F8F8F',
    },
    submitButton: {
        backgroundColor: '#7B1FA2',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    // Custom Date Picker Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    datePickerModal: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '60%',
    },
    datePickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F5',
    },
    datePickerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1F34',
    },
    closeButton: {
        fontSize: 20,
        color: '#8F8F8F',
        padding: 4,
    },
    dateList: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },
    dateOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginVertical: 4,
        backgroundColor: '#F7F8FA',
    },
    dateOptionSelected: {
        backgroundColor: '#7B1FA2',
    },
    dateOptionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1F34',
    },
    dateOptionSubText: {
        fontSize: 13,
        color: '#8F8F8F',
    },
    dateOptionTextSelected: {
        color: '#FFFFFF',
    },
});

export default FollowUpLeadFormModal;
