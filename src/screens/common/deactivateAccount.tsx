import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';
import Snackbar from 'react-native-snackbar';
import {f_deactivateAccount} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';

const DeactivateAccount = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  const [deactivateAccount, setdeactivateAccount] = useState('');
  const [deleteAccount, setdeleteAccount] = useState(false);

  //store
  const userData = useSelector((state: any) => state.user.userData);

  const [isLoading, setisLoading] = useState(false);
  const handleDelete = async () => {
    setisLoading(true);
    const _data = {
      userID: userData?._id,
      status: false,
    };
    const res: any = await f_deactivateAccount(_data);
    console.log('request', res?.data);
    if (res?.status === 201 || res?.status === 200) {
      Snackbar.show({
        text: 'Request Successful.',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      navigation.navigate('Orders');
    }
    setisLoading(false);
  };
  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <ScrollView contentContainerStyle={{height: SIZES.height}}>
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={images.back}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={tw`mx-auto`}>
            <Textcomp
              text={'DeactivateAccount'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>
        <View style={[tw` flex-1`]}>
          <View style={tw`mx-auto mt-[7.5%]`}>
            <Textcomp
              text={'Deactivate or delete your Pure worker account'}
              size={14}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              setdeactivateAccount('deactivtate');
            }}
            style={[
              tw`bg-[${colors.darkPurple}] p-4 flex flex-row  mx-auto`,
              {
                width: perWidth(314),
                height: perHeight(105),
                marginTop: perHeight(41),
                borderRadius: 6,
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                setdeactivateAccount('deactivtate');
              }}
              style={[
                tw`rounded-full ${
                  deactivateAccount === 'deactivtate'
                    ? `bg-[${colors.primary}]`
                    : ''
                } border border-[${colors.primary}]`,
                {width: 15, height: 15},
              ]}
            />
            <View style={tw`ml-4`}>
              <View style={tw``}>
                <Textcomp
                  text={'Deactivate Account'}
                  size={16}
                  lineHeight={17}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw``}>
                <Textcomp
                  text={
                    "Deactivating your account is reversible. Your profile won't be shown on Pureworker. You will be able to reactivate your account by logging in."
                  }
                  size={12}
                  lineHeight={14.5}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setdeactivateAccount('delete');
            }}
            style={[
              tw`bg-[${colors.darkPurple}] p-4 flex flex-row  mx-auto`,
              {
                width: perWidth(314),
                height: perHeight(105),
                marginTop: perHeight(21),
                borderRadius: 6,
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                setdeactivateAccount('delete');
              }}
              style={[
                tw`rounded-full ${
                  deactivateAccount === 'delete' ? `bg-[${colors.primary}]` : ''
                } border border-[${colors.primary}]`,
                {width: 15, height: 15},
              ]}
            />
            <View style={tw`ml-4`}>
              <View style={tw``}>
                <Textcomp
                  text={'Delete Account'}
                  size={16}
                  lineHeight={17}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw``}>
                <Textcomp
                  text={
                    "Deleting your account is permanent and irreversible. You won't be able to retrieve the files or information from your orders on Pureworker."
                  }
                  size={12}
                  lineHeight={14.5}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={tw`mt-auto mb-[20%]`}>
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate('PaymentConfirmed');
              handleDelete();
            }}
            style={[
              tw`bg-[${colors.darkPurple}] items-center rounded-lg justify-center mx-auto py-3`,
              {width: perWidth(260)},
            ]}>
            <Textcomp
              text={'Continue'}
              size={14}
              lineHeight={15}
              color={colors.primary}
              fontFamily={'Inter-Bold'}
            />
          </TouchableOpacity>
        </View>
        <View style={tw`h-0.5 w-full bg-black absolute  bottom-[3%]`} />
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading/>}/>
    </View>
  );
};

export default DeactivateAccount;
