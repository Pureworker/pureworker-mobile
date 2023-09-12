import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import images from '../../constants/images';
import TextInputs from '../../components/TextInput2';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';
import ServiceCard from '../../components/cards/serviceCard';
import ClosetoYou from '../../components/cards/closeToYou';
import CategoryList2 from '../../components/CategoryList2';
import commonStyle from '../../constants/commonStyle';
import {useGetCategoryQuery} from '../../store/slice/api';
import Modal from 'react-native-modal/dist/modal';
import {
  getCategory,
  getPopularService,
  getProviderOrders,
  getUser,
} from '../../utils/api/func';
import {
  addPopularServices,
  addSCategory,
  addUserData,
  addproviderOrders,
} from '../../store/reducer/mainSlice';
import ClosetoYou3 from '../../components/cards/CloseToYou3';
import {formatAmount} from '../../utils/validations';

const Home = ({navigation}: any) => {
  //   const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [InfoModal, setInfoModal] = useState(false);
  const [ContactAgent, setContactAgent] = useState(false);

  const [OinProgress, setOinProgress] = useState([]);
  const [OinPending, setOinPending] = useState([]);

  const data = [
    {id: '1', title: 'Item 1'},
    {id: '2', title: 'Item 2'},
    {id: '3', title: 'Item 3'},
    {id: '4', title: 'Item 4'},
    {id: '5', title: 'Item 5'},
  ];

  // const {data: getCategoryData, isLoading, isError} = useGetCategoryQuery();
  // const getCategory = getCategoryData ?? [];
  // console.log(getCategory);

  //
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const initGetUsers = async () => {
      const res: any = await getUser('');
      console.log('dddddddd', res?.data?.user);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addUserData(res?.data?.user));
      }
      // setloading(false);
    };
    const initGetCategory = async () => {
      setisLoading(true);
      const res: any = await getCategory('');
      // console.log('aaaaaaaaa', res?.data?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addSCategory(res?.data?.data));
      }
      setisLoading(false);
    };
    const initGetPopularServices = async () => {
      setisLoading(true);
      const res: any = await getPopularService('');
      // console.log('ppppppppp', res?.data?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addPopularServices(res?.data?.data));
      }
      setisLoading(false);
    };
    initGetUsers();
    // initGetCategory();
    // initGetPopularServices();
  }, [dispatch]);
  const providerOrders = useSelector((state: any) => state.user.providerOrders);
  useEffect(() => {
    const initGetOrders = async () => {
      setisLoading(true);
      const res: any = await getProviderOrders('64f20fb6ee98ab7912406b14');
      console.log('oooooooo', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addproviderOrders(res?.data?.data));
        let inProgress = providerOrders?.filter(
          item => item?.status === 'INPROGRESS',
        );
        let pending = providerOrders?.filter(
          item => item?.status === 'PENDING',
        );
        setOinProgress(inProgress);
        setOinPending(pending);
      }
      setisLoading(false);
    };
    initGetOrders();
  }, []);

  //selectors
  const userData = useSelector((state: any) => state.user.userData);
  const _getCategory = useSelector((state: any) => state.user.category);
  const _popularServices = useSelector(
    (state: any) => state.user.popularServices,
  );
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#EBEBEB'}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
        <ScrollView>
          <View
            style={[
              tw`items-center justify-center`,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 20,
              },
            ]}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                source={images.profile}
                style={{height: 40, width: 40}}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInputs
              style={{marginTop: 10, width: '70%'}}
              labelText={'Search'}
              state={search}
              setState={setSearch}
              icon={
                <Image
                  resizeMode="contain"
                  source={images.search}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: '#000413',
                    marginLeft: 5,
                  }}
                />
              }
            />
            <TouchableOpacity
              onPress={() => {
                setInfoModal(true);
              }}
              style={{
                backgroundColor: '#000',
                width: 40,
                height: 40,
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={images.question}
                style={{height: 20, width: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              tw``,
              {marginLeft: perWidth(18), marginTop: perHeight(28)},
            ]}>
            <Textcomp
              text={`Welcome ${userData?.firstName || userData?.businessName},`}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>

          <View
            style={[
              tw`flex flex-row`,
              {marginHorizontal: perWidth(27), marginTop: perHeight(21)},
            ]}>
            <View
              style={[
                tw`border-2 border-[${colors.primary}]`,
                {
                  width: perWidth(150),
                  height: perHeight(100),
                  borderRadius: 20,
                },
              ]}>
              <View
                style={[
                  tw`bg-white h-1/2 items-center justify-center flex flex-row`,
                  {borderTopRightRadius: 20, borderTopLeftRadius: 20},
                ]}>
                <Textcomp
                  text={`${providerOrders?.length}`}
                  size={36}
                  lineHeight={36}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
                <Image
                  resizeMode="contain"
                  source={images.orderlist}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: '#000413',
                    marginLeft: 5,
                  }}
                />
              </View>
              <View
                style={[
                  tw`bg-[${colors.darkPurple}] h-1/2 items-center justify-center flex flex-row`,
                  {borderBottomRightRadius: 18, borderBottomLeftRadius: 18},
                ]}>
                <Textcomp
                  text={'Orders'}
                  size={14}
                  lineHeight={16}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
            <View
              style={[
                tw`border-2 border-[${colors.primary}]`,
                {
                  width: perWidth(150),
                  height: perHeight(100),
                  borderRadius: 20,
                  marginLeft: perWidth(31),
                },
              ]}>
              <View
                style={[
                  tw`bg-white h-1/2 items-center justify-center flex flex-row`,
                  {borderTopRightRadius: 20, borderTopLeftRadius: 20},
                ]}>
                <Textcomp
                  text={`${OinPending?.length}`}
                  size={36}
                  lineHeight={36}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
                <Image
                  resizeMode="contain"
                  source={images.pending}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: '#000413',
                    marginLeft: 5,
                  }}
                />
              </View>
              <View
                style={[
                  tw`bg-[${colors.darkPurple}] h-1/2 items-center justify-center flex flex-row`,
                  {borderBottomRightRadius: 18, borderBottomLeftRadius: 18},
                ]}>
                <Textcomp
                  text={'Pending Orders'}
                  size={14}
                  lineHeight={16}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              tw`flex flex-row`,
              {marginHorizontal: perWidth(27), marginTop: perHeight(21)},
            ]}>
            <View
              style={[
                tw`border-2 border-[${colors.primary}]`,
                {
                  width: perWidth(150),
                  height: perHeight(100),
                  borderRadius: 20,
                },
              ]}>
              <View
                style={[
                  tw`bg-white h-1/2 items-center justify-center flex flex-row`,
                  {borderTopRightRadius: 20, borderTopLeftRadius: 20},
                ]}>
                <Textcomp
                  text={`NGN${formatAmount(
                    userData?.wallet?.availableBalance,
                  )}`}
                  size={20}
                  lineHeight={20}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View
                style={[
                  tw`bg-[${colors.darkPurple}] h-1/2 items-center justify-center flex flex-row`,
                  {borderBottomRightRadius: 18, borderBottomLeftRadius: 18},
                ]}>
                <Textcomp
                  text={'Total Earning'}
                  size={14}
                  lineHeight={16}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
            <View
              style={[
                tw`border-2 border-[${colors.primary}]`,
                {
                  width: perWidth(150),
                  height: perHeight(100),
                  borderRadius: 20,
                  marginLeft: perWidth(31),
                },
              ]}>
              <View
                style={[
                  tw`bg-white h-1/2 items-center justify-center flex flex-row`,
                  {borderTopRightRadius: 20, borderTopLeftRadius: 20},
                ]}>
                <Textcomp
                  // text={'NGN249,0000'}
                  text={`NGN${formatAmount(
                    userData?.wallet?.availableBalance,
                  )}`}
                  size={20}
                  lineHeight={20}
                  color={'#000413'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View
                style={[
                  tw`bg-[${colors.darkPurple}] h-1/2 items-center justify-center flex flex-row`,
                  {borderBottomRightRadius: 18, borderBottomLeftRadius: 18},
                ]}>
                <Textcomp
                  text={'Wallet'}
                  size={14}
                  lineHeight={16}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          </View>
          {/* Popular Section */}
          <View>
            <View
              style={[
                tw`flex flex-row items-center justify-between`,
                {marginLeft: perWidth(18), marginTop: perHeight(22)},
              ]}>
              <View style={[tw``]}>
                <Textcomp
                  text={'Orders in progress'}
                  size={25}
                  lineHeight={28}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                />
              </View>
              <TouchableOpacity style={[tw`mr-4`]}>
                <Textcomp
                  text={'See All'}
                  size={14}
                  lineHeight={16}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                />
              </TouchableOpacity>
            </View>

            {OinProgress?.length < 1 ? (
              <View style={[tw`mt-4`, {marginLeft: perWidth(27)}]}>
                <Textcomp
                  text={'You have no orders in progress'}
                  size={18}
                  lineHeight={18}
                  color={'#88087B'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            ) : (
              <View style={{flex: 1}}>
                <FlatList
                  data={OinProgress}
                  horizontal={true}
                  renderItem={(item: any) => {
                    return <ClosetoYou3 item={item?.item} index={item.index} />;
                  }}
                  keyExtractor={item => item.id}
                />
              </View>
            )}
          </View>
          {/* Pending Orders */}
          <View>
            <View
              style={[
                tw`flex flex-row items-center justify-between`,
                {marginLeft: perWidth(18), marginTop: perHeight(28)},
              ]}>
              <View style={[tw``]}>
                <Textcomp
                  text={'Pending Orders'}
                  size={25}
                  lineHeight={28}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                />
              </View>
              <TouchableOpacity style={[tw`mr-4`]}>
                <Textcomp
                  text={'See All'}
                  size={14}
                  lineHeight={16}
                  color={'#000413'}
                  fontFamily={'Inter-Medium'}
                />
              </TouchableOpacity>
            </View>

            {OinPending?.length < 1 ? (
              <View style={[tw`mt-4`, {marginLeft: perWidth(27)}]}>
                <Textcomp
                  text={'You have no orders in pending'}
                  size={18}
                  lineHeight={18}
                  color={'#88087B'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            ) : (
              <View style={{flex: 1}}>
                <FlatList
                  data={OinPending}
                  horizontal={true}
                  renderItem={(item: any) => {
                    return <ClosetoYou3 item={item?.item} index={item.index} />;
                  }}
                  keyExtractor={item => item.id}
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProfileStep1');
            }}
            style={[
              tw`bg-[#2D303C] mx-auto items-center justify-center`,
              {
                width: perWidth(309),
                height: perHeight(30),
                borderRadius: 7,
                marginTop: perHeight(43),
              },
            ]}>
            <Textcomp
              text={'Complete your registration to accept orders'}
              size={14}
              lineHeight={16}
              color={colors.primary}
              fontFamily={'Inter-Medium'}
            />
          </TouchableOpacity>
          <View style={tw`h-20`} />
        </ScrollView>
      </View>
      <Modal
        isVisible={InfoModal}
        onModalHide={() => {
          setInfoModal(false);
          setContactAgent(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setInfoModal(false)}
            style={tw`flex-1`}
          />
          {!ContactAgent && (
            <View style={tw`h-[20%]  items-center mt-auto bg-[#D9D9D9]`}>
              <TouchableOpacity
                onPress={() => {
                  setInfoModal(false);
                  setContactAgent(false);
                }}
                style={tw`w-15 h-1 rounded-full  bg-[${colors.darkPurple}]`}
              />
              <TouchableOpacity
                onPress={() => {
                  setInfoModal(false);
                  navigation.navigate('FAQ');
                }}
                style={{
                  width: perWidth(316),
                  height: perHeight(40),
                  borderRadius: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.darkPurple,
                  marginTop: 18,
                }}>
                <Textcomp
                  text={'FAQ'}
                  size={14}
                  lineHeight={17}
                  color={'#FFC727'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setContactAgent(true);
                }}
                style={{
                  width: perWidth(316),
                  height: perHeight(40),
                  borderRadius: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.darkPurple,
                  marginTop: 10,
                }}>
                <Textcomp
                  text={'Connect to an Agent'}
                  size={14}
                  lineHeight={17}
                  color={'#FFC727'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            </View>
          )}

          {ContactAgent && (
            <View
              style={tw`h-[10%] justify-center items-center mt-auto bg-[#D9D9D9]`}>
              <View>
                <Textcomp
                  text={'An Agent will contact you as soon as possible'}
                  size={14}
                  lineHeight={17}
                  color={'#000000'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
