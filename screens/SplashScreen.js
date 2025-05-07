import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Image } from 'react-native';

const QosylAppAnimation = ({ navigation }) => { // Ensure navigation is passed as a prop
    const [letterAnimations, setLetterAnimations] = useState([]);
    const loadingRotation = new Animated.Value(0);

    useEffect(() => {
        // Initialize letter animations
        const animations = Array.from({ length: 6 }, (_, i) => new Animated.Value(-100));
        setLetterAnimations(animations);

        // Animate each letter
        animations.forEach((anim, index) => {
            Animated.timing(anim, {
                toValue: 0,
                duration: 1000,
                delay: index * 500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        });

        // Animate rotation for the loader
        Animated.loop(
            Animated.timing(loadingRotation, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // Navigate to 'OnboardingScreen' after the animation (3 seconds)
        const timeout = setTimeout(() => {
            navigation.navigate('OnboardingScreen'); // Ensure 'OnboardingScreen' is registered in your navigator
        }, 3000);

        // Cleanup timeout on component unmount
        return () => clearTimeout(timeout);
    }, [navigation]);

    // Rotation interpolation for the loader
    const rotateInterpolation = loadingRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Letters to animate
    const letters = ['Q', 'O', 'S', 'Y', 'L', '.'];

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/logo.png')} // Replace with your logo path
                    style={[styles.logo, {width: 300, height: 150}]}
                />
                <View style={styles.lettersContainer}>
                    {letters.map((letter, index) => (
                        <Animated.Text
                            key={index}
                            style={[
                                styles.letter,
                                {
                                    transform: [
                                        {
                                            translateX: letterAnimations[index] || new Animated.Value(-100),
                                        },
                                    ],
                                },
                            ]}
                        >
                            {letter}
                        </Animated.Text>
                    ))}
                </View>
            </View>
            <Animated.View
                style={[
                    styles.loading,
                    {
                        transform: [{ rotate: rotateInterpolation }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f0f8',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    lettersContainer: {
        flexDirection: 'row',
    },
    letter: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#000',
        marginHorizontal: 2,
    },
    loading: {
        width: 40,
        height: 40,
        borderWidth: 4,
        borderColor: '#d8c8e3',
        borderTopColor: '#8f52c7',
        borderRadius: 20,
        marginTop: 20,
    },
});

export default QosylAppAnimation;
