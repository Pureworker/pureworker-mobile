import React, {useState} from 'react';
import {
  Image,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import Header from '../../components/Header';
import images from '../../constants/images';
import Button from '../../components/Button';
import TextWrapper from '../../components/TextWrapper';
import commonStyle from '../../constants/commonStyle';
import colors from '../../constants/colors';
import ProfileStepWrapper from '../../components/ProfileStepWrapper';
import DateTimesPicker from '../../components/DatePicker';
import {generalStyles} from '../../constants/generalStyles';
import {
  useCreateServiceMutation,
  useLoginMutation,
} from '../../store/slice/api';
import Snackbar from 'react-native-snackbar';
import {addcompleteProfile, emptyCategory} from '../../store/reducer/mainSlice';
import {useDispatch, useSelector} from 'react-redux';
import {completeProfile} from '../../utils/api/func';

type Route = {
  key: string;
  name: string;
  params: {
    serviceId: string;
  };
};

const ProfileStep5 = () => {
  const route: Route = useRoute();
  const dispatch = useDispatch();

  const navigation = useNavigation<StackNavigation>();
  const [date, setDate] = useState(new Date());
  const handleDate = (dateTime: any) => {
    setDate(dateTime);
  };
  const [time, setTime] = useState(new Date());
  const handleTime = (dateTime: any) => {
    setTime(dateTime);
  };
  const [isLoading, setisLoading] = useState(false);

  function formatDateToTime(timestamp) {
    const _date = new Date(timestamp);
    const hours = _date.getHours();
    const minutes = _date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }
  function formatDateToCustomString(timestamp) {
    const _date = new Date(timestamp);
    const options = {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    };
    return _date.toLocaleDateString('en-US', options);
  }

  // console.log(date, time);

  // const [createService, {isLoading}] = useCreateServiceMutation();
  const _completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  const category = useSelector((state: any) => state.user.pickedServices);
  console.log(_completeProfileData?.serviceIntro, _completeProfileData);

  function processProfileData(data: any, categoryData: any) {
    // Process priceRange
    const processedPriceRange = data.priceRange.map(item => ({
      maxPrice: item.priceMax,
      minPrice: item.priceMin,
      service: item.service,
      serviceName: item.serviceName,
    }));

    // Process serviceIntro
    const processedServiceIntro = data.serviceIntro.map(item => ({
      description: item.description,
      service: categoryData.find(
        (_category: {value: any}) => _category.value === item.service,
      )?._id,
    }));

    // Return the processed data
    return {
      ...data,
      priceRange: processedPriceRange,
      serviceIntro: processedServiceIntro,
    };
  }

  const handleProfileSetup = async () => {
    setisLoading(true);
    if (date && time) {
      dispatch(
        addcompleteProfile({
          meetingSchedule: {
            date: formatDateToCustomString(date),
            time: formatDateToTime(time),
          },
        }),
      );
      const _d = {
        meetingSchedule: {
          date: formatDateToCustomString(date),
          time: formatDateToTime(time),
        },
      };
      console.log(_d);
      // const processedData = processProfileData(_completeProfileData, category);
      // console.log('processedData', processedData);
      // const res = await completeProfile({...processedData});
      // console.log('result', res);
      const res = await completeProfile({
        meetingSchedule: {
          date: formatDateToCustomString(date),
          time: formatDateToTime(time),
        },
      });

      if (res?.status === 200 || res?.status === 201) {
        navigation.navigate('Congratulations');
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
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
      setisLoading(false);
    }
    setisLoading(false);
  };
  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: colors.greyLight}]}>
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
      <ProfileStepWrapper active={'five'} />
      <ScrollView>
        <View style={{marginHorizontal: 20}}>
          <TextWrapper
            children="Schedule a Face to Face Meeting"
            fontType={'semiBold'}
            style={{fontSize: 20, marginTop: 30, color: colors.black}}
          />

          <TextWrapper
            children="Select a Date"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 14, marginTop: 13, color: colors.black}}
          />
          <TouchableOpacity
            style={[
              generalStyles.rowBetween,
              {
                marginTop: 15,
                marginBottom: 10,
                backgroundColor: colors.greyLight1,
                borderRadius: 5,
                height: 50,
                width: '100%',
              },
            ]}>
            <View style={{marginTop: -10, width: '100%'}}>
              <DateTimesPicker
                updateDate={handleDate}
                isImage={true}
                image={images.calendar}
              />
            </View>
            {/* <Image
              source={images.calendar}
              resizeMode={'contain'}
              style={{ width: 15, height: 15, marginRight: 20 }}
            /> */}
          </TouchableOpacity>
          <TextWrapper
            children="Select appointment time"
            isRequired={true}
            fontType={'semiBold'}
            style={{fontSize: 14, marginTop: 13, color: colors.black}}
          />
          <TouchableOpacity
            style={[
              generalStyles.rowBetween,
              {
                marginTop: 15,
                marginBottom: 10,
                backgroundColor: colors.greyLight1,
                borderRadius: 5,
                height: 50,
                width: '100%',
              },
            ]}>
            <View style={{marginTop: -10, width: '100%'}}>
              <DateTimesPicker
                updateDate={handleTime}
                type={'time'}
                isImage={true}
                image={images.time}
              />
            </View>
            {/* <Image
              source={images.time}
              resizeMode={'contain'}
              style={{ width: 15, height: 15, marginRight: 20 }}
            /> */}
          </TouchableOpacity>

          {!isLoading ? (
            <Button
              onClick={() => {
                handleProfileSetup();
              }}
              style={{
                marginHorizontal: 40,
                marginTop: 140,
                backgroundColor: colors.lightBlack,
              }}
              textStyle={{color: colors.primary}}
              text={'Schedule'}
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
    </SafeAreaView>
  );
};

export default ProfileStep5;
