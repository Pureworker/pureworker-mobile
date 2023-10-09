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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import FastImage from 'react-native-fast-image';
import {
  addTransactions,
  addcategorizedTransdata,
} from '../../store/reducer/mainSlice';
import {getTransactions} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';

const TransactionHistory = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  // const [categorizedData, setcategorizedData] = useState({});

  //filter  transaction datat to get months
  const months = ['May', 'Apr', 'Feb'];
  const transactions = useSelector((state: any) => state.user.transactions);
  const categorizedData = useSelector(
    (state: any) => state.user.categorizedTransdata,
  );
  console.log(transactions);

  useEffect(() => {
    const initGetUsers = async () => {
      setisLoading(true);
      const res: any = await getTransactions('');
      // console.log('dddddddd', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addTransactions(res?.data?.data));
        sort(transactions);
      }
      // setloading(false);
      setisLoading(false);
    };
    initGetUsers();
  }, []);

  // const categorizedData: any = {};
  const sort = (data: any[]) => {
    // Create an object to store categorized data
    // Iterate through the data and categorize it by month
    const _categorizedData: any = {};
    data.forEach(item => {
      const createdAt = new Date(item.createdAt);
      const monthYear = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`; // Format: YYYY-MM

      // Create an array for the month if it doesn't exist
      if (!_categorizedData[monthYear]) {
        _categorizedData[monthYear] = [];
      }

      // Push the item into the corresponding month
      _categorizedData[monthYear].push(item);
    });
    // setcategorizedData(categorizedData);
    console.log('here', _categorizedData);
    dispatch(addcategorizedTransdata(_categorizedData));
    // Sort the data within each month (optional)
    // Object.keys(categorizedData).forEach(monthYear => {
    //   categorizedData[monthYear].sort((a, b) => {
    //     const dateA = new Date(a.createdAt);
    //     const dateB = new Date(b.createdAt);
    //     return dateA - dateB;
    //   });
    // });
  };

  function formatDate(inputDate) {
    // Split the input date by '-'
    const dateParts = inputDate.split('-');

    // Map the month number to its abbreviation
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Get the month abbreviation
    const monthAbbr = months[parseInt(dateParts[1]) - 1];

    // Create the formatted date string
    const formattedDate = `${monthAbbr} ${dateParts[0]}`;

    return formattedDate;
  }

  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <ScrollView>
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
              text={'Transaction  History'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>
        <View style={tw`flex-1`}>
          <View
            style={[
              tw`mx-auto`,
              {width: perWidth(335), paddingLeft: perWidth(10)},
            ]}>
            <View style={[tw``, {marginTop: perHeight(19)}]}>
              <Textcomp
                text={'Transactions'}
                size={17}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View>

          {!transactions || transactions?.length < 1 ? (
            <View
              style={[
                tw`mx-auto items-center `,
                {marginTop: SIZES.height * 0.35},
              ]}>
              <Textcomp
                text={'No Transactions Yet'}
                size={16.5}
                lineHeight={16.5}
                color={'#000413'}
                fontFamily={'Inter-Bold'}
              />
            </View>
          ) : (
            <>
              {/* {months.map((item, index) => {
                return (
                  <View style={[tw``, {paddingLeft: perWidth(10)}]}>
                    <View
                      style={[
                        tw``,
                        {marginTop: perHeight(19), paddingLeft: perWidth(13)},
                      ]}>
                      <Textcomp
                        text={`${item} 2023`}
                        size={17}
                        lineHeight={17}
                        color={'#000413'}
                        fontFamily={'Inter-SemiBold'}
                      />
                    </View>

                    <FlatList
                      scrollEnabled={false}
                      data={transactions}
                      renderItem={(item, index) => {
                        return (
                          <View
                            style={tw`flex flex-row justify-between items-center px-4 border-b border-[#00000033] ${
                              index === 0 ? 'pb-4' : 'py-4'
                            }`}>
                            <View
                              style={[tw`flex flex-row items-center  `, {}]}>
                              <Image
                                source={images.vender}
                                style={{width: perWidth(25), aspectRatio: 1}}
                              />
                              <View style={tw`flex flex-col ml-4`}>
                                <View style={[tw``, {marginTop: perHeight(0)}]}>
                                  <Textcomp
                                    text={'Peter Pedro'}
                                    size={15}
                                    lineHeight={17}
                                    color={'#000413'}
                                    fontFamily={'Inter-SemiBold'}
                                  />
                                </View>
                                <View style={[tw``, {marginTop: perHeight(4)}]}>
                                  <Textcomp
                                    text={'4 may, 13:45'}
                                    size={13}
                                    lineHeight={15}
                                    color={'#00041380'}
                                    fontFamily={'Inter'}
                                  />
                                </View>
                              </View>
                            </View>
                            <View style={tw`flex flex-col`}>
                              <View style={[tw``, {marginTop: perHeight(0)}]}>
                                <Textcomp
                                  text={'$2000'}
                                  size={15}
                                  lineHeight={17}
                                  color={'#000413'}
                                  fontFamily={'Inter-SemiBold'}
                                />
                              </View>
                              <View style={[tw``, {marginTop: perHeight(4)}]}>
                                <Textcomp
                                  text={'Payment'}
                                  size={13}
                                  lineHeight={15}
                                  color={'#00041380'}
                                  fontFamily={'Inter-SemiBold'}
                                />
                              </View>
                            </View>
                          </View>
                        );
                      }}
                      //   keyExtractor={item => item.id}
                      contentContainerStyle={{marginTop: 10}}
                    />
                  </View>
                );
              })} */}

              {Object.keys(categorizedData).map(monthYear => (
                <View key={monthYear}>
                  <View
                    style={[
                      tw`mb-4 ml-2`,
                      {marginTop: perHeight(19), paddingLeft: perWidth(13)},
                    ]}>
                    <Textcomp
                      text={`${formatDate(monthYear)}`}
                      size={17}
                      lineHeight={17}
                      color={'#000413'}
                      fontFamily={'Inter-SemiBold'}
                    />
                  </View>
                  {categorizedData[monthYear].map(
                    (item: {id: React.Key | null | undefined}, index) => {
                      if (item?.type !== 'funding') {
                        return (
                          <View
                            style={tw`flex flex-row justify-between items-center px-4 mx-2 border-b border-[#00000033] ${
                              index === 0 ? 'pb-4' : 'py-4'
                            }`}>
                            <View
                              style={[tw`flex flex-row items-center  `, {}]}>
                              <Image
                                resizeMode="contain"
                                source={images.pureWorkerLogo}
                                style={{width: perWidth(25), aspectRatio: 1}}
                              />
                              <View style={tw`flex flex-col ml-4`}>
                                <View style={[tw``, {marginTop: perHeight(0)}]}>
                                  <Textcomp
                                    text={'Transaction'}
                                    size={15}
                                    lineHeight={17}
                                    color={'#000413'}
                                    fontFamily={'Inter-SemiBold'}
                                  />
                                </View>
                                <View style={[tw``, {marginTop: perHeight(4)}]}>
                                  <Textcomp
                                    text={'4 may, 13:45'}
                                    size={13}
                                    lineHeight={15}
                                    color={'#00041380'}
                                    fontFamily={'Inter'}
                                  />
                                </View>
                              </View>
                            </View>
                            <View style={tw`flex flex-col`}>
                              <View style={[tw``, {marginTop: perHeight(0)}]}>
                                <Textcomp
                                  text={`NGN${item?.amount}`}
                                  size={15}
                                  lineHeight={17}
                                  color={'#000413'}
                                  fontFamily={'Inter-SemiBold'}
                                />
                              </View>
                              <View style={[tw``, {marginTop: perHeight(4)}]}>
                                <Textcomp
                                  text={`${item?.type}`}
                                  size={13}
                                  lineHeight={15}
                                  color={'#00041380'}
                                  fontFamily={'Inter-SemiBold'}
                                />
                              </View>
                            </View>
                          </View>
                        );
                      }
                    },
                  )}
                </View>
              ))}
            </>
          )}
        </View>
        <View style={tw`h-30`} />
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading/>}/>
    </View>
  );
};

export default TransactionHistory;
