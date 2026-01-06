import React, { forwardRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import BSModal from './BSModal';

interface AcceptLeadFormData {
    amount: string;
}

interface AcceptLeadConfirmationModalProps {
    onSubmit: (data: AcceptLeadFormData) => void;
    leadDetails?: {
        leadNo: string;
        leadType: string;
        leadAmount: string;
        leadDate: string;
    };
    isLoading?: boolean;
}

const AcceptLeadConfirmationModal = forwardRef<
    BottomSheetModal,
    AcceptLeadConfirmationModalProps
>(({ onSubmit, leadDetails, isLoading = false }, ref) => {
    const handleSubmit = () => {
        const amountToSubmit = leadDetails?.leadAmount || '';
        onSubmit({ amount: amountToSubmit });
    };

    const handleDismiss = () => {
        // Form reset if needed in future
    };

    return (
        <BSModal
            bsModalRef={ref as React.RefObject<BottomSheetModal>}
            headerTitle="Accept Lead Confirmation"
            snapPoints={['50%']}
            customOnDismiss={handleDismiss}>
            <View style={styles.container}>
                {/* Lead Details Summary */}
                {leadDetails && (
                    <View style={styles.leadSummaryContainer}>
                        <Text style={styles.summaryTitle}>Lead Details</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Lead Number:
                            </Text>
                            <Text style={styles.summaryValue}>
                                {leadDetails.leadNo}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Service Type:
                            </Text>
                            <Text style={styles.summaryValue}>
                                {leadDetails.leadType}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Lead Amount:
                            </Text>
                            <Text style={styles.summaryValue}>
                                ₹ {leadDetails.leadAmount}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Lead Date:</Text>
                            <Text style={styles.summaryValue}>
                                {leadDetails.leadDate}
                            </Text>
                        </View>
                    </View>
                )}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        isLoading && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                    activeOpacity={0.8}>
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Text style={styles.submitButtonText}>Accept Lead</Text>
                    )}
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
    leadSummaryContainer: {
        backgroundColor: '#F7F8FA',
        borderRadius: 10,
        padding: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    summaryTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1C1F34',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 13,
        color: '#8F8F8F',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 13,
        color: '#1C1F34',
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
    },
    submitButton: {
        backgroundColor: '#6366F1',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#A5B4FC',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default AcceptLeadConfirmationModal;
