import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const data = [
  { image: require('../assets/images/sliderimg1.jpg') },
  { image: require('../assets/images/sliderimg2.jpg') },
];

export default function Slider() {
  const { width } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % data.length;
        // Scroll to the next slide
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [width]);

  return (
    <View style={styles.sliderContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.scrollView}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Image source={item.image} style={styles.image} resizeMode="cover" />
          </View>
        ))}
      </ScrollView>
      
      {/* Dots indicator */}
      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot
            ]}
          />
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  sliderContainer: {
    backgroundColor: "#f8f8f8",
    position: 'relative',
  },
  scrollView: {
    height: hp(19),
  },
  slide: {
    width: Dimensions.get('window').width,
    height: hp(19),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
  },
});