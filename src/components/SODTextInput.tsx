import React, { forwardRef, useState } from 'react';
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
        }: TInputFieldProps,
        ref: any,
    ) => {
        const [selectionState, setSelectionState] = useState<
            { start: number; end: number } | undefined
        >(undefined);

        return (
            <View style={Common.py12}>
                <LinearGradient
                    colors={['#1E3A8A', '#4682B4', '#87CEEB']}
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
                        scrollEnabled={false}
                        keyboardType={keyboard}
                        selection={selectionState}
                        style={[
                            Common.px16,
                            SODText.MazuInputText,
                            SODText.bold400,
                            Common.alignCenter,
                            Common.textVerticalCenter,
                            {
                                backgroundColor: '#F0F4FD',
                                paddingHorizontal: 6,
                                borderRadius: 5, // Slightly smaller to account for gradient border
                                width: '100%',
                                height: 50,
                                borderWidth: 0, // Remove border since gradient provides it
                                opacity: isEditable ? 1 : 0.5,
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
