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
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../../constants/navigation';
import images from '../../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import colors from '../../../constants/colors';
import {SIZES, perHeight, perWidth} from '../../../utils/position/sizes';
import {getProviderByService, getUserNotification} from '../../../utils/api/func';
import {
  addnotifications,
  addviewedNotifications,
} from '../../../store/reducer/mainSlice';
import NotificationComp from './NotifComp';

const Index = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();

  const [isLoading, setisLoading] = useState(false);
  const userData = useSelector((state: any) => state.user.userData);
  const notifications = useSelector((state: any) => state.user.notifications);
  const viewedNotification = useSelector(
    (state: any) => state.user.viewedNotifications,
  );

  useEffect(() => {
    const initNotifications = async () => {
      setisLoading(true);
      const id = '';
      const res: any = await getUserNotification(userData?._id);
      console.log('dddddddd', res?.data);
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addnotifications(res?.data?.data));
      }
      // setloading(false);
      setisLoading(false);
    };
    initNotifications();
  }, []);

  const seenNotification = (item: any) => {
    const data = viewedNotification || [];
    console.log('---DATA', data);
    // data.push(item);
    addviewedNotifications([...data, item]);
    console.log('---DATA', data);
    // getNotifications();
  };
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
          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={images.back}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity> */}
          <View style={tw`mx-auto mt-3`}>
            <Textcomp
              text={'Notifications'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>
        <View style={tw`flex-1`}>
          <View
            style={[
              tw`bg-[${colors.darkPurple}] flex flex-row justify-between mx-auto mt-4 p-2 px-4 rounded`,
              {height: perHeight(95), width: perWidth(348)},
            ]}>
            <View>
              <View style={tw`mr-auto `}>
                <Textcomp
                  text={'Stay up to date!'}
                  size={14}
                  lineHeight={16.5}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <View style={tw`mr-auto w-[90%] mt-2`}>
                <Textcomp
                  text={'Turn on notifications so you don’t miss any updates.'}
                  size={12}
                  lineHeight={14.5}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </View>
              <TouchableOpacity
                onPress={() => {}}
                style={tw`mr-auto border  border-[${colors.primary}] px-4 py-2 rounded-lg  mt-auto`}>
                <Textcomp
                  text={'Turn on notifications'}
                  size={12}
                  lineHeight={14.5}
                  color={'#FFFFFF'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={images.cross}
                style={{height: 15, width: 20}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              tw` bg-[#E0E0E0] items-center justify-between px-4 mx-auto mt-4 rounded flex flex-row`,
              {width: perWidth(348), height: perHeight(50)},
            ]}>
            <View>
              <Image
                source={images.menu}
                style={{height: 15, width: 20}}
                resizeMode="contain"
              />
            </View>
            <View style={tw``}>
              <Textcomp
                text={'You have 3 unread messages'}
                size={14}
                lineHeight={16}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <View style={tw``}>
              <Textcomp
                text={'2h'}
                size={17}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter'}
              />
            </View>
          </View>

          <View
            style={[
              tw` bg-[#E0E0E0] mt-4 items-center justify-between px-4 mx-auto mt-4 rounded flex flex-row`,
              {width: perWidth(348), height: perHeight(50)},
            ]}>
            <View>
              <Image
                source={images.pureWorkerLogo}
                style={{height: 20, width: 20}}
                resizeMode="contain"
              />
            </View>
            <View style={tw``}>
              <Textcomp
                text={'Push notifications will appear here'}
                size={14}
                lineHeight={16}
                color={'#000413'}
                fontFamily={'Inter-SemiBold'}
              />
            </View>
            <View style={tw``}>
              <Textcomp
                text={'2h'}
                size={17}
                lineHeight={17}
                color={'#000413'}
                fontFamily={'Inter'}
              />
            </View>
          </View>

          {notifications !== null && notifications.length < 1 && (
            <View
              style={[
                tw`mx-auto`,
                {
                  marginTop: perHeight(30),

                  width: perWidth(348),
                },
              ]}>
              {[1, 2, 3, 4].map((item, index): any => {
                let seen = false;
                if (viewedNotification?.includes(item.date)) {
                  seen = true;
                }
                return (
                  <NotificationComp
                    item={item}
                    seen={() => {
                      seenNotification(item.date);
                    }}
                    seen_={seen}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
