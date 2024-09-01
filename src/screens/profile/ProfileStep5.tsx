import React, {useState} from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
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
import Snackbar from 'react-native-snackbar';
import {addcompleteProfile} from '../../store/reducer/mainSlice';
import {useDispatch, useSelector} from 'react-redux';
import {completeProfile} from '../../utils/api/func';

const ProfileStep5 = () => {
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

  function formatDateToTime(timestamp: any) {
    const _date = new Date(timestamp);
    const hours = _date.getHours();
    const minutes = _date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }
  function formatDateToCustomString(timestamp: any) {
    const _date = new Date(timestamp);
    const options = {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    };
    return _date.toLocaleDateString('en-US', options);
  }

  const _completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  // const category = useSelector((state: any) => state.user.pickedServices);
  console.log(_completeProfileData?.serviceIntro, _completeProfileData);

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
          duration: Snackbar.LENGTH_LONG,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      }
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_LONG,
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
