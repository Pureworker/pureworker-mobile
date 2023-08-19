import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import colors from '../../constants/colors';

const Ratings = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  const [deactivateAccount, setdeactivateAccount] = useState(false);
  const [deleteAccount, setdeleteAccount] = useState(false);
  return (
    <View style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
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
            text={'Rating'}
            size={17}
            lineHeight={17}
            color={'#000413'}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{minHeight: SIZES.height}}>
        <View style={[tw` flex-1`]}>
          <View style={tw`mx-auto mt-[5%]`}>
            <Textcomp
              text={'How your Rating is calculated'}
              size={14}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>

          <View style={[tw` mt-[5%] mx-auto`, {width: perWidth(332)}]}>
            <View style={tw``}>
              <Textcomp
                text={'How your rating is calculated'}
                size={16}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <View style={tw`mt-2`}>
              <Textcomp
                text={
                  "After each service request, service providers rate the customer from 1 to 5 stars. Based on your previous 365-day rating, we calculate your average rating, which you'll see in the app."
                }
                size={12}
                lineHeight={14.5}
                color={'#000000'}
                fontFamily={'Inter'}
              />
            </View>
          </View>
          <View style={[tw` mt-[5%] mx-auto`, {width: perWidth(332)}]}>
            <View style={tw``}>
              <Textcomp
                text={'Why is my customer rating important?'}
                size={16}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <View style={tw`mt-1`}>
              <Textcomp
                text={
                  'Service providers see customer ratings before accepting service requests, so they may choose to decline your request if you have a low customer rating. Maintaining a high rating maximizes the chances a service provider will accept your request.'
                }
                size={12}
                lineHeight={14.5}
                color={'#000000'}
                fontFamily={'Inter'}
              />
            </View>
          </View>
          <View style={[tw` mt-[5%] mx-auto`, {width: perWidth(332)}]}>
            <View style={tw``}>
              <Textcomp
                text={'Customer behavior tips'}
                size={16}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <View style={tw`mt-1`}>
              <Textcomp
                text={`Here are some top tips on how to maintain a high customer rating score:
- Be respectful and considerate
We want customers and service providers to have a positive experience on the Pureworker platform. Please be mindful of your language and behavior while communicating with the service provider and always treat them with respect.
- Provide clear instructions and timely feedback
Be clear about what you want and provide specific instructions to the service provider. After the service is completed, leave timely and honest feedback on their performance.
- Be punctual
Respect the service provider's time and arrive on time for scheduled appointments. If you need to cancel or reschedule, give them sufficient notice.
- Pay fairly and promptly
Agree on a fair price with the service provider before they begin the work, and pay promptly after the service is completed. Avoid haggling or negotiating after the service is completed.
- Avoid cancelling service requests (if possible)
In some situations, we understand that you may need to cancel a service request. However, if you do this continuously or cancel just before the service provider arrives, you may receive a low rating.
                `}
                size={12}
                lineHeight={14.5}
                color={'#000000'}
                fontFamily={'Inter'}
              />
            </View>
          </View>
        </View>
        <View style={tw`h-40`} />
      </ScrollView>
      <View style={tw`h-0.5 w-full bg-black absolute  bottom-[3%]`} />
    </View>
  );
};

export default Ratings;
