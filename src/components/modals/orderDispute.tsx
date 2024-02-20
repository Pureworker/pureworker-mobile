import {View, TouchableOpacity, Image, TextInput, Alert} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import Textcomp from '../Textcomp';
import images from '../../constants/images';
import colors from '../../constants/colors';
import {WIDTH_WINDOW} from '../../constants/generalStyles';
import Modal from 'react-native-modal/dist/modal';
import {getUserOrders, orderDispute, rescheduleOrder} from '../../utils/api/func';
import { addcustomerOrders } from '../../store/reducer/mainSlice';
import { useDispatch } from 'react-redux';

export default function OrderDispute({navigation, visible, func, item}: any) {
  const [InfoModal, setInfoModal] = useState(visible);
  const [section, setsection] = useState(0);
  const [loading, setisLoading] = useState(false);

  const [reason, setreason] = useState('');

  const dispatch = useDispatch();
  const initGetOrders = async () => {
    setisLoading(true);
    const res: any = await getUserOrders('');
    console.log('oooooooo', res?.data);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addcustomerOrders(res?.data?.data));
    }
    setisLoading(false);
  };

  const handleUpdate = async () => {
    setisLoading(true);
    try {
      const res = await orderDispute(item?._id, {
        reason: '',
      });
      if (res?.status === 200 || res?.status === 201) {
        await initGetOrders();
        Alert.alert('Order Dispute Placed!');
        func(false);
        navigation.goBack();
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
    } catch (error) {
    } finally {
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
        {section === 0 && (
          <View style={tw`h-[45%]  mt-auto bg-[#D9D9D9]`}>
            <TouchableOpacity
              onPress={() => {
                func(false);
              }}
              style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
            />

            <View>
              <View style={[tw` py-4`, {marginLeft: perWidth(30)}]}>
                <Textcomp
                  text={'Order Dispute'}
                  size={17}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-Bold'}
                />
              </View>

              <View style={[tw`px-[7.5%] mt-1`, {}]}>
                <Textcomp
                  text={"What's the issue"}
                  size={14}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>

              <View style={[tw`px-[7.5%] mt-4`, {}]}>
                <TextInput
                  multiline
                  // placeholder=" "
                  onChangeText={text => {
                    setreason(text);
                  }}
                  placeholderTextColor={'black'}
                  style={[
                    tw`bg-[#EBEBEB] p-4 rounded-lg`,
                    {height: perHeight(110), color: 'black'},
                  ]}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  //   func(false);
                  // setsection(1);
                  handleUpdate();
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
                <Textcomp
                  text={'Submit'}
                  size={14}
                  lineHeight={17}
                  color={'#FFC727'}
                  fontFamily={'Inter-SemiBold'}
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
        )}
        {section === 1 && (
          <View style={tw`h-[35.5%] mt-auto bg-[#D9D9D9]`}>
            <TouchableOpacity
              onPress={() => {
                func(false);
              }}
              style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
            />
            <View>
              <View style={[tw` pt-6`, {marginLeft: perWidth(30)}]}>
                <Textcomp
                  text={'Order Dispute'}
                  size={17}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
              <View style={[tw` mt-10 px-[7.5%]`, {}]}>
                <Textcomp
                  text={
                    'A representative will contact you to handle this dispute.'
                  }
                  size={14}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>

              <View style={tw`flex mt-5 flex-row justify-between`}>
                <TouchableOpacity
                  onPress={() => {
                    func(false);
                  }}
                  style={[
                    {
                      width: perWidth(160),
                      height: perHeight(40),
                      borderRadius: 6,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.darkPurple,
                      marginTop: 20,
                    },
                    tw`mx-auto`,
                  ]}>
                  <Textcomp
                    text={'Okay'}
                    size={14}
                    lineHeight={17}
                    color={'#FFC727'}
                    fontFamily={'Inter-Bold'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    func(false);
                  }}
                  style={[
                    {
                      width: perWidth(165),
                      height: perHeight(40),
                      borderRadius: 6,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.darkPurple,
                      marginTop: 20,
                    },
                    tw`mx-auto`,
                  ]}>
                  <Textcomp
                    text={'withdraw Dispute'}
                    size={14}
                    lineHeight={17}
                    color={'#FFC727'}
                    fontFamily={'Inter-Bold'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                tw`bg-black mt-auto mb-4`,
                {height: 2, width: WIDTH_WINDOW * 0.95},
              ]}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}
