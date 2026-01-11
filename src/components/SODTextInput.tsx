import React, { forwardRef, useState, useEffect } from 'react';
import { Platform, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Common from '../assets/css/common';
import SODText from '../assets/css/SODText';

const SODTextInput = forwardRef(
    (
        {
            title,
            secureTextEntry,
            onChangeText,
            onBlurText,
            onFocusText,
            value,
            errorMsg,
            required,
            maxlength,
            keyboard,
            autoFocus,
            isEditable,
            placeholder,
            placeholderTextColor,
            autoExpand,
            minHeight = 50,
        }: TInputFieldProps,
        ref: any,
    ) => {
        const [selectionState, setSelectionState] = useState<
            { start: number; end: number } | undefined
        >(undefined);
        const [height, setHeight] = useState<number>(minHeight);

        // Initialize height based on value when component loads or value changes
        useEffect(() => {
            if (autoExpand && value && !secureTextEntry) {
                // Estimate height based on content
                const lines = value.split('\n').length;
                const estimatedHeight = Math.max(
                    minHeight,
                    lines * 20 + 16,
                );
                setHeight(estimatedHeight);
            } else if (!autoExpand) {
                setHeight(minHeight);
            }
        }, [value, autoExpand, secureTextEntry, minHeight]);

        return (
            <View style={Common.py12}>
                <LinearGradient
                    colors={['#5F60B9', '#8A8BDD', '#B5B6E8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        borderRadius: 6,
                        padding: 2, // This creates the border effect
                    }}>
                    <TextInput
                        ref={ref}
                        returnKeyType="done"
                        submitBehavior="blurAndSubmit"
                        placeholder={placeholder}
                        placeholderTextColor={placeholderTextColor}
                        onFocus={() => {
                            // Handle existing onFocus logic
                            onFocusText && onFocusText();

                            // Handling cursor
                            if (Platform.OS === 'android' && !true) {
                                // !multiline but this component uses multiline
                                setSelectionState(
                                    value
                                        ? {
                                            start: value.length,
                                            end: value.length,
                                        }
                                        : undefined,
                                );
                                setTimeout(() => {
                                    setSelectionState(undefined);
                                }, 50);
                            }
                        }}
                        onChangeText={onChangeText}
                        onContentSizeChange={(event) => {
                            if (autoExpand && !secureTextEntry) {
                                const newHeight = Math.max(
                                    minHeight,
                                    event.nativeEvent.contentSize.height + 16,
                                );
                                setHeight(newHeight);
                            }
                        }}
                        onBlur={() => {
                            // Handle existing onBlur logic
                            onBlurText && onBlurText();

                            // Handling cursor - reset to start (disabled for multiline)
                            if (Platform.OS === 'android' && !true) {
                                // !multiline but this component uses multiline
                                setSelectionState({
                                    start: 0,
                                    end: 0,
                                });
                            }
                        }}
                        value={value}
                        secureTextEntry={secureTextEntry}
                        maxLength={maxlength}
                        multiline={!secureTextEntry}
                        autoFocus={autoFocus}
                        editable={isEditable}
                        scrollEnabled={autoExpand ? false : false}
                        keyboardType={keyboard}
                        selection={selectionState}
                        style={[
                            Common.px16,
                            SODText.MazuInputText,
                            SODText.bold400,
                            autoExpand ? {} : Common.alignCenter,
                            autoExpand ? {} : Common.textVerticalCenter,
                            {
                                backgroundColor: '#F9FAFF',
                                paddingHorizontal: 6,
                                borderRadius: 5, // Slightly smaller to account for gradient border
                                width: '100%',
                                height: autoExpand ? height : 50,
                                borderWidth: 0, // Remove border since gradient provides it
                                opacity: isEditable ? 1 : 0.5,
                                textAlignVertical: autoExpand ? 'top' : 'center',
                            },
                            Common.py8,
                        ]}
                    />
                </LinearGradient>
                {errorMsg ? (
                    <Text style={[{ color: '#C50F1F' }, Common.textRight]}>
                        {errorMsg}
                    </Text>
                ) : (
                    <></>
                )}
            </View>
        );
    },
);

export default SODTextInput;
