import React, { useState, forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import BSModal from './BSModal';

interface CompletedLeadFormData {
    totalBillAmount: string;
    serviceDetails: string;
    otherRemarks: string;
}

interface CompletedLeadFormModalProps {
    onSubmit: (data: CompletedLeadFormData) => void;
}

const CompletedLeadFormModal = forwardRef<
    BottomSheetModal,
    CompletedLeadFormModalProps
>(({ onSubmit }, ref) => {
    const [totalBillAmount, setTotalBillAmount] = useState('');
    const [serviceDetails, setServiceDetails] = useState('');
    const [otherRemarks, setOtherRemarks] = useState('');

    const isFormValid = totalBillAmount.trim() && serviceDetails.trim();

    const handleSubmit = () => {
        if (isFormValid) {
            onSubmit({
                totalBillAmount,
                serviceDetails,
                otherRemarks,
            });
            resetForm();
            if (ref && 'current' in ref && ref.current) {
                ref.current.dismiss();
            }
        }
    };

    const resetForm = () => {
        setTotalBillAmount('');
        setServiceDetails('');
        setOtherRemarks('');
    };

    const handleDismiss = () => {
        resetForm();
    };

    return (
        <BSModal
            bsModalRef={ref as React.RefObject<BottomSheetModal>}
            headerTitle="Complete Lead"
            snapPoints={['70%']}
            customOnDismiss={handleDismiss}>
            <View style={styles.container}>
                {/* Total Bill Amount */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Total Bill Amount</Text>
                    <BottomSheetTextInput
                        style={styles.textInput}
                        placeholder="Enter total bill amount"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={totalBillAmount}
                        onChangeText={setTotalBillAmount}
                    />
                </View>

                {/* Service Details */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Service Details</Text>
                    <BottomSheetTextInput
                        style={styles.textArea}
                        placeholder="Enter service details..."
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={serviceDetails}
                        onChangeText={setServiceDetails}
                    />
                </View>

                {/* Other Remarks */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Other Remarks</Text>
                    <BottomSheetTextInput
                        style={styles.textInput}
                        placeholder="Enter other remarks (optional)"
                        placeholderTextColor="#999"
                        value={otherRemarks}
                        onChangeText={setOtherRemarks}
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
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </BSModal>
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
    textInput: {
        backgroundColor: '#F7F8FA',
        borderRadius: 10,
        padding: 14,
        fontSize: 14,
        color: '#1C1F34',
        borderWidth: 1,
        borderColor: '#E8E8E8',
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
        backgroundColor: '#388E3C',
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
});

export default CompletedLeadFormModal;
