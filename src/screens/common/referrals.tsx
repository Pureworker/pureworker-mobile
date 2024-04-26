import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Share,
  Clipboard,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import {getFAQ, getReferralDetails} from '../../utils/api/func';
import {addReferralDetails, addfaq} from '../../store/reducer/mainSlice';
import {WIDTH_WINDOW} from '../../constants/generalStyles';
import Modal from 'react-native-modal';
import colors from '../../constants/colors';
import {ToastShort} from '../../utils/utils';
// import Clipboard from '@react-native-community/clipboard';

const Referrals = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const faq = useSelector((state: any) => state.user.faq);

  const [isVisible, setisVisible] = useState(false);
  //selectors
  const userData = useSelector((state: any) => state.user.userData);
  const referralDetails = useSelector(
    (state: any) => state.user.referralDetails,
  );

  console.log(userData);

  useEffect(() => {
    const initGetOrders = async () => {
      setisLoading(true);
      const res: any = await getFAQ('');
      console.log('fffffff', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addfaq(res?.data?.data));
      }
      setisLoading(false);
    };

    const initReferralDetails = async () => {
      setisLoading(true);
      const res: any = await getReferralDetails('');
      console.log('rrrDetails', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addReferralDetails(res?.data?.data));
      }
      setisLoading(false);
    };
    initGetOrders();
    initReferralDetails();
  }, []);

  const handleCopy = async (contentToCopy: string) => {
    await Clipboard.setString(contentToCopy);
    console.log('Content copied to clipboard!');
    ToastShort('Code copied to clipboard!');
  };
  const handleShare = async (contentToShare: any) => {
    try {
      await Share.share({
        message:
          `I use Pureworker when I need any and all artisans and service providers. Download the app at https://www.pureworker.com/, then use my referral code: "${contentToShare}" to sign up.`,
      });
    } catch (error) {
      console.error('Error sharing content:', error.message);
    }
  };
  
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const initReferralDetails = async () => {
      setisLoading(true);
      const res: any = await getReferralDetails('');
      console.log('rrrDetails', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addReferralDetails(res?.data?.data));
      }
      setisLoading(false);
    };
    try {
      initReferralDetails();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      {/* <View
        style={{
          marginTop:
            Platform.OS === 'ios'
              ? getStatusBarHeight(true)
              : StatusBar.currentHeight &&
                StatusBar.currentHeight + getStatusBarHeight(true),
        }}
      /> */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          marginTop: 20,
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
            text={'Referrals'}
            size={17}
            lineHeight={17}
            color={'#000413'}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{minHeight: SIZES.height}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={[tw``]}>
          <View style={[tw``]}>
            <Image
              resizeMode="contain"
              source={images.refferalImg}
              style={[
                tw` mx-auto mt-4`,
                {height: perHeight(200), width: WIDTH_WINDOW * 0.5},
              ]}
            />
          </View>

          <View
            style={[
              tw`bg-[#2D303C] items-center mt-[-15] justify-center`,
              {height: perHeight(130)},
            ]}>
            <View style={tw`flex flex-row items-center`}>
              <Textcomp
                text={`${userData?.referralCode}`}
                size={18}
                lineHeight={17}
                color={'white'}
                fontFamily={'Inter-SemiBold'}
              />
              <TouchableOpacity
                onPress={() => handleCopy(`${userData?.referralCode}`)}
                style={tw`ml-3 border-r border-[#BDBDBD] pr-3`}>
                <Image
                  resizeMode="contain"
                  source={images.copyicon}
                  style={[tw``, {height: 20, width: 20, tintColor: '#BDBDBD'}]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleShare(`${userData?.referralCode}`)}
                style={tw`pl-3`}>
                <Image
                  resizeMode="contain"
                  source={images.shareicon}
                  style={[tw``, {height: 20, width: 20, tintColor: '#BDBDBD'}]}
                />
              </TouchableOpacity>
            </View>

            <View style={tw`flex flex-row mt-5 items-center mx-auto `}>
              <Textcomp
                text={' Invite a friend and get  '}
                size={13}
                lineHeight={17}
                color={'white'}
                fontFamily={'Inter-SemiBold'}
              />
              <Textcomp
                text={'₦500 '}
                size={17}
                lineHeight={17}
                color={'white'}
                fontFamily={'Inter-Bold'}
              />
              <Textcomp
                text={'on their first transaction.'}
                size={13}
                lineHeight={17}
                color={'white'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View>

          <View style={tw`px-6 mt-4`}>
            <TouchableOpacity
              onPress={() => {
                setisVisible(true);
              }}
              style={[
                tw`flex flex-row items-center`,
                {marginTop: perHeight(15)},
              ]}>
              <View>
                <Image
                  source={images.transactionHistory}
                  style={{
                    height: 25,
                    width: 27,
                  }}
                  resizeMode="contain"
                />
              </View>
              <View style={tw`ml-3`}>
                <Textcomp
                  text={'View Referral History'}
                  size={13}
                  lineHeight={14}
                  color={'#000000'}
                  fontFamily={'Inter-Medium'}
                />
              </View>
              <View style={tw`ml-auto`}>
                <Image
                  source={images.arrow_right}
                  style={{
                    height: 22,
                    width: 22,
                  }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={tw`h-40`} /> */}
      </ScrollView>
      <View style={tw`h-0.5 w-full bg-black absolute  bottom-[3%]`} />

      <Modal
        isVisible={isVisible}
        onModalHide={() => {
          setisVisible(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setisVisible(false)}
        swipeThreshold={200}
        swipeDirection={['down']}
        onSwipeComplete={() => setisVisible(false)}
        onBackButtonPress={() => setisVisible(false)}>
        <View style={tw`h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setisVisible(false)}
            style={tw`flex-1`}
          />
          <View style={tw`h-[40.5%] mt-auto bg-[#D9D9D9]`}>
            <TouchableOpacity
              onPress={() => {
                setisVisible(false);
              }}
              style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
            />
            <View>
              <View style={[tw` py-4 pt-8`, {marginLeft: perWidth(25)}]}>
                <Textcomp
                  text={'Referral History'}
                  size={17}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-Bold'}
                />
              </View>

              <View style={tw`flex flex-row px-6`}>
                <View
                  style={tw`flex flex-col w-1/2 border-r border-[#6D6F76] `}>
                  <Textcomp
                    text={'TOTAL CASH EARNED'}
                    size={10}
                    lineHeight={17}
                    color={'#00041380'}
                    fontFamily={'Inter-Regular'}
                  />

                  <View style={tw`mt-4`}>
                    <Textcomp
                      text={`₦ ${
                        Number(referralDetails?.completedNumber) * 500
                      }`}
                      size={14}
                      lineHeight={17}
                      color={'#000000'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                </View>
                <View style={tw`flex flex-col w-1/2 border-[#6D6F76] px-4`}>
                  <Textcomp
                    text={'FRIENDS WHO YOU REFERRED'}
                    size={9}
                    lineHeight={17}
                    color={'#00041380'}
                    fontFamily={'Inter-Regular'}
                  />

                  <View style={tw`mt-4`}>
                    <Textcomp
                      text={`${referralDetails?.totalNumber}`}
                      size={14}
                      lineHeight={17}
                      color={'#000000'}
                      fontFamily={'Inter-Bold'}
                    />
                  </View>
                </View>
              </View>
              <View style={[tw`px-6 mt-6`, {}]}>
                <Textcomp
                  text={'FRIENDS WHO HAVE MADE A TRANSACTION'}
                  size={10}
                  lineHeight={17}
                  color={'#00041380'}
                  fontFamily={'Inter-Regular'}
                />

                <View style={tw`mt-3`}>
                  <Textcomp
                    text={`${referralDetails?.completedNumber}`}
                    size={17}
                    lineHeight={17}
                    color={'#000000'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
              </View>

              <View style={tw`mt-6 px-6`}>
                <Textcomp
                  text={
                    'Get 500 naira when a friend signs up with your referral code and makes a transaction.'
                  }
                  size={14}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-semiBold'}
                />
              </View>
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
    </SafeAreaView>
  );
};

export default Referrals;
