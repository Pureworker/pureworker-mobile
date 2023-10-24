import React, {useState} from 'react';
import {View, ActivityIndicator, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import Header from '../../components/Header';
import images from '../../constants/images';
import Button from '../../components/Button';
import TextWrapper from '../../components/TextWrapper';
import commonStyle from '../../constants/commonStyle';
import colors from '../../constants/colors';
import {generalStyles} from '../../constants/generalStyles';
import ProfileStepWrapper from '../../components/ProfileStepWrapper';
import TextInputs from '../../components/TextInputs';
import Snackbar from 'react-native-snackbar';
import {useCreateServiceMutation} from '../../store/slice/api';
import {validateEmail} from '../../constants/utils';
import tw from 'twrnc';
import {useDispatch, useSelector} from 'react-redux';
import {addcompleteProfile, addformStage} from '../../store/reducer/mainSlice';
import {completeProfile} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
type Route = {
  key: string;
  name: string;
  params: {
    serviceId: string;
  };
};
const ProfileStep3 = () => {
  const navigation = useNavigation<StackNavigation>();
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  const [name1, setName1] = useState(
    completeProfileData?.contact?.[0]?.fullName || '',
  );
  const [name2, setName2] = useState(
    completeProfileData?.contact?.[1]?.fullName || '',
  );
  const [relation1, setRelation1] = useState(
    completeProfileData?.contact?.[0]?.relationship || '',
  );
  const [relation2, setRelation2] = useState(
    completeProfileData?.contact?.[1]?.relationship || '',
  );
  const [phoneNumber1, setPhoneNumber1] = useState(
    completeProfileData?.contact?.[0]?.phoneNumber || '',
  );
  const [phoneNumber2, setPhoneNumber2] = useState(
    completeProfileData?.contact?.[1]?.phoneNumber || '',
  );
  const [email1, setEmail1] = useState(
    completeProfileData?.contact?.[0]?.email || '',
  );
  const [email2, setEmail2] = useState(
    completeProfileData?.contact?.[1]?.email || '',
  );
  const [address1, setAddress1] = useState(
    completeProfileData?.contact?.[0]?.address || '',
  );
  const [address2, setAddress2] = useState(
    completeProfileData?.contact?.[1]?.address || '',
  );
  const route: Route = useRoute();
  const [isLoading, setisLoading] = useState(false);

  const [createService] = useCreateServiceMutation();

  const dispatch = useDispatch();

  const handleProfileSetup = async () => {
    if (
      // route?.params?.serviceId &&
      name1 &&
      name2 &&
      relation1 &&
      relation2 &&
      phoneNumber1 &&
      phoneNumber2 &&
      email1 &&
      email2 &&
      address1 &&
      address2
    ) {
      if (!validateEmail(email1)) {
        Snackbar.show({
          text: 'Please enter a valid email',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        return;
      }
      if (!validateEmail(email2)) {
        Snackbar.show({
          text: 'Please enter a valid email',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
        return;
      }
      const contact = [
        {
          fullName: name1,
          relationship: relation1,
          phoneNumber: phoneNumber1,
          email: email1,
          address: address1,
        },
        {
          fullName: name2,
          relationship: relation2,
          phoneNumber: phoneNumber2,
          email: email2,
          address: address2,
        },
      ];
      dispatch(
        addcompleteProfile({
          contact: contact,
        }),
      );
      setisLoading(true);
      const res: any = await completeProfile({contact: contact});
      console.log('result', res?.data);
      if (res?.status === 200 || res?.status === 201) {
        navigation.navigate('ProfileStep4', {
          serviceId: route?.params?.serviceId,
        });
        dispatch(addformStage(4));
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
      setisLoading(false);
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
    setisLoading(false);
  };

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
      <ProfileStepWrapper active={'three'} />
      <ScrollView>
        <View style={{marginHorizontal: 20}}>
          <TextWrapper
            children="References"
            fontType={'semiBold'}
            style={{fontSize: 20, marginTop: 30, color: colors.black}}
          />
          <TextWrapper
            children="Who can we contact in emergency situation?"
            fontType={'semiBold'}
            style={{fontSize: 16, marginTop: 13, color: colors.black}}
          />
          <TextWrapper
            children="Contact 1"
            fontType={'semiBold'}
            style={{fontSize: 14, marginTop: 13, color: colors.black}}
          />
          <TextWrapper
            children="Full Name"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            labelText={''}
            state={name1}
            setState={text => {
              setName1(text);
              // console.log(text);
            }}
          />

          <TextWrapper
            children="Relationship to you"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            labelText={''}
            state={relation1}
            setState={setRelation1}
          />

          <TextWrapper
            children="Phone Number"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            keyBoardType="number-pad"
            labelText={''}
            state={phoneNumber1}
            setState={setPhoneNumber1}
          />

          <TextWrapper
            children="Email Address"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            labelText={''}
            keyBoardType={'email-address'}
            state={email1}
            setState={setEmail1}
          />

          <TextWrapper
            children="Address"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 16, marginTop: 20, color: colors.black}}
          />
          <View
            style={{
              height: 130,
              borderRadius: 8,
              backgroundColor: colors.greyLight1,
              marginTop: 13,
            }}>
            <TextInputs
              styleInput={{color: colors.black, paddingHorizontal: 18}}
              style={{marginTop: 0, backgroundColor: colors.greyLight1}}
              labelText={'Enter address'}
              state={address1}
              setState={setAddress1}
              multiline={true}
              nbLines={5}
            />
          </View>
          <TextWrapper
            children="Contact 2"
            fontType={'semiBold'}
            style={{fontSize: 14, marginTop: 13, color: colors.black}}
          />
          <TextWrapper
            children="Full Name"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{
              marginTop: 10,
              backgroundColor: colors.greyLight1,
              display: 'none',
            }}
            labelText={''}
            state={name2}
            setState={setName2}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            labelText={''}
            state={name2}
            setState={setName2}
          />

          <TextWrapper
            children="Relationship to you"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            labelText={''}
            state={relation2}
            setState={setRelation2}
          />

          <TextWrapper
            children="Phone Number"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            keyBoardType="number-pad"
            labelText={''}
            state={phoneNumber2}
            setState={setPhoneNumber2}
          />

          <TextWrapper
            children="Email Address"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 13, marginTop: 13, color: colors.black}}
          />
          <TextInputs
            style={{marginTop: 10, backgroundColor: colors.greyLight1}}
            keyBoardType="email-address"
            labelText={''}
            state={email2}
            setState={setEmail2}
          />

          <TextWrapper
            children="Address"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 16, marginTop: 20, color: colors.black}}
          />
          <View
            style={{
              height: 130,
              borderRadius: 8,
              backgroundColor: colors.greyLight1,
              marginTop: 13,
            }}>
            <TextInputs
              styleInput={{color: colors.black, paddingHorizontal: 18}}
              style={{marginTop: 0, backgroundColor: colors.greyLight1}}
              labelText={'Enter address'}
              state={address2}
              setState={setAddress2}
              multiline={true}
              nbLines={5}
            />
          </View>

          <View
            style={[
              generalStyles.rowBetween,
              {marginTop: 40, marginBottom: 35},
            ]}>
            {/* <Button
              onClick={() => {}}
              style={{width: 130, backgroundColor: colors.lightBlack}}
              textStyle={{color: colors.primary}}
              text={'Save'}
            /> */}

            {!isLoading ? (
              <Button
                onClick={() => {
                  // navigation.navigate('ProfileStep4', {
                  //   serviceId: route?.params?.serviceId,
                  // });
                  handleProfileSetup();
                }}
                style={[
                  tw`ml-auto`,
                  {width: 90, backgroundColor: colors.lightBlack},
                ]}
                textStyle={{color: colors.primary}}
                text={'Next'}
              />
            ) : (
              <ActivityIndicator
                style={{marginRight: 30}}
                size={'large'}
                color={colors.parpal}
              />
            )}
          </View>
          <View style={{height: 50}} />
        </View>
      </ScrollView>
      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </View>
  );
};

export default ProfileStep3;
