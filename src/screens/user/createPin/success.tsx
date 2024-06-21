import React, {useEffect} from 'react';
import {View, Platform, StatusBar, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {StackNavigation} from '../../../constants/navigation';
import tw from 'twrnc';
import Textcomp from '../../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {perHeight} from '../../../utils/position/sizes';
import Pinsuccess from '../../../assets/svg/Pinsucess';
import {getUser} from '../../../utils/api/func';
import {addUserData} from '../../../store/reducer/mainSlice';

const CreatePinSuccess = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  //   useEffect(() => {
  //     const initGetOrders = async () => {
  //       // setisLoading(true);
  //       const res: any = await getUserOrders('');
  //       console.log('oooooooo', res?.data);
  //       if (res?.status === 201 || res?.status === 200) {
  //         dispatch(addcustomerOrders(res?.data?.data));
  //       }
  //       // setloading(false);
  //       // setisLoading(false);
  //     };
  //     initGetOrders();
  //   }, []);

  const initGetUsers = async () => {
    const res: any = await getUser('');
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addUserData(res?.data?.user));
    }
  };

  useEffect(() => {
    initGetUsers();
    const timer = setTimeout(() => {
      navigation.navigate('Wallet');
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timeout if the component is unmounted
  }, [navigation]);

  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <ScrollView style={tw`flex-1 h-full `} contentContainerStyle={{flex: 1}}>
        <View
          style={{
            marginTop:
              Platform.OS === 'ios'
                ? getStatusBarHeight(true)
                : StatusBar.currentHeight &&
                  StatusBar.currentHeight + getStatusBarHeight(true),
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 20,
          }}>
          <View style={tw`mx-auto`}>
            <Textcomp
              text={''}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>

        <View style={tw`flex-1  h-full`}>
          <View style={tw`m-auto items-center`}>
            <Pinsuccess />
            <View style={[tw`mx-auto`, {marginTop: perHeight(10)}]}>
              <Textcomp
                text={'Pin successfully created'}
                size={16}
                lineHeight={20}
                color={'#000413'}
                fontFamily={'Inter-Bold'}
              />
            </View>
          </View>

          <View style={tw`w-full h-0.5 mt-auto bg-black  mb-[7.5%]`} />
        </View>
      </ScrollView>
    </View>
  );
};

export default CreatePinSuccess;
