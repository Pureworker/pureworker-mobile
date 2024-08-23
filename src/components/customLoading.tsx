import {Animated, StyleSheet} from 'react-native';
import React, {useEffect, useRef} from 'react';
import images from '../constants/images';
// import {GlobalImages} from '../../assets/images/global_images';


const CustomLoading = () => {
  const transform = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(transform, {
            toValue: 1,
            useNativeDriver: false,
          }),
          Animated.timing(transform, {
            toValue: 0.5,
            useNativeDriver: false,
          }),
          Animated.timing(transform, {
            toValue: 1,
            useNativeDriver: false,
          }),
          Animated.timing(transform, {
            toValue: 0.5,
            useNativeDriver: false,
          }),
        ]),
      ]),
    ).start();
  }, []);
  const scale = {
    scale: transform,
  };
  return (
    <Animated.View style={[styles.container, {transform: [scale]}]}>
      <Animated.Image
        source={images.logo2}
        style={{
          width: '100%',
          height: 60,
          opacity: transform,
        }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};
export default CustomLoading;

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.4)',
  },
});
