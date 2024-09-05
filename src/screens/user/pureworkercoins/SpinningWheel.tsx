import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Text as RNText,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, {G, Path, Text} from 'react-native-svg';
import KnobSVG from '../../../assets/svg/Knob'; // Import your Knob SVG file here
import colors from '../../../constants/colors';
import commonStyle from '../../../constants/commonStyle';
import CustomButton from '../../../components/Button';
import images from '../../../constants/images';
import {SIZES} from '../../../utils/position/sizes';
import tw from 'twrnc';

import Modal from 'react-native-modal';

const {width} = Dimensions.get('window');
const wheelSize = width * 0.9;
const centerX = 50;
const centerY = 50;

const SpinningWheel: React.FC = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const sections = Array.from({length: 10}); // 10 sections
  const labels = [
    'Daily Coins',
    ...sections.slice(1).map((_, i) => `${i + 1} Coin${i + 1 > 1 ? 's' : ''}`),
  ];

  const spinWheel = () => {
    const fullRotations = 4;
    const numberOfSections = sections.length;

    const randomSection = Math.floor(Math.random() * numberOfSections);
    const spinToValue = fullRotations + randomSection / numberOfSections;

    Animated.sequence([
      Animated.timing(rotateValue, {
        toValue: spinToValue,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(rotateValue, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Trigger modal display after wheel finishes spinning
      setSelectedItem(labels[randomSection]);
      setIsModalVisible(true);
    });
  };

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const radius = centerX * 0.9; // Adjust the radius based on the center

  return (
    <View style={styles.container}>
      <Animated.View style={{transform: [{rotate: spin}]}}>
        <Svg width={wheelSize} height={wheelSize} viewBox="0 0 100 100">
          <G>
            {sections.map((_, index) => {
              const startAngle = (index * 360) / 10;
              const endAngle = ((index + 1) * 360) / 10;

              const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

              const startX =
                centerX + radius * Math.cos((Math.PI * startAngle) / 180);
              const startY =
                centerY + radius * Math.sin((Math.PI * startAngle) / 180);

              const endX =
                centerX + radius * Math.cos((Math.PI * endAngle) / 180);
              const endY =
                centerY + radius * Math.sin((Math.PI * endAngle) / 180);

              const pathData = `
                  M ${centerX} ${centerY}
                  L ${startX} ${startY}
                  A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
                  Z
                `;

              const color = index % 2 === 0 ? colors.wheelBlack : colors.white;

              const labelAngle = startAngle + (endAngle - startAngle) / 2;
              const labelRadius = radius * 0.6;
              const labelX =
                centerX + labelRadius * Math.cos((Math.PI * labelAngle) / 180);
              const labelY =
                centerY + labelRadius * Math.sin((Math.PI * labelAngle) / 180);

              const textColor =
                color === colors.wheelBlack ? 'white' : colors.parpal;

              return (
                <React.Fragment key={index}>
                  <Path d={pathData} fill={color} />
                  <Text
                    x={labelX}
                    y={labelY}
                    fill={textColor}
                    fontFamily="Inter-SemiBold"
                    fontSize="4"
                    textAnchor="middle"
                    alignmentBaseline="middle">
                    {labels[index]}
                  </Text>
                </React.Fragment>
              );
            })}
          </G>
        </Svg>
      </Animated.View>

      <View style={styles.knobContainer}>
        <KnobSVG width={65} height={65} />
      </View>

      <View style={styles.spinButtonContainer}>
        <CustomButton
          text={'Spin to Win'}
          onClick={spinWheel}
          style={styles.spinButton}
          textStyle={styles.spinButtonText}
        />
      </View>

      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          onModalHide={() => {
            setIsModalVisible(false);
          }}
          style={{width: SIZES.width, marginHorizontal: 0}}
          deviceWidth={SIZES.width}>
          <View
            style={[
              tw`bg-[#EBEBEB] w-9/10 mx-auto  p-4 pb-8`,
              {borderRadius: 20},
            ]}>
            <View style={tw`mx-auto`}>
              <View style={tw`mb-4`}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    source={images.coin}
                    style={{width: 50, height: 50}}
                    resizeMode="contain"
                  />

                  <RNText style={styles.modalTitle}>
                    Congratulations, you won!
                  </RNText>
                  <RNText style={styles.modalSubtitle}>{selectedItem}</RNText>
                </View>
              </View>
              <CustomButton
                text="Claim and Continue"
                onClick={() => {
                  // Claim item logic here
                  // Navigate back to PureCoins Home
                  setIsModalVisible(false);
                }}
                style={styles.modalButton}
                textStyle={styles.modalButtonText}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  knobContainer: {
    position: 'absolute',
    top: '38%',
    left: '38%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinButtonContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  spinButton: {
    backgroundColor: colors.black,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  spinButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: commonStyle.fontFamily.bold,
  },

  modalContainer: {
    backgroundColor: colors.grey,
    borderColor: colors.primary,
    padding: 100,
    borderRadius: 10,
    // position: 'absolute',
    // top: '40%',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 'auto',

    width: SIZES.width * 0.9,
    transform: [{translateX: -20}, {translateY: -20}],
  },

  modalTitle: {
    color: colors.black,
    fontFamily: commonStyle.fontFamily.bold,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },

  modalSubtitle: {
    color: colors.parpal,
    fontFamily: commonStyle.fontFamily.bold,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },

  modalButton: {
    backgroundColor: colors.black,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.bold,
  },
});

export default SpinningWheel;
