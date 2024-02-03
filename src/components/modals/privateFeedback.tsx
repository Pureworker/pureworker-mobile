import {View, TouchableOpacity, Image, TextInput} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import Textcomp from '../Textcomp';
import images from '../../constants/images';
import colors from '../../constants/colors';
import {WIDTH_WINDOW} from '../../constants/generalStyles';
import Modal from 'react-native-modal/dist/modal';
import {sendPrivateFeedback} from '../../utils/api/func';
import {ActivityIndicator} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import SmileIcon from '../../assets/svg/Smile';
import Smile2 from '../../assets/svg/Smile2';
import PoorIcon from '../../assets/svg/Poor';
import CryingEmoji from '../../assets/svg/crying';

export default function PrivateFeedback({
  navigation,
  visible,
  func,
  item,
}: any) {
  const [InfoModal, setInfoModal] = useState(visible);
  const [isLoading, setisLoading] = useState(false);

  const [feedback, setfeedback] = useState('');
  const [emoji, setemoji] = useState('');

  // console.log(item?._id);
  const id = item?._id;

  const initSendFeedback = async () => {
    setisLoading(true);
    const data = {
      emoji: emoji,
      comment: feedback,
    };
    const res = await sendPrivateFeedback(id, data);
    console.log(res);
    if (res?.status === 201 || res?.status === 200) {
      Snackbar.show({
        text: 'Your feedback has been received.',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      func(false);
    } else {
      Snackbar.show({
        text: res?.error?.message
          ? res?.error?.message
          : res?.error?.data?.message
          ? res?.error?.data?.message
          : 'Oops!, an error occured',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
    setisLoading(false);
  };
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
      <View style={tw` h-full w-full bg-black bg-opacity-5`}>
        <TouchableOpacity onPress={() => func(false)} style={tw`flex-1`} />
        <View style={tw`h-[50%]  mt-auto bg-[#D9D9D9]`}>
          <TouchableOpacity
            onPress={() => {
              func(false);
            }}
            style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
          />
          <View>
            <View style={[tw` py-4`, {marginLeft: perWidth(30)}]}>
              <Textcomp
                text={'Private Feedback(optional)'}
                size={17}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Bold'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-1`, {}]}>
              <Textcomp
                text={
                  'How was your overall experience with this service provider? This is a personal message to the service provider. It won’t be public.'
                }
                size={14}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>
            <View
              style={[
                tw`px-[.5%] mt-4 flex flex-row w-[60%] justify-between mx-auto`,
                {},
              ]}>
              <TouchableOpacity
                onPress={() => {
                  setemoji('verygood');
                }}>
                <SmileIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setemoji('good');
                }}>
                <Smile2 />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setemoji('poor');
                }}>
                <PoorIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setemoji('verypoor');
                }}>
                <CryingEmoji />
              </TouchableOpacity>
            </View>
            <View style={[tw`px-[7.5%] mt-4`, {}]}>
              <TextInput
                multiline
                style={[
                  tw`bg-[#EBEBEB] px-4 rounded-lg`,
                  {height: perHeight(80)},
                ]}
                onChangeText={text => {
                  setfeedback(text);
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                initSendFeedback();
              }}
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
              {isLoading ? (
                <ActivityIndicator color="white" size={'small'} />
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
          <View
            style={[
              tw`bg-black mt-auto mb-4`,
              {height: 2, width: WIDTH_WINDOW * 0.95},
            ]}
          />
        </View>
      </View>
    </Modal>
  );
}
