import React, { forwardRef, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Common from '../assets/css/common';
import SODText from '../assets/css/SODText';
import { Regex_Patterns } from '../utils/regex';

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
            placeholderTextColor = "#8F8F8F",
            autoExpand,
            minHeight = 50,
            disallowUnicode,
            autoCapitalize,
            gradientColors = ['#5F60B9', '#8A8BDD', '#B5B6E8'],
        }: TInputFieldProps,
        ref: any,
    ) => {
        const [selectionState, setSelectionState] = useState<
            { start: number; end: number } | undefined
        >(undefined);
        const [height, setHeight] = useState<number>(minHeight);

        const handleChangeText = (text: string) => {
            let filteredText = text;
            if (disallowUnicode) {
                filteredText = text.replace(Regex_Patterns.stripUnicode, '');
            }
            if (onChangeText) {
                onChangeText(filteredText);
            }
        };

        return (
            <View style={Common.py12}>
                {/*
                 * A plain View owns the border geometry and the gradient sits
                 * behind it. react-native-linear-gradient has no Fabric support,
                 * so when it wraps the input directly its own padding is left
                 * out of the size it is given on iOS and the bottom edge of the
                 * border disappears.
                 */}
                <View style={styles.inputBorder}>
                    <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={StyleSheet.absoluteFill}
                    />
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
                        onChangeText={handleChangeText}
                        onContentSizeChange={(event) => {
                            if (!autoExpand || secureTextEntry) {
                                return;
                            }
                            // Adopt the reported content height as-is. Adding a
                            // padding offset here made every measurement pass
                            // report a taller frame than the last, so the field
                            // grew without bound instead of settling.
                            const measured = Math.max(
                                minHeight,
                                event.nativeEvent.contentSize.height,
                            );
                            setHeight((prev) =>
                                Math.abs(measured - prev) < 1 ? prev : measured,
                            );
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
                        // Only the auto-expanding variant is a text area. A
                        // single-line input centres its text vertically on its
                        // own, whereas a multiline one lays out from the top
                        // and ignores textAlignVertical on iOS.
                        multiline={autoExpand && !secureTextEntry}
                        autoFocus={autoFocus}
                        editable={isEditable}
                        scrollEnabled={autoExpand ? false : undefined}
                        keyboardType={keyboard}
                        selection={selectionState}
                        autoCapitalize={autoCapitalize}
                        style={[
                            Common.px16,
                            SODText.MazuInputText,
                            SODText.bold400,
                            autoExpand ? {} : Common.alignCenter,
                            autoExpand ? {} : Common.textVerticalCenter,
                            {
                                backgroundColor: '#F9FAFF',
                                color: '#1E1E58',
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
                </View>
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

const styles = StyleSheet.create({
    inputBorder: {
        borderRadius: 6,
        padding: 2, // This creates the border effect
        overflow: 'hidden', // Clips the gradient to the rounded corners
    },
});

export default SODTextInput;
