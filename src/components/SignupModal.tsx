import {View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import images from '../constants/images';
import {SIZES, perHeight} from '../utils/position/sizes';
import Modal from 'react-native-modal';
import Textcomp from './Textcomp';
import WelcomeImage from '../assets/svg/welcome';
import PointerRight from '../assets/svg/PointerRight';
import {useSelector} from 'react-redux';

export default function WelcomeModal({close}: any) {
  const userType = useSelector((state: any) => state.user.isLoggedIn);
  const [show] = useState(true);
  const list = [
    {
      title: 'Create an Account',
    },
    {
      title: 'Find a Service',
    },
    {
      title: 'Choose a Service Provider',
    },
    {
      title: 'Hire',
    },
    {
      title: 'Wait for the Completion of the Job',
    },
    {
      title: 'Rate and Review',
    },
  ];
  const list2 = [
    {
      title: 'Complete your Registration',
    },
    {
      title: 'Receive Booking Requests',
    },
    {
      title: 'Accept and Schedule',
    },
    {
      title: 'Provide Outstanding Service',
    },
    {
      title: 'Rate and Review',
    },
    {
      title: 'Get Rated and Paid',
    },
  ];
  return (
    <Modal
      isVisible={show}
      onModalHide={() => {}}
      style={{width: SIZES.width, marginHorizontal: 0}}
      deviceWidth={SIZES.width}>
      <View
        style={[tw`bg-[#EBEBEB] w-9/10 mx-auto  p-4 pb-8`, {borderRadius: 20}]}>
        <View style={tw`mx-auto`}>
          <WelcomeImage />
        </View>
        <View style={[tw`mx-auto`]}>
          <View style={[tw`mx-auto mt-4`]}>
            <Textcomp
              text={'WELCOME TO PUREWORKER'}
              size={16}
              lineHeight={16}
              color={'#000413'}
              fontFamily={'Inter-Bold'}
            />
          </View>
          <View style={[tw`mx-auto mt-1`]}>
            <Textcomp
              text={'Follow the steps below to order a service.'}
              size={10}
              lineHeight={12}
              color={'#000413'}
              fontFamily={'Inter-Regular'}
            />
          </View>
        </View>
        <View style={[tw`mr-auto `]}>
          {userType.userType === 'CUSTOMER' ? (
            <>
              {list?.map(item => {
                return (
                  <View
                    style={[
                      tw`flex flex-row items-center`,
                      {marginTop: perHeight(20)},
                    ]}>
                    <PointerRight />
                    <View style={[tw`ml-2`]}>
                      <Textcomp
                        text={`${item?.title}`}
                        size={13}
                        lineHeight={16}
                        color={'#000413'}
                        fontFamily={'Inter-Regular'}
                      />
                    </View>
                  </View>
                );
              })}
            </>
          ) : (
            <>
              {list2?.map(item => {
                return (
                  <View
                    style={[
                      tw`flex flex-row items-center`,
                      {marginTop: perHeight(20)},
                    ]}>
                    <PointerRight />
                    <View style={[tw`ml-2`]}>
                      <Textcomp
                        text={`${item?.title}`}
                        size={13}
                        lineHeight={16}
                        color={'#000413'}
                        fontFamily={'Inter-Regular'}
                      />
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            close();
          }}
          style={tw`absolute right-0 top-[-2]`}>
          <Image
            resizeMode="contain"
            source={images.cancelCircle}
            style={{
              width: 30,
              height: 30,
              tintColor: '#000413',
              marginLeft: 5,
            }}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
