import React, {useState} from 'react';
import {
  View,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import Header from '../../components/Header';
import images from '../../constants/images';
import Button from '../../components/Button';
import TextWrapper from '../../components/TextWrapper';
import commonStyle from '../../constants/commonStyle';
import {
  useCreateServiceMutation,
  useLoginMutation,
} from '../../store/slice/api';
import colors from '../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import ProfileStepWrapper from '../../components/ProfileStepWrapper';
import TextInputs from '../../components/TextInputs';

import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import Snackbar from 'react-native-snackbar';
import {addcompleteProfile, addformStage} from '../../store/reducer/mainSlice';
import {completeProfile} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import {DateTime} from 'luxon';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Textcomp from '../../components/Textcomp';
import {perHeight} from '../../utils/position/sizes';
import tw from 'twrnc';
import {ToastShort} from '../../utils/utils';
type Route = {
  key: string;
  name: string;
  params: {
    serviceId: string;
  };
};

const ProfileStep4 = () => {
  const navigation = useNavigation<StackNavigation>();
  const [idNumber, setIdNumber] = useState('');
  const [idName, setidName] = useState('');
  const route: Route = useRoute();
  const [isLoading, setisLoading] = useState(false);

  // const category = useSelector((state: any) => state.user.pickedServices);
  const [collapseState, setCollapseState] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState('');
  const [nationalityItems, setNationalityItems] = useState([
    'NIN',
    'Bank Verification Number',
    // 'Int. Passport',
    // 'Drivers License',
    // 'Voters Card',
    // 'Others',
  ]);
  const userData = useSelector((state: any) => state.user.userData);

  const dispatch = useDispatch();

  const verifyID = async () => {
    if (!selectedVerification) {
      ToastShort('Please choose a Means of ID');
      return;
    }

    if (!idNumber) {
      ToastShort('ID Number is required');
      return;
    }
    setisLoading(true);
    // const data = {
    //   type: selectedVerification === 'NIN' ? 'nin' : 'bvn',
    //   number: idNumber,
    // };
    const res: any = await completeProfile({
      identity: {
        type:
          selectedVerification === 'Bank Verification Number' ? 'bvn' : 'nin',
        number: idNumber,
      },
    });
    console.log('result', res?.data);
    if (res?.status === 200 || res?.status === 201) {
      Snackbar.show({
        text: 'Identity Submitted Successfully!.  Proceeding to Virtual Interview',
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      setTimeout(() => {
        navigation.navigate('FaceDetection', {page: 'Profile'});
      }, 5000);
      // navigation.navigate('Congratulations');
      dispatch(addformStage(6));
      setisLoading(false);
    } else {
      ToastShort(
        `${
          res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured'
        }`,
      );
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
      setisLoading(false);
    }
  };
  const verifyCAC = async () => {
    if (!idNumber) {
      ToastShort('Please enter IdNumber');
      return;
    }
    const d = {
      identity: {
        type: 'cac',
        number: idNumber,
      },
    };
    setisLoading(true);
    const res: any = await completeProfile({
      identity: {
        type: 'cac',
        number: idNumber,
      },
    });
    console.log('result', res?.data);
    if (res?.status === 200 || res?.status === 201) {
      // navigation.navigate('Congratulations');
      navigation.navigate('FaceDetection', {page: 'Profile'});
      dispatch(addformStage(6));
      setisLoading(false);
    } else {
      ToastShort(
        `${
          res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured'
        }`,
      );
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

      setisLoading(false);
    }
  };

  const [collapseState2, setcollapseState2] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [schdeuleIsoDate, setschdeuleIsoDate] = useState('');
  const [displayDate, setdisplayDate] = useState('');

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date: any) => {
    const f = `${date}`;
    const jsDate = new Date(f);
    const luxonDateTime = DateTime.fromJSDate(jsDate);
    const isoString = luxonDateTime.toISO();
    console.log(isoString);
    setschdeuleIsoDate(isoString);
    setdisplayDate(f);
    hideDatePicker();
  };
  function formatToCustomString(date: string | number | Date) {
    const jsDate = new Date(date);
    const luxonDateTime = DateTime.fromJSDate(jsDate);

    return luxonDateTime.toLocaleString({
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
    });
  }

  return (
    <View style={[{flex: 1, backgroundColor: colors.greyLight}]}>
      <Header
        style={{backgroundColor: colors.greyLight}}
        imageStyle={{tintColor: colors.black}}
        textStyle={{
          color: colors.black,
          fontFamily: commonStyle.fontFamily.semibold,
        }}
        title={'Complete your Registration'}
        image={images.back}
        func={() => {
          navigation.navigate('ProfileStep3');
        }}
      />
      <ProfileStepWrapper active={'four'} />
      <ScrollView>
        <View style={{marginHorizontal: 20}}>
          <TextWrapper
            children="Identity Verification"
            fontType={'semiBold'}
            style={{fontSize: 20, marginTop: 30, color: colors.black}}
          />
          {/* For freelancers  */}
          {(userData?.accountType?.toUpperCase() === 'FREELANCER' ||
            userData?.accountType?.toUpperCase() === 'FREELANCER') && (
            <>
              <Collapse
                // onToggle={() => {
                //   if (!dataLoaded) {
                //     setDataLoaded(true);
                //   }
                //   setcollapseState2(!collapseState2);
                //   setCollapseState(!collapseState);
                // }}
                onToggle={() => {
                  setcollapseState2(!collapseState2);
                }}
                isExpanded={collapseState2}
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
                      {selectedVerification
                        ? selectedVerification
                        : 'Select a valid means of ID'}
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
                  {nationalityItems && (
                    <View
                      style={{
                        borderColor: colors.primary,
                        backgroundColor: colors.lightBlack,
                        borderWidth: 2,
                        // flexDirection: 'row',
                        // flexWrap: 'wrap',
                        width: '95%',
                      }}>
                      {nationalityItems.map((item: any, index: number) => {
                        var offerStyle;
                        if (index > 0) {
                          offerStyle = {marginBottom: 25};
                        }
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedVerification(item);
                              setcollapseState2(false);
                            }}
                            style={{marginTop: 8}}>
                            <TextWrapper
                              fontType={'semiBold'}
                              style={{
                                color: selectedVerification.includes(item)
                                  ? colors.primary
                                  : colors.white,
                                marginLeft: 11,
                                marginRight: 8,
                                marginBottom: 8,
                              }}>
                              {item}
                            </TextWrapper>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </CollapseBody>
              </Collapse>
              <TextWrapper
                children="Enter ID Number"
                isRequired={true}
                fontType={'semiBold'}
                style={{fontSize: 13, marginTop: 25, color: colors.black}}
              />
              <TextInputs
                style={{
                  marginTop: 10,
                  backgroundColor: colors.greyLight1,
                  paddingHorizontal: 10,
                }}
                labelText={''}
                maxLength={11}
                state={idNumber}
                setState={setIdNumber}
                keyBoardType={'numeric'}
              />
            </>
          )}
          {(userData?.accountType?.toUpperCase() === 'BUSINESS' ||
            userData?.accountType?.toUpperCase() === 'PROVIDER') && (
            <>
              <>
                <TextWrapper
                  children="Business Name"
                  isRequired={true}
                  fontType={'semiBold'}
                  style={{fontSize: 13, marginTop: 13, color: colors.black}}
                />
                <TextInputs
                  style={{
                    marginTop: 10,
                    backgroundColor: colors.greyLight1,
                    paddingHorizontal: 10,
                  }}
                  labelText={'Enter Business Name'}
                  state={idName}
                  setState={setidName}
                />
              </>
              <>
                <TextWrapper
                  children="CAC"
                  isRequired={true}
                  fontType={'semiBold'}
                  style={{fontSize: 13, marginTop: 13, color: colors.black}}
                />
                <TextInputs
                  style={{
                    marginTop: 10,
                    backgroundColor: colors.greyLight1,
                    paddingHorizontal: 10,
                  }}
                  labelText={'Enter CAC Number'}
                  state={idNumber}
                  setState={setIdNumber}
                  keyBoardType={'numeric'}
                />
              </>
              {/* <>
                <TextWrapper
                  children="Date of Registration"
                  isRequired={true}
                  fontType={'semiBold'}
                  style={{fontSize: 13, marginTop: 13, color: colors.black}}
                />
                <TouchableOpacity
                  onPress={() => {
                    setDatePickerVisibility(!isDatePickerVisible);
                  }}
                  style={[
                    tw`w-full px-4 justify-center rounded-lg mt-3`,
                    {backgroundColor: colors.greyLight1, height: perHeight(40)},
                  ]}>
                  <Textcomp
                    text={`${
                      displayDate
                        ? formatToCustomString(displayDate)
                        : 'Pick date'
                    }`}
                    size={15}
                    lineHeight={17}
                    color={displayDate ? '#000413' : 'grey'}
                    fontFamily={'Inter-Regular'}
                  />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </> */}
            </>
          )}

          {!isLoading ? (
            <Button
              onClick={() => {
                // handleProfileSetup();
                userData?.accountType?.toUpperCase() === 'BUSINESS'
                  ? verifyCAC()
                  : verifyID();
              }}
              style={{
                marginHorizontal: 40,
                marginTop: 140,
                backgroundColor: colors.lightBlack,
              }}
              textStyle={{color: colors.primary}}
              text={'Verify'}
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
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default ProfileStep4;
