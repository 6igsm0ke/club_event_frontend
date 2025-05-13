import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: "Let's grow together to be better",
        description: ' Build connections that go beyond the classroom.',
    },
    {
        id: '2',
        title: 'Best courses to level up your skill',
        description: 'Your memories. Your milestones. All in one place.',
    },
    {
        id: '3',
        title: 'Support in your new career',
        description: ' Your journey starts where the events begin.',
    },
];

const OnboardingScreen = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null); // Reference for FlatList

    const renderItem = ({ item }) => (
        <View style={styles.slide}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
    );

    const handleScrollEnd = (e) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const slideIndex = Math.floor(contentOffsetX / width);
        setCurrentIndex(slideIndex);
    };

    const handleSkip = () => {
        navigation.navigate('SignUp');
    };

    const handleNext = () => {
        if (currentIndex === slides.length - 1) {
            navigation.navigate('SignUp');
        } else {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ref={flatListRef} // Assign ref to FlatList
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={handleScrollEnd}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSkip} style={styles.button}>
                    <Text style={styles.buttonText}>Skip</Text>
                </TouchableOpacity>
                {currentIndex === slides.length - 1 ? (
                    <TouchableOpacity onPress={handleNext} style={styles.button}>
                        <Text style={styles.buttonText}>Go to SignUp</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleNext} style={styles.button}>
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    slide: {
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f0f8',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#7a7a7a',
        textAlign: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row', // Change to row for button alignment
        justifyContent: 'center', // Center the buttons horizontally
        alignItems: 'center', // Center the buttons vertically
    },
    button: {
        backgroundColor: '#8f52c7',
        padding: 10,
        borderRadius: 12,
        marginHorizontal: 10, // Space between the buttons
        width: 150,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default OnboardingScreen;
