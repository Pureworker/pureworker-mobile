import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import Textcomp from '../Textcomp';
import colors from '../../constants/colors';
import {WIDTH_WINDOW} from '../../constants/generalStyles';
import Modal from 'react-native-modal/dist/modal';
import Review2 from '../Review2';
// import {sendRatings} from '../../utils/api/func';
import Snackbar from 'react-native-snackbar';
import KeyboardAvoidingScrollView from 'react-native-keyboard-avoiding-scroll-view';
import {ScrollView} from 'react-native-gesture-handler';

export default function RateyourCustommer({
  navigation,
  visible,
  func,
  item,
  OnFinish,
  loading,
}: any) {
  const [InfoModal, setInfoModal] = useState(visible);

  const [isLoading, setisLoading] = useState(false);
  const [comment, setcomment] = useState('');

  const [rateExperience, setrateExperience] = useState(0);
  const [recommend, setrecommend] = useState(0);
  const [rateService, setrateService] = useState(0);

  const id = item?._id;
  // Validation function to check if the comment is provided
  const isValid = () => {
    return comment.trim().length > 0;
  };
  const handleFinish = () => {
    if (rateExperience === 0 || recommend === 0 || rateService === 0) {
      Snackbar.show({
        text: 'Please provide ratings for all categories.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      return;
    }
    OnFinish({
      communication: rateExperience,
      recommend: recommend,
      serviceAsDescribed: rateService,
      comment: comment,
    });
  };
  const [modalHeight, setModalHeight] = useState('70%'); // Initial modal height

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setModalHeight('90%'); // Update modal height when keyboard is shown
        setIsKeyboardOpen(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setModalHeight('70%'); // Reset modal height when keyboard is hidden
        setIsKeyboardOpen(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Modal
      isVisible={visible}
      onModalHide={() => {
        func(false);
      }}
      style={{width: SIZES.width, marginHorizontal: 0}}
      deviceWidth={SIZES.width}
      onBackdropPress={() => func(false)}
      swipeThreshold={200}
      swipeDirection={['down']}
      onSwipeComplete={() => func(false)}
      onBackButtonPress={() => func(false)}>
      <>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity onPress={() => func(false)} style={tw`flex-1`} />
          <View style={[tw` mt-auto bg-[#D9D9D9]`, {height: modalHeight}]}>
            <TouchableOpacity
              onPress={() => {
                func(false);
              }}
              style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
            />
            <View>
              <View style={[tw` py-4`, {marginLeft: perWidth(30)}]}>
                <Textcomp
                  text={'Rate your Experience'}
                  size={17}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
              <View style={[tw`px-[7.5%] mt-1`, {}]}>
                <Textcomp
                  text={
                    'Please leave a review. The job will be marked as completed after this step.'
                  }
                  size={14}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <View
                style={[tw`px-[7.5%] mt-4 flex flex-col justify-between `, {}]}>
                <View style={tw`mb-2`}>
                  <Textcomp
                    text={'Communication Level'}
                    size={12}
                    lineHeight={14}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <Review2
                  value={rateExperience}
                  func={text => setrateExperience(text)}
                />
              </View>
              <View
                style={[tw`px-[7.5%] mt-4 flex flex-col justify-between `, {}]}>
                <View style={tw`mb-2`}>
                  <Textcomp
                    text={'Recommend to a Friend'}
                    size={12}
                    lineHeight={14}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <Review2 value={recommend} func={text => setrecommend(text)} />
              </View>
              <View
                style={[tw`px-[7.5%] mt-4 flex flex-col justify-between `, {}]}>
                <View style={tw`mb-2`}>
                  <Textcomp
                    text={'Service as Described'}
                    size={12}
                    lineHeight={14}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <Review2
                  value={rateService}
                  func={text => setrateService(text)}
                />
              </View>
              <View
                style={[tw`px-[7.5%] mt-4 flex flex-col justify-between `, {}]}>
                <TextInput
                  multiline
                  style={[
                    tw`bg-[#EBEBEB] px-4 rounded-lg`,
                    {height: perHeight(60), color: 'black'},
                  ]}
                  onChangeText={text => {
                    setcomment(text);
                  }}
                  placeholderTextColor={'black'}
                  placeholder="Satisfied with the customer? Share your review"
                />
              </View>
              <TouchableOpacity
                disabled={loading}
                onPress={handleFinish} // Use the handleFinish function for the "Done" button
                style={[
                  {
                    width: perWidth(316),
                    height: perHeight(40),
                    borderRadius: 13,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.darkPurple,
                    marginTop: 20,
                  },
                  tw`mx-auto`,
                ]}>
                {loading === true ? (
                  <ActivityIndicator size={'small'} color={'white'} />
                ) : (
                  <Textcomp
                    text={'Done'}
                    size={14}
                    lineHeight={17}
                    color={'#FFC727'}
                    fontFamily={'Inter-SemiBold'}
                  />
                )}
              </TouchableOpacity>
            </View>
            {/* <View
              style={[
                tw`bg-black mt-auto mb-4`,
                {height: 2, width: WIDTH_WINDOW * 0.95},
              ]}
            /> */}
            {!isKeyboardOpen && (
              <View
                style={[
                  tw`bg-black mt-auto mb-4`,
                  {height: 2, width: WIDTH_WINDOW * 0.95},
                ]}
              />
            )}
          </View>
        </View>
      </>
    </Modal>
  );
}
