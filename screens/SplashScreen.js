import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Image } from 'react-native';

const QosylAppAnimation = ({ navigation }) => {
  const loadingRotation = useRef(new Animated.Value(0)).current;
  const [letterAnimations, setLetterAnimations] = useState([]);

  useEffect(() => {
    const animations = Array.from({ length: 6 }, () => new Animated.Value(0));
    setLetterAnimations(animations);

    // Letter appearance animation
    animations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    // Loader circle rotation animation
    Animated.loop(
      Animated.timing(loadingRotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timeout = setTimeout(() => {
      navigation.navigate('OnboardingScreen');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  const rotateInterpolation = loadingRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const letters = ['Q', 'O', 'S', 'Y', 'L', '.'];

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={[styles.logo, { width: 300, height: 150 }]}
        />
        <View style={styles.lettersContainer}>
          {letters.map((letter, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.letter,
                {
                  opacity: letterAnimations[index] || 0,
                  transform: [
                    {
                      scale: letterAnimations[index]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }) || 1,
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
    marginTop: 10,
  },
  letter: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#8f52c7',
    marginHorizontal: 4,
  },
  loading: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: '#d8c8e3',
    borderTopColor: '#8f52c7',
    borderRadius: 20,
    marginTop: 30,
  },
});

export default QosylAppAnimation;
