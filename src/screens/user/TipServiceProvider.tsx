import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import {Route, useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import colors from '../../constants/colors';
import {perHeight, perWidth} from '../../utils/position/sizes';
import {HEIGHT_WINDOW, WIDTH_WINDOW} from '../../constants/generalStyles';
import {PLATFORMS} from 'twrnc/dist/esm/types';
import {getTransactions, tipProvider} from '../../utils/api/func';
import Snackbar from 'react-native-snackbar';
import {ActivityIndicator} from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import {ToastShort} from '../../utils/utils';
import {addTransactions} from '../../store/reducer/mainSlice';

const TipServiceProvider = () => {
  const navigation = useNavigation<StackNavigation>();
  const route: Route = useRoute();
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const [amount, setamount] = useState(0);
  const amountList = [
    {
      amount: 100,
      title: '₦100',
    },
    {
      amount: 200,
      title: '₦200',
    },
    {
      amount: 500,
      title: '₦500',
    },
    {
      amount: 1000,
      title: '₦1000',
    },
    {
      amount: 2000,
      title: '₦2000',
    },
    {
      amount: 5000,
      title: '₦5000',
    },
  ];

  const item = route.params?.item;
  const handleTip = async () => {
    try {
      setisLoading(true);
      const _data = {
        amount: Number(amount),
        providerID: item?.serviceProvider?._id,
        orderID: item?._id,
      };
      const res: any = await tipProvider(_data);
      console.log('tippppp', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        Snackbar.show({
          text: 'This provider has been tipped!.',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        navigation.navigate('Orders');
      }
    } catch (error) {
      ToastShort(error?.data?.message);
    } finally {
      const initTransaction = async () => {
        try {
          const res: any = await getTransactions('');
          if (res?.status === 201 || res?.status === 200) {
            dispatch(addTransactions(res?.data?.data));
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };
      initTransaction();
      setisLoading(false);
    }
  };
  //   <FastImage
  //   onTouchStart={() => setimageModal(true)}
  //   style={[
  //     tw`mr-2`,
  //     {
  //       width: perWidth(95),
  //       aspectRatio: 1,
  //       borderRadius: 10,
  //     },
  //   ]}
  //   source={{
  //     uri: item,
  //     headers: {Authorization: 'someAuthToken'},
  //     priority: FastImage.priority.normal,
  //   }}
  //   resizeMode={FastImage.resizeMode.cover}
  // />
  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <ScrollView style={{height: '100%'}}>
        <View
          style={{
            marginTop:
              Platform.OS === 'ios'
                ? getStatusBarHeight(true) + 10
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
            <Textcomp
              text={'Cancel'}
              size={17}
              lineHeight={17}
              color={'#88087B'}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
          <View style={tw`mx-auto`}>
            <Textcomp
              text={'Select Amount'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>

        <View style={{height: HEIGHT_WINDOW * 0.86}}>
          <View style={tw`  `}>
            <View style={[tw` mx-auto mt-[10%]`, {}]}>
              <Image
                style={{
                  width: perWidth(115),
                  height: perWidth(115),
                  borderRadius: perWidth(115) * 0.5,
                }}
                source={images.heroPix2}
              />
            </View>
            <View style={[tw` py-4 mx-auto`, {}]}>
              <Textcomp
                text={`${
                  item?.serviceProvider?.businessName
                    ? item?.serviceProvider?.businessName
                    : `${item?.serviceProvider?.firstName} ${item?.serviceProvider?.lastName}`
                }`}
                size={17}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <View style={tw`mb-2 mx-auto`}>
              <Textcomp
                text={
                  'Pay attention, the service provider gets 100% of the tip.'
                }
                size={12}
                lineHeight={14}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>

            {/* {amountList.map((item, index) => {
              return (
                <TouchableOpacity style={[tw`bg-[#D9D9D9]`, {}]}>
                  <Textcomp
                    text={item?.title}
                    size={17}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Medium'}
                  />
                </TouchableOpacity>
              );
            })} */}

            <FlatList
              scrollEnabled={false}
              data={amountList}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setamount(item?.amount);
                    }}
                    key={index}
                    style={[
                      tw` ${
                        amount !== item?.amount ? 'bg-[#D9D9D9] ' : 'bg-black '
                      } mt-4 py-2 items-center rounded-full`,
                      {marginLeft: perWidth(30), width: perWidth(76)},
                    ]}>
                    <Textcomp
                      text={item?.title}
                      size={17}
                      lineHeight={17}
                      color={
                        amount !== item?.amount ? '#000000' : colors.primary
                      }
                      fontFamily={'Inter-Medium'}
                    />
                  </TouchableOpacity>
                );
              }}
              //   keyExtractor={item => item.id}
              numColumns={3}
              contentContainerStyle={{marginTop: 10}}
            />

            <View
              style={[
                tw` p`,
                {marginLeft: perWidth(30), marginTop: perHeight(50)},
              ]}>
              <TextInput
                placeholder="Enter Amount"
                placeholderTextColor={'#00000080'}
                keyboardType="numeric"
                style={[tw`border-b pb-2 `, {width: perWidth(311)}]}
                onChangeText={text => {
                  setamount(text);
                }}
                value={`${amount}`}
              />
            </View>

            <View>
              <View style={tw`flex mt-5 flex-row justify-between`}>
                <TouchableOpacity
                  disabled={isLoading}
                  onPress={() => {
                    // func(false);
                    handleTip();
                  }}
                  style={[
                    {
                      width: perWidth(165) * 2,
                      height: perHeight(40),
                      borderRadius: 6,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.darkPurple,
                      marginTop: perHeight(98),
                    },
                    tw`mx-auto`,
                  ]}>
                  {isLoading ? (
                    <ActivityIndicator size={'small'} color="white" />
                  ) : (
                    <Textcomp
                      text={'Confirm Tip'}
                      size={14}
                      lineHeight={17}
                      color={'#FFC727'}
                      fontFamily={'Inter-Bold'}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            tw`bg-black mt-auto mb-4`,
            {height: 2, width: WIDTH_WINDOW * 0.95},
          ]}
        />
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default TipServiceProvider;
