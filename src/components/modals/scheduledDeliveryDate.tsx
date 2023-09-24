import {View, TouchableOpacity, Image, TextInput} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import Textcomp from '../Textcomp';
import images from '../../constants/images';
import colors from '../../constants/colors';
import {WIDTH_WINDOW} from '../../constants/generalStyles';
import Modal from 'react-native-modal/dist/modal';

export default function ScheduledDeliveryDate({
  navigation,
  visible,
  func,
  item,
}: any) {
  const [InfoModal, setInfoModal] = useState(visible);

  function getTimeDifference(targetDate: string | number | Date) {
    const currentDate: any = new Date();
    const targetDateObj: any = new Date(targetDate);

    // Calculate the time difference in milliseconds
    const timeDifference = targetDateObj - currentDate;

    // Calculate days, hours, and minutes
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );

    return {days, hours, minutes};
  }

  const {days, hours, minutes} = getTimeDifference(item?.scheduledDeliveryDate);

  console.log(days);

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
        <View style={tw`h-[37.5%] mt-auto bg-[#D9D9D9]`}>
          <TouchableOpacity
            onPress={() => {
              func(false);
            }}
            style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
          />
          <View>
            <View style={[tw` py-4 mt-3`, {marginLeft: perWidth(30)}]}>
              <Textcomp
                text={'Scheduled Delivery Date'}
                size={17}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Bold'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-1`, {}]}>
              <Textcomp
                text={'Expected delivery 02/08/23'}
                size={14}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>
            <View
              style={[
                tw`mx-[7.5%] bg-[#EBEBEB] flex flex-row justify-between px-6 rounded-full mt-6 py-2.5 items-center`,
                {},
              ]}>
              <View style={tw`items-center`}>
                <View>
                  <Textcomp
                    text={`${days}`}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <View>
                  <Textcomp
                    text={'Days'}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
              </View>
              <View style={tw`items-center`}>
                <View>
                  <Textcomp
                    text={`${hours}`}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <View>
                  <Textcomp
                    text={'Hours'}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
              </View>
              <View style={tw`items-center`}>
                <View>
                  <Textcomp
                    text={`${minutes}`}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <View>
                  <Textcomp
                    text={'Minutes'}
                    size={14}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                func(false);
              }}
              style={[
                {
                  width: perWidth(315),
                  height: perHeight(40),
                  borderRadius: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.darkPurple,
                  marginTop: 50,
                },
                tw`mx-auto`,
              ]}>
              <Textcomp
                text={'Change Delivery Date'}
                size={14}
                lineHeight={17}
                color={'#FFC727'}
                fontFamily={'Inter-Bold'}
              />
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
