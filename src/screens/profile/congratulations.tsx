import React, {useState} from 'react';
import {
  Image,
  View,
  ActivityIndicator,
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
import colors from '../../constants/colors';
import ProfileStepWrapper from '../../components/ProfileStepWrapper';
import DateTimesPicker from '../../components/DatePicker';
import {generalStyles} from '../../constants/generalStyles';
import {
  useCreateServiceMutation,
  useLoginMutation,
} from '../../store/slice/api';
import Snackbar from 'react-native-snackbar';
import {useDispatch, useSelector} from 'react-redux';
import tw from 'twrnc';

type Route = {
  key: string;
  name: string;
  params: {
    serviceId: string;
  };
};

const Congratulations = () => {
  const route: Route = useRoute();
  const dispatch = useDispatch();

  const navigation = useNavigation<StackNavigation>();

  const [createService, {isLoading}] = useCreateServiceMutation();
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  console.log(completeProfileData);

  return (
    <View style={[{flex: 1, backgroundColor: colors.greyLight}]}>
      <View style={tw`my-auto mt-[55%]`}>
        <View style={{marginHorizontal: 20}}>
          <TextWrapper
            children="Congratulations"
            fontType={'semiBold'}
            style={{fontSize: 20, marginTop: 30, color: colors.black}}
          />

          <TextWrapper
            children="You have completed your registration. Please check your email for next steps."
            fontType={'semiBold'}
            style={{fontSize: 14, marginTop: 30, color: colors.black}}
          />
          <Button
            onClick={() => {
              navigation.navigate('Home');
            }}
            style={{
              marginHorizontal: 40,
              marginTop: 100,
              backgroundColor: colors.lightBlack,
            }}
            textStyle={{color: colors.primary}}
            text={'Done'}
          />
        </View>
      </View>
    </View>
  );
};

export default Congratulations;
