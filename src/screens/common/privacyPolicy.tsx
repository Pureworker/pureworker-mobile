import React, {useEffect} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {SIZES, perWidth} from '../../utils/position/sizes';
import {getContent} from '../../utils/api/func';
import {addPrivacyPolicy} from '../../store/reducer/mainSlice';
import RenderHtml from 'react-native-render-html';

const PrivacyPolicy = () => {
  const navigation = useNavigation<StackNavigation>();
  const dispatch = useDispatch();
  const userType = useSelector((state: any) => state.user.isLoggedIn);
  const privacyPolicy = useSelector((state: any) => state.user.privacyPolicy);
  useEffect(() => {
    const getPolicyCustomer = async () => {
      console.log(
        userType.userType === 'CUSTOMER' ? 'Customer Terms' : 'SPTerms',
      );
      const res: any = await getContent(
        userType.userType === 'CUSTOMER' ? 'Customer Terms' : 'SPTerms',
      );
      console.log(res?.data);

      if (res?.status === 201 || res?.status === 200) {
        dispatch(addPrivacyPolicy(res?.data?.data));
      }
    };
    getPolicyCustomer();
  }, []);

  return (
    <SafeAreaView style={[{flex: 1, backgroundColor: '#EBEBEB'}]}>
      <View
        style={{
          marginTop:
            Platform.OS === 'ios'
              ? 10
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
            text={'Privacy Policy'}
            size={17}
            lineHeight={17}
            color={'#000413'}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
      </View>
      <View style={tw` h-[87.5%]`}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{minHeight: SIZES.height}}>
          {userType.userType !== 'CUSTOMER' && (
            <>
              {privacyPolicy.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={[tw` mt-[5%] mx-auto`, {width: perWidth(332)}]}>
                    <View style={tw``}>
                      <Textcomp
                        text={item?.title}
                        size={16}
                        lineHeight={17}
                        color={'#000000'}
                        fontFamily={'Inter-SemiBold'}
                      />
                    </View>
                    <View style={tw`mt-1`}>
                      <RenderHtml
                        baseStyle={{
                          fontSize: 12,
                          lineHeight: 14.5,
                          color: '#000000',
                          fontFamily: 'Inter',
                        }}
                        tagsStyles={{
                          p: {
                            margin: 0,
                          },
                        }}
                        contentWidth={perWidth(332)}
                        source={{
                          html: item?.body,
                        }}
                        enableExperimentalMarginCollapsing
                        enableExperimentalBRCollapsing
                        enableExperimentalGhostLinesPrevention
                      />
                    </View>
                  </View>
                );
              })}
            </>
          )}

          {userType.userType === 'CUSTOMER' && (
            <>
              {privacyPolicy?.map(
                (
                  item: {title: string; body: any},
                  index: React.Key | null | undefined,
                ) => {
                  return (
                    <View
                      key={index}
                      style={[tw` mt-[5%] mx-auto`, {width: perWidth(332)}]}>
                      <View style={tw``}>
                        <Textcomp
                          text={item?.title}
                          size={16}
                          lineHeight={17}
                          color={'#000000'}
                          fontFamily={'Inter-SemiBold'}
                        />
                      </View>
                      <View style={tw`mt-1`}>
                        <RenderHtml
                          baseStyle={{
                            fontSize: 12,
                            lineHeight: 14.5,
                            color: '#000000',
                            fontFamily: 'Inter',
                          }}
                          tagsStyles={{
                            p: {
                              margin: 0,
                            },
                          }}
                          contentWidth={perWidth(332)}
                          source={{
                            html: item?.body,
                          }}
                          enableExperimentalMarginCollapsing
                          enableExperimentalBRCollapsing
                          enableExperimentalGhostLinesPrevention
                        />
                      </View>
                    </View>
                  );
                },
              )}
            </>
          )}
          <View style={tw`h-40`} />
        </ScrollView>
      </View>
      <View style={tw`h-0.5 w-full bg-black absolute  bottom-[3%]`} />
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
