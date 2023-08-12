import {Image, View, TouchableOpacity, Platform} from 'react-native';
import {SIZES, perHeight, perWidth} from '../utils/position/sizes';
import React, {useState} from 'react';
import images from '../constants/images';
import tw from 'twrnc';
import Textcomp from './Textcomp';
import colors from '../constants/colors';
import {Rating, AirbnbRating} from 'react-native-ratings';

const Orderscomponent2 = ({item, index, status}: any) => {
  const [saved, setsaved] = useState(false);
  return (
    <View
      style={[
        tw` mt-4 mx-auto bg-[${colors.darkPurple}]`,
        {
          height: perWidth(195),
          width: SIZES.width * 0.95,
          borderWidth: 0,
          borderRadius: 5,
          paddingHorizontal: perWidth(16),
          paddingVertical: perWidth(14),
        },
      ]}>
      <View style={tw`flex flex-row `}>
        <View style={[tw``, {width: perWidth(50), height: perWidth(50)}]}>
          <Image
            resizeMode="cover"
            style={{
              width: perWidth(50),
              height: perWidth(50),
              borderRadius: perWidth(50) / 2,
            }}
            source={images.welcome}
          />
          <View
            style={[
              tw`absolute bottom-0 border-2 right-1 rounded-full`,
              {width: 8, height: 8, backgroundColor: colors.green},
            ]}
          />
        </View>
        <View style={[tw`flex-1`, {marginLeft: perWidth(12)}]}>
          <View style={[tw`flex flex-row justify-between`, {}]}>
            {status === 'Inprogress' && (
              <View style={[tw``, {}]}>
                <Textcomp
                  text={'IN PROGRESS'}
                  size={14}
                  lineHeight={16}
                  color={colors.primary}
                  fontFamily={'Inter-Bold'}
                />
              </View>
            )}
            {status === 'Pending' && (
              <View style={[tw``, {}]}>
                <Textcomp
                  text={'PENDING'}
                  size={14}
                  lineHeight={16}
                  color={'#C705B3'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
            )}
            {status === 'Accepted' && (
              <View style={[tw``, {}]}>
                <Textcomp
                  text={'ACCEPTED'}
                  size={14}
                  lineHeight={16}
                  color={'#29D31A'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
            )}
            {status === 'Completed' && (
              <View style={[tw``, {}]}>
                <Textcomp
                  text={'COMPLETED'}
                  size={14}
                  lineHeight={16}
                  color={'#FFC727'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
            )}
            {status === 'Declined' && (
              <View style={[tw``, {}]}>
                <Textcomp
                  text={'DECLINED'}
                  size={14}
                  lineHeight={16}
                  color={'#EB001B'}
                  fontFamily={'Inter-Bold'}
                />
              </View>
            )}

            <View style={[tw``, {}]}>
              <Textcomp
                text={'$ 10'}
                size={14}
                lineHeight={16}
                color={colors.white}
                fontFamily={'Inter-Bold'}
              />
            </View>
          </View>
          <View style={[tw``, {width: perWidth(252), marginTop: perHeight(4)}]}>
            <Textcomp
              text={
                'Be your social media manager and provide shares and signals'
              }
              size={12}
              lineHeight={14}
              color={colors.white}
              fontFamily={'Inter-SemiBold'}
              numberOfLines={2}
            />
          </View>
        </View>
      </View>
      <View>
        <View style={[tw``, {width: perWidth(105), marginTop: perWidth(4)}]}>
          <Textcomp
            text={'Jennifer A.'}
            size={12}
            lineHeight={14}
            color={colors.white}
            fontFamily={'Inter-SemiBold'}
          />
        </View>
      </View>
      <View>
        <View
          style={[
            tw` mx-auto`,
            {width: perWidth(300), marginTop: perWidth(5)},
          ]}>
          <Textcomp
            text={'Address: '}
            size={12}
            lineHeight={14}
            color={colors.white}
            fontFamily={'Inter-Regular'}
          />
        </View>
        <View
          style={[
            tw` mx-auto`,
            {width: perWidth(300), marginTop: perWidth(5)},
          ]}>
          <Textcomp
            text={'Date & Time: '}
            size={12}
            lineHeight={14}
            color={colors.white}
            fontFamily={'Inter-Regular'}
          />
        </View>
        <View
          style={[
            tw` mx-auto`,
            {width: perWidth(300), marginTop: perWidth(5)},
          ]}>
          <Textcomp
            text={'Location: '}
            size={12}
            lineHeight={14}
            color={colors.white}
            fontFamily={'Inter-Regular'}
          />
        </View>
      </View>

      {status === 'Pending' && (
        <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              tw`bg-[${colors.primary}] items-center justify-center`,
              {
                width: perWidth(90),
                height:
                  Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                borderRadius: 7,
              },
            ]}>
            <Textcomp
              text={'Accept'}
              size={12}
              lineHeight={14}
              color={colors.black}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              tw`bg-[${colors.primary}] items-center justify-center`,
              {
                width: perWidth(90),
                height:
                  Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                borderRadius: 7,
                marginLeft: perWidth(46),
              },
            ]}>
            <Textcomp
              text={'Decline '}
              size={12}
              lineHeight={14}
              color={colors.black}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
        </View>
      )}
      {status === 'Accepted' && (
        <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              tw`bg-[${colors.primary}] items-center justify-center`,
              {
                width: perWidth(90),
                height:
                  Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                borderRadius: 7,
              },
            ]}>
            <Textcomp
              text={'Start Job '}
              size={12}
              lineHeight={14}
              color={colors.black}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              tw`bg-[${colors.primary}] items-center justify-center`,
              {
                width: perWidth(90),
                height:
                  Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                borderRadius: 7,
                marginLeft: perWidth(46),
              },
            ]}>
            <Textcomp
              text={'Reschedule'}
              size={12}
              lineHeight={14}
              color={colors.black}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
        </View>
      )}
      {status === 'Inprogress' && (
        <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              tw`bg-[${colors.primary}] items-center justify-center`,
              {
                width: perWidth(90),
                height:
                  Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                borderRadius: 7,
              },
            ]}>
            <Textcomp
              text={'Completed '}
              size={12}
              lineHeight={14}
              color={colors.black}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              tw`bg-[${colors.primary}] items-center justify-center`,
              {
                width: perWidth(90),
                height:
                  Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                borderRadius: 7,
                marginLeft: perWidth(46),
              },
            ]}>
            <Textcomp
              text={'Dispute '}
              size={12}
              lineHeight={14}
              color={colors.black}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
        </View>
      )}
      {status === 'Completed' && (
        <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              tw`bg-[${colors.primary}] items-center justify-center`,
              {
                width: perWidth(190),
                height:
                  Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                borderRadius: 7,
              },
            ]}>
            <Textcomp
              text={'Review Customer '}
              size={12}
              lineHeight={14}
              color={colors.black}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
        </View>
      )}
      {status === 'Declined' && (
        <View style={tw`mx-auto flex flex-row justify-between mt-4`}>
          <TouchableOpacity
            onPress={() => {}}
            style={[
              tw`bg-[${colors.primary}] items-center justify-center`,
              {
                width: perWidth(190),
                height:
                  Platform.OS === 'ios' ? perHeight(22.5) : perHeight(27.5),
                borderRadius: 7,
              },
            ]}>
            <Textcomp
              text={'Dispute '}
              size={12}
              lineHeight={14}
              color={colors.black}
              fontFamily={'Inter-SemiBold'}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default Orderscomponent2;
