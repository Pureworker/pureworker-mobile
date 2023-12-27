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
  ActivityIndicator,
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
import {getBanks, getTransactions} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import Button from '../../components/Button';
import TextInputs from '../../components/TextInput2';
import TextWrapper from '../../components/TextWrapper';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import colors from '../../constants/colors';
import CustomLoading from '../../components/customLoading';
import {SelectList} from 'react-native-dropdown-select-list';
import {ToastShort} from '../../utils/utils';

const Withdraw = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  // const [categorizedData, setcategorizedData] = useState({});

  //filter  transaction datat to get months
  const months = ['May', 'Apr', 'Feb'];
  const transactions = useSelector((state: any) => state.user.transactions);
  const banks = useSelector((state: any) => state.user.banks);
  const categorizedData = useSelector(
    (state: any) => state.user.categorizedTransdata,
  );
  console.log(transactions);

  const [bankList, setbankList] = useState([]);

  useEffect(() => {
    const initGetUsers = async () => {
      setisLoading(true);
      const res: any = await getBanks('');

      if (res?.data?.data) {
        let list: any = [];
        res?.data?.data?.map(item => {
          let obj = {
            label: item?.name,
            value: item?.name,
          };
          list.push(obj);
        });
        setbankList(list);
      }
      // console.log('banks', res?.data);
      // if (res?.status === 201 || res?.status === 200) {
      //   dispatch(addTransactions(res?.data?.data));
      //   sort(transactions);
      // }
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
  const [collapseState, setCollapseState] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [accountNumber, setaccountNumber] = useState('');
  const [accountName, setaccountName] = useState('');
  const [bank, setbank] = useState('');
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
              text={'Withdraw'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>
        <View style={tw`flex-1`}>
          {/* <View
            style={[
              tw`mx-auto`,
              {width: perWidth(335), paddingLeft: perWidth(10)},
            ]}>
            <View style={[tw``, {marginTop: perHeight(19)}]}>
              <Textcomp
                text={'Enter Details below '}
                size={12}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
          </View> */}

          <ScrollView scrollEnabled={false}>
            <View style={{marginHorizontal: 20}}>
              <TextWrapper
                children="Withdraw Request"
                fontType={'semiBold'}
                style={{fontSize: 20, marginTop: 30, color: colors.black}}
              />
              {/* For freelancers  */}
              {/* <>
                <Collapse
                  onToggle={() => {
                    if (!dataLoaded) {
                      setDataLoaded(true);
                    }
                    setCollapseState(!collapseState);
                  }}
                  style={{
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}>
                  <CollapseHeader
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: colors.lightBlack,
                      marginVertical: 10,
                      borderRadius: 5,
                      height: 35,
                      width: '95%',
                      borderColor: colors.primary,
                      borderWidth: 2,
                      paddingHorizontal: 15,
                      // marginHorizontal: 20
                    }}>
                    <View style={{}}>
                      <TextWrapper
                        fontType={'semiBold'}
                        style={{
                          fontSize: 14,
                          color: '#fff',
                        }}>
                        Select Bank
                      </TextWrapper>
                    </View>
                    {collapseState ? (
                      <Image
                        source={images.polygonDown}
                        resizeMode={'contain'}
                        style={{width: 15, height: 15}}
                      />
                    ) : (
                      <Image
                        source={images.polygonForward}
                        resizeMode={'contain'}
                        style={{width: 15, height: 15}}
                      />
                    )}
                    <TextWrapper
                      fontType={'semiBold'}
                      style={{
                        fontSize: 35,
                        color: '#D20713',
                        position: 'absolute',
                        right: -25,
                      }}>
                      {'*'}
                    </TextWrapper>
                  </CollapseHeader>
                  <CollapseBody>
                    {banks && (
                      <View
                        style={{
                          borderColor: colors.primary,
                          backgroundColor: colors.lightBlack,
                          borderWidth: 2,
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          width: '95%',
                        }}>
                        {banks.map((item: any, index: number) => {
                          var offerStyle;
                          if (index > 0) {
                            offerStyle = {marginBottom: 25};
                          }
                          return (
                            <TouchableOpacity
                            key={index}
                              onPress={() => {
                                // setSelectedVerification(item);
                                setbank(item);
                              }}
                              style={{marginTop: 8}}>
                              <TextWrapper
                                fontType={'semiBold'}
                                style={{
                                  color:
                                    bank === item
                                      ? colors.primary
                                      : colors.white,
                                  marginLeft: 11,
                                  marginRight: 8,
                                  marginBottom: 8,
                                }}>
                                {item?.name}
                              </TextWrapper>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </CollapseBody>
                </Collapse>
                <TextWrapper
                  children="Enter account Number"
                  isRequired={true}
                  fontType={'semiBold'}
                  style={{fontSize: 13, marginTop: 25, color: colors.black}}
                />
                <TextInputs
                  style={{marginTop: 10, backgroundColor: colors.greyLight1}}
                  labelText={''}
                  state={accountNumber}
                  setState={setaccountNumber}
                />
              </> */}
              <View style={[tw`mb-4`, {
                // minHeight: 100
              }]}>
                <SelectList
                  setSelected={(val: any) => {
                    console.log(val);
                    setbank(val);
                  }}
                  data={bankList}
                  save="value"
                  boxStyles={[
                    tw` w-full items-center flex-row justify-between flex-1`,
                    {
                      paddingRight: 5,
                      borderRadius: 8,
                      // backgroundColor: colors.lightBlack,
                      borderColor: colors.black,
                      borderWidth: 2,
                    },
                  ]}
                  inputStyles={[
                    tw`items-center flex-row justify-center flex-1`,
                    {
                      height: 40,
                      textAlignVertical: 'center',
                      fontSize: 14,
                      textTransform: 'uppercase',
                      color: colors.white,
                      borderRadius: 8,
                    },
                  ]}
                  placeholder="Select a Bank"
                />
              </View>
              <>
                <TextWrapper
                  children="Account Number"
                  isRequired={true}
                  fontType={'semiBold'}
                  style={{fontSize: 13, marginTop: 20, color: colors.black}}
                />
                <TextInputs
                  style={{
                    marginTop: 10,
                    backgroundColor: colors.greyLight1,
                    borderRadius: 2,
                    padding: 5,
                    width: '100%',
                  }}
                  labelText={'Enter account number'}
                  state={accountName}
                  setState={setaccountName}
                  disable={false}
                />
              </>
              <>
                <TextWrapper
                  children="Account Name"
                  isRequired={true}
                  fontType={'semiBold'}
                  style={{fontSize: 13, marginTop: 20, color: colors.black}}
                />
                <TextInputs
                  style={{
                    marginTop: 10,
                    backgroundColor: colors.greyLight1,
                    borderRadius: 2,
                    padding: 5,
                    width: '100%',
                  }}
                  labelText={'Name here'}
                  state={accountName}
                  setState={setaccountName}
                  disable={false}
                />
              </>

              {!isLoading ? (
                <Button
                  onClick={() => {
                    // handleProfileSetup();
                    // navigation.navigate('ProfileStep5', {
                    //   serviceId: route?.params?.serviceId,
                    // });
                    ToastShort('Withdrawal is coming!.');
                  }}
                  style={{
                    marginHorizontal: 40,
                    marginTop: 140,
                    backgroundColor: colors.lightBlack,
                  }}
                  textStyle={{color: colors.primary}}
                  text={'Proceed'}
                />
              ) : (
                <ActivityIndicator
                  style={{marginTop: 150}}
                  size={'large'}
                  color={colors.parpal}
                />
              )}
            </View>
          </ScrollView>
        </View>
        <View style={tw`h-30`} />
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default Withdraw;
