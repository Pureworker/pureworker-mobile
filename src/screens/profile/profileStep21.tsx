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
import {addcompleteProfile} from '../../store/reducer/mainSlice';
import {perWidth} from '../../utils/position/sizes';
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

  const category = useSelector((state: any) => state.user.pickedServices);
  const [collapseState, setCollapseState] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState('');
  const [nationalityItems, setNationalityItems] = useState([
    'Int. Passport',
    'Drivers License',
    'vNIN',
    'Voters Card',
    'Bank Verification Number',
    'Others',
  ]);

  const [login] = useLoginMutation();
  const [createService, {isLoading}] = useCreateServiceMutation();

  // console.log('--pppp', completeProfileData);

  const dispatch = useDispatch();
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

  // console.log(getUserData,'asdf', getUser, getUser?.userType);
  console.log('mmmm', getUser?.user?.accountType?.toUpperCase());

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
          <View style={{zIndex: nationalityOpen ? 0 : 2}}>
            <TextWrapper
              children="Portfolio (You can add a maximum of 3 per service)"
              isRequired={false}
              fontType={'semiBold'}
              style={{
                fontSize: 16,
                marginTop: 20,
                marginBottom: 3,
                color: colors.black,
              }}
            />
            <TextWrapper
              children="Click “Add a Portfolio” to showcase projects you’ve worked on"
              isRequired={false}
              fontType={'Regular'}
              style={{
                fontSize: 14,
                marginTop: 0,
                marginBottom: 13,
                color: colors.black,
              }}
            />
            {allPotfolio.map((item: any, index: number) => {
              return (
                <PotfolioWrapper
                  key={index}
                  index={index}
                  item={item}
                  allPotfolio={allPotfolio}
                  setAllPotfolio={setAllPotfolio}
                  setShortDescription={setShortDescription}
                  setPotfolioImageUrl={setPotfolioImageUrl}
                  setEditKey={setEditKey}
                />
              );
            })}
            <TouchableOpacity
              style={[
                tw`bg-[${colors.darkPurple}] py-3 rounded-lg ml-auto items-center justify-center`,
                {width: perWidth(175)},
              ]}
              onPress={() => {
                // if (allPotfolio.length < 3) {
                //   setPotfolioEnable(true);
                // }
                setportfolioToServiceCount([...portfolioToServiceCount, 1]);
              }}>
              <TextWrapper
                children={`Add ${
                  portfolioToServiceCount.length === 0 ? 'a' : 'another'
                } Portfolio`}
                isRequired={false}
                fontType={'semiBold'}
                style={{fontSize: 16, color: colors.white}}
              />
            </TouchableOpacity>

            <View>
              {portfolioToServiceCount?.map((item, index) => {
                return (
                  <Portfoliocomp key={index} servicePrice={servicePrice} />
                );
              })}
            </View>

            {allPotfolio.length === 3 && (
              <View
                style={{
                  backgroundColor: colors.greyLight1,
                  height: 80,
                  borderRadius: 5,
                }}>
                <Image
                  source={images.cross}
                  resizeMode="contain"
                  style={{
                    width: 10,
                    height: 10,
                    marginLeft: 20,
                    marginTop: 10,
                    tintColor: '#000',
                  }}
                />
                <TextWrapper
                  children="Maximum number of portfolios added."
                  isRequired={false}
                  fontType={'normal'}
                  style={{
                    textAlign: 'center',
                    fontSize: 12,
                    marginTop: 13,
                    color: colors.black,
                  }}
                />
              </View>
            )}

            {!isLoading ? (
              <View style={{marginHorizontal: 25, marginTop: 75}}>
                <Button
                  onClick={() => {
                    // handleProfileSetup();
                    // navigation.navigate('ProfileStep3', {serviceId: data?.serviceId});
                    // navigation.navigate('ProfileStep3', {serviceId: 'id_here'});
                    // dispatch(
                    //   addcompleteProfile({
                    //     description: description,
                    //     serviceIntro: [],
                    //   }),
                    // );
                    // dispatch(addcompleteProfile({city: nationalityValue}));
                    //   console.log(completeProfileData, 'here', allPotfolio);
                    //   _handleFuncUpload();
                  }}
                  style={{
                    marginBottom: 20,
                    marginTop: 20,
                    marginHorizontal: 40,
                    backgroundColor: colors.lightBlack,
                  }}
                  textStyle={{color: colors.primary}}
                  text={'Next'}
                />
              </View>
            ) : (
              <ActivityIndicator
                style={{marginTop: 95, marginBottom: 40}}
                size={'large'}
                color={colors.parpal}
              />
            )}
          </View>

          {!isLoading ? (
            <Button
              onClick={() => {
                handleProfileSetup();
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
    </View>
  );
};

export default ProfileStep4;
