import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from 'react-native';
import { onboardingStyles as styles } from '../../../assets/css/onboardingStyles';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

interface Slide {
    id: string;
    title: string;
    description: string;
    image: any;
}

const slides: Slide[] = [
    {
        id: '1',
        title: 'Manage Reports',
        description: 'Effortlessly organize and access all your business reports in one central location.',
        image: require('../../../assets/img/manageReports.png'),
    },
    {
        id: '2',
        title: 'Track Leads',
        description: 'Never miss an opportunity by staying updated on every lead with real-time tracking.',
        image: require('../../../assets/img/track_leads.png'),
    },
    {
        id: '3',
        title: 'Increase Revenue',
        description: 'Boost your productivity and maximize growth with our streamlined service tools.',
        image: require('../../../assets/img/increaseRevenue.png'),
    },
];

const Onboarding = () => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const ref = useRef<FlatList>(null);
    const navigation = useNavigation<NavigationProp<any>>();

    const updateCurrentSlideIndex = (
        e: NativeSyntheticEvent<NativeScrollEvent>,
    ) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / styles.slide.width);
        setCurrentSlideIndex(currentIndex);
    };

    const goToNextSlide = () => {
        const nextSlideIndex = currentSlideIndex + 1;
        if (nextSlideIndex != slides.length) {
            const offset = nextSlideIndex * styles.slide.width;
            ref?.current?.scrollToOffset({ offset });
            setCurrentSlideIndex(nextSlideIndex);
        } else {
            navigation.navigate('Login');
        }
    };

    const Footer = () => {
        return (
            <View style={styles.footer}>
                {/* Pagination indicator */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentSlideIndex === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                {/* Render Buttons */}
                <View style={styles.buttonContainer}>
                    {currentSlideIndex === slides.length - 1 ? (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.buttonText}>Get Started</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.button}
                            onPress={goToNextSlide}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            <FlatList
                ref={ref}
                onMomentumScrollEnd={updateCurrentSlideIndex}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={slides}
                pagingEnabled
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <View style={styles.imageContainer}>
                            <Image source={item.image} style={styles.image} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            {/* <Text style={styles.description}>{item.description}</Text> */}
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
            <Footer />
        </SafeAreaView>
    );
};

export default Onboarding;
