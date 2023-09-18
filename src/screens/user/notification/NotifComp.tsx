import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import colors from '../../../constants/colors';
import moment from 'moment';
import Modal from 'react-native-modal/dist/modal';
import Textcomp from '../../../components/Textcomp';
import {perWidth} from '../../../utils/position/sizes';
import {WIDTH_SCREEN} from '../../../constants/generalStyles';
import images from '../../../constants/images';

export default function NotificationComp({item, seen, seen_}: any) {
  const [NModal, setNModal] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setNModal(!NModal);
          seen();
        }}
        style={tw`flex mt-3 pr-3  bg-[#E0E0E0] border-b border-[#F2F2F2] border-opacity-20 py-2 flex-row justify-between`}>
        <View style={tw`flex flex-row items-center`}>
          <View
            style={[
              tw` ${seen_ ? `bg-[${colors.black}]` : 'bg-grey-400'}`,
              {width: 8, height: 8, borderRadius: 5},
            ]}
          />
          <View style={[tw`flex  `, {width: perWidth(270)}]}>
            <Textcomp
              text={'hellow world'}
              size={14}
              lineHeight={16}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
            <Text
              numberOfLines={1}
              style={[
                tw`mt-1`,
                {
                  color: '#989898',
                  fontSize: 11,
                },
              ]}>
              here's the message
            </Text>
          </View>
        </View>
        <View style={tw``}>
          <View style={tw``}>
            <Textcomp
              //   text={moment(`${item?.date}`).fromNow()}
              text={'2h'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter'}
            />
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={NModal}
        onBackButtonPress={() => setNModal(false)}
        onBackdropPress={() => setNModal(false)}
        swipeThreshold={200}
        swipeDirection={['down']}
        onSwipeComplete={() => setNModal(false)}>
        <View style={[tw`items-center justify-center   w-full`, {}]}>
          <View
            style={[
              tw`bg-[#D9D9D9] py-4`,
              {
                width: WIDTH_SCREEN * 0.85,
                borderRadius: 20,
                minHeight: WIDTH_SCREEN * 0.225,
                // maxHeight: RH(30),
              },
            ]}>
            <View style={[tw`flex ml-2 pb-4  mx-auto`, {width: perWidth(270)}]}>
              <TouchableOpacity
                style={tw`ml-auto`}
                onPress={() => {
                  setNModal(false);
                }}>
                {/* <Entypo name={'cross'} size={25} color={'grey'} /> */}
                <Image
                  source={images.cross}
                  style={{height: 20, width: 20, tintColor: 'black'}}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <View style={tw``}>
                <Textcomp
                  text={`${item?.title}`}
                  size={17}
                  lineHeight={17}
                  color={'#000413'}
                  fontFamily={'Inter'}
                />
              </View>

              <Text
                style={[
                  tw`mt-3`,
                  {
                    color: '#989898',
                    fontSize: 13,
                  },
                ]}>
                {item?.message}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
