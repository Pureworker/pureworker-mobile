import React, {useEffect} from 'react';
import {View} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import Button from '../../components/Button';
import TextWrapper from '../../components/TextWrapper';
import colors from '../../constants/colors';
import {useCreateServiceMutation} from '../../store/slice/api';
import {useDispatch, useSelector} from 'react-redux';
import tw from 'twrnc';
import {addUserData} from '../../store/reducer/mainSlice';
import {getUser, triggerComplete} from '../../utils/api/func';

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
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  console.log(completeProfileData);

  useEffect(() => {
    const initGetUsers = async () => {
      const res: any = await getUser('');
      console.log('dd', res?.data?.user);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addUserData(res?.data?.user));
      }
    };
    const _triggerComplete = async () => {
      const res: any = await triggerComplete();
      console.log('ddkk', res?.data);
      if (res?.status === 201 || res?.status === 200) {
      }
    };
    _triggerComplete();
    initGetUsers();
  }, []);

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
              navigation.navigate('Homes');
              // navigation.navigate('Index');
              // navigation.navigate('Index');
              // navigation.navigate('Homes');
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
