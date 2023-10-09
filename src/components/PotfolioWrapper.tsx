import React, {useEffect, useState} from 'react';
import {View, Image, TextInput, TouchableOpacity} from 'react-native';

import TextWrapper from './TextWrapper';
import images from '../constants/images';
import colors from '../constants/colors';
import {WIDTH_WINDOW, generalStyles} from '../constants/generalStyles';

const PotfolioWrapper = ({
  index,
  item,
  allPotfolio,
  setAllPotfolio,
  setPotfolioImageObject,
  setShortDescription,
  setPotfolioImageUrl,
  setEditKey,
}: any) => {
  return (
    <View key={index} style={{marginBottom: 20}}>
      <View style={[generalStyles.rowBetween]}>
        <View
          style={{
            paddingHorizontal: 10,
            justifyContent: 'center',
            backgroundColor: colors.lightBlack,
            height: 50,
            width: 160,
            borderRadius: 5,
          }}>
          <TextWrapper
            fontType={'semiBold'}
            style={{
              fontSize: 12,
              color: '#fff',
            }}>
            {item?.shortDescription}
          </TextWrapper>
        </View>
        <View style={[generalStyles.rowCenter]}>
          <TouchableOpacity
            onPress={() => {
              setPotfolioImageUrl(item?.potfolioImages);
              setEditKey(item?.key);
              setShortDescription(item?.shortDescription);
            }}>
            <Image
              source={images.edit}
              resizeMode="contain"
              style={{width: 20, height: 20, marginLeft: 20, tintColor: '#000'}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              let leftPotfolio = allPotfolio.filter(
                (el: any) => el.key !== item?.key,
              );
              setAllPotfolio(leftPotfolio);
              setPotfolioImageUrl([]);
              setEditKey(null);
              setShortDescription('');
            }}>
            <Image
              source={images.bin}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                marginHorizontal: 20,
                tintColor: '#000',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default PotfolioWrapper;
