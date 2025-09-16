import React, { JSX, useCallback, useEffect, useState } from 'react';
import {
    Button,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import RNRestart from 'react-native-restart';
import Common from '../assets/css/common';
import LinearGradient from 'react-native-linear-gradient';

let timer: NodeJS.Timeout;

export const MAIN_UI = () => {
    const [count, setcount] = useState(10);
    const [pressed, setpressed] = useState(false);

    const throwError = () => {
        setpressed(true);
        timer = setInterval(() => {
            setcount((prev) => {
                if (prev > 0) {
                    return prev - 1;
                } else {
                    clearInterval(timer);
                    throw new Error('Error');
                }
            });
        }, 1000);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text style={{ marginBottom: 10 }}>MAIN CONTAINER</Text>
                {pressed ? (
                    <Text
                        style={{
                            fontSize: 18,
                        }}>{`wait for ${count} sec`}</Text>
                ) : (
                    <Button title="Throw Error" onPress={throwError} />
                )}
            </View>
        </SafeAreaView>
    );
};

export const FallBackUI = () => {
    return (
        <LinearGradient colors={['#c7d6ff', '#fafbff']} style={{ flex: 1 }}>
            <View style={styles.fallMainContainer}>
                {/* <Image
                    resizeMode="contain"
                    source={require('../assets/img/Busy.png')}
                    style={styles.fallImage}
                /> */}
                <Text style={styles.fallText}>Something Went Wrong !</Text>
                <Text style={styles.fallText}>Kindly restart app.</Text>
                <Pressable
                    style={[
                        Common.p10,
                        Common.bgBlue,
                        { borderRadius: 10, marginTop: 30 },
                    ]}
                    onPress={() => {
                        RNRestart.restart();
                    }}>
                    <Text
                        style={[
                            Common.fs14,
                            Common.textColorList,
                            Common.textColorWhite,
                            Common.bold500,
                        ]}>
                        Restart App
                    </Text>
                </Pressable>
            </View>
        </LinearGradient>
    );
};

class ErrorBoundary extends React.Component<
    { children: JSX.Element },
    { hasError: boolean }
> {
    constructor(props: { children: JSX.Element }) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error: any, info: any) {
        this.setState({ hasError: true });
        console.error('Error caught by ErrorBoundary: ', error, info);
    }

    render() {
        if (this.state.hasError) {
            return <FallBackUI />;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;

const styles = StyleSheet.create({
    fallMainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fallText: {
        marginVertical: 5,
        color: 'Black',
        fontSize: 20,
        fontWeight: '500',
    },
    fallImage: {
        marginTop: 10,
        marginBottom: 80,
    },
});
