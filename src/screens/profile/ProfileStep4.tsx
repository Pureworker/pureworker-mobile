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
  useGetCategoryQuery,
  useGetUserDetailQuery,
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
import {_verifyID, completeProfile} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
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

  const category = useSelector((state: any) => state.user.pickedServices);
  const [collapseState, setCollapseState] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState('');
  const [nationalityItems, setNationalityItems] = useState([
    'NIN',
    'Bank Verification Number',
    // 'Int. Passport',
    // 'Drivers License',
    // 'Voters Card',
    // 'Others',
  ]);

  const [login] = useLoginMutation();
  const [createService] = useCreateServiceMutation();

  // console.log('--pppp', completeProfileData);

  const dispatch = useDispatch();

  const verifyID = async () => {
    setisLoading(true);
    const data = {
      type: 'bvn',
      number: idNumber,
    };
    const res = await _verifyID(data);
    console.log(res, 'data-here', res?.data);

    if (
      (res?.status === 200 || res?.status === 201) &&
      res?.data?.status === 'success'
    ) {
      dispatch(
        addcompleteProfile({
          identity: {
            means:
              selectedVerification === 'Bank Verification Number'
                ? 'bvn'
                : 'vNIN',
            number: idNumber,
          },
        }),
      );
      //then save to db
      const resp: any = await completeProfile({
        identity: {
          means:
            selectedVerification === 'Bank Verification Number'
              ? 'bvn'
              : 'vNIN',
          number: idNumber,
        },
      });
      console.log('result', res?.data);
      if (resp?.status === 200 || resp?.status === 201) {
        // navigation.navigate('ProfileStep5', {
        //   serviceId: route?.params?.serviceId,
        // });
        navigation.navigate('Congratulations');
        dispatch(addformStage(6));
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
    }
    setisLoading(false);
  };
  const handleProfileSetup = () => {
    if (idNumber && selectedVerification) {
      const profileData = {
        serviceId: route?.params?.serviceId,
        idNumber: idNumber,
        potfolios: [],
        scheduleDate: null,
        appointmentTime: null,
      };

      if (getUser?.user?.accountType?.toUpperCase() === 'FREELANCER') {
        dispatch(
          addcompleteProfile({
            identity: {
              means: selectedVerification,
              number: idNumber,
            },
          }),
        );
      }
      if (getUser?.user?.accountType?.toUpperCase() === 'BUSINESS') {
        dispatch(
          addcompleteProfile({
            identity: {
              businessName: selectedVerification,
              cac: idNumber,
            },
          }),
        );
      }
      navigation.navigate('ProfileStep5', {
        serviceId: route?.params?.serviceId,
      });
      // createService(profileData)
      //   .unwrap()
      //   .then((data: any) => {
      //     if (data) {
      //       navigation.navigate('ProfileStep5', {
      //         serviceId: route?.params?.serviceId,
      //       });
      //     }
      //   })
      //   .catch((error: any) => {
      //     console.log('err', error);
      //     Snackbar.show({
      //       text: error.data.message,
      //       duration: Snackbar.LENGTH_SHORT,
      //       textColor: '#fff',
      //       backgroundColor: '#88087B',
      //     });
      //   });
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
  };

  const handleProfileSetup2 = async () => {};

  const {data: getUserData, isLoading: isLoadingUser} = useGetUserDetailQuery();
  const getUser = getUserData ?? [];
  const userData = useSelector((state: any) => state.user.userData);

  // console.log(getUserData,'asdf', getUser, getUser?.userType);
  console.log('mmmm', getUser?.user?.accountType?.toUpperCase());

  const [collapseState2, setcollapseState2] = useState(false);

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
          {(getUser?.user?.accountType?.toUpperCase() === 'FREELANCER' ||
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
                        flexDirection: 'row',
                        flexWrap: 'wrap',
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
                state={idNumber}
                setState={setIdNumber}
              />
            </>
          )}
          {(getUser?.user?.accountType?.toUpperCase() === 'PROVIDER' ||
            getUser?.user?.accountType?.toUpperCase() === 'BUSINESS') && (
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
                />
              </>
            </>
          )}

          {!isLoading ? (
            <Button
              onClick={() => {
                // handleProfileSetup();
                verifyID();
                // navigation.navigate('ProfileStep5', {
                //   serviceId: route?.params?.serviceId,
                // });
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
