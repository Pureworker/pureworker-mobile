import {View, Text, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import commonStyle from '../constants/commonStyle';
import images from '../constants/images';
import {WIDTH_WINDOW} from '../constants/generalStyles';
import colors from '../constants/colors';

export default function FAQcomp({index, item}: any) {
  const [open, setopen] = useState(false);
  return (
    <View
      key={index}
      style={{
        backgroundColor: '#2D303C',
        paddingHorizontal: 10,
        marginTop: 20,
        borderWidth: 1,
        width: WIDTH_WINDOW * 0.95,
        borderColor: colors.parpal,
        marginHorizontal: 'auto',
        marginRight: 'auto',
        marginLeft: 'auto',
        borderRadius: 3,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 5,
          // marginTop: 10,
        }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: commonStyle.fontFamily.medium,
            color: '#FFCE1F',
            fontWeight: '700',
            width: WIDTH_WINDOW * 0.805,
          }}>
          {item?.question}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setopen(!open);
          }}>
          {open ? (
            <Image
              source={images.downtri}
              style={{width: 25, height: 25, tintColor: colors.parpal}}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={images.sidetri}
              style={{width: 20, height: 20, tintColor: colors.parpal}}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
      {open && (
        <Text
          style={{
            fontSize: 16,
            marginBottom: 12,
            fontFamily: commonStyle.fontFamily.medium,
            color: '#fff',
            fontWeight: '700',
            marginTop: 18,
          }}>
          {item?.answer}
        </Text>
      )}
    </View>
  );
}
