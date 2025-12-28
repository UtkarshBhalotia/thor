import React, { useState, forwardRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import BSModal from './BSModal';

interface FollowUpLeadFormData {
    nextFollowUpDate: Date;
    followUpDetails: string;
}

interface FollowUpLeadFormModalProps {
    onSubmit: (data: FollowUpLeadFormData) => void;
}

const FollowUpLeadFormModal = forwardRef<
    BottomSheetModal,
    FollowUpLeadFormModalProps
>(({ onSubmit }, ref) => {
    const [nextFollowUpDate, setNextFollowUpDate] = useState<Date>(new Date());
    const [followUpDetails, setFollowUpDetails] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const isFormValid = followUpDetails.trim();

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = () => {
        if (isFormValid) {
            onSubmit({
                nextFollowUpDate,
                followUpDetails,
            });
            resetForm();
            if (ref && 'current' in ref && ref.current) {
                ref.current.dismiss();
            }
        }
    };

    const resetForm = () => {
        setNextFollowUpDate(new Date());
        setFollowUpDetails('');
        setShowDatePicker(false);
    };

    const handleDismiss = () => {
        resetForm();
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

    return (
        <>
            <BSModal
                bsModalRef={ref as React.RefObject<BottomSheetModal>}
                headerTitle="Follow Up Lead"
                snapPoints={['55%']}
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

                    {/* Follow Up Details */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Follow Up Details</Text>
                        <BottomSheetTextInput
                            style={styles.textArea}
                            placeholder="Enter follow up details..."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={followUpDetails}
                            onChangeText={setFollowUpDetails}
                        />
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            !isFormValid && styles.submitButtonDisabled,
                        ]}
                        onPress={handleSubmit}
                        disabled={!isFormValid}
                        activeOpacity={0.8}>
                        <Text style={styles.submitButtonText}>Send</Text>
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
