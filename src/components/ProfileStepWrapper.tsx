import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, } from 'react-native';
import { generalStyles } from '../constants/generalStyles';
import TextWrapper from './TextWrapper';
import colors from '../constants/colors';

type ProfileStepWrapperProps = {
  active: string
}

export default function ({ active }: ProfileStepWrapperProps) {
  return (
    <View style={[generalStyles.rowCenter, { marginHorizontal: 20 }]}>
      <View style={[generalStyles.contentCenter, { width: 20, height: 20, borderRadius: 20, backgroundColor: active == 'one' ? colors.parpal : colors.white }]}>
        <TextWrapper
          fontType={'semiBold'}
          style={{
            fontSize: 12,
            color: active == 'one' ? colors.primary : colors.black,
          }}>
          1
        </TextWrapper>
      </View>
      <View style={{ height: 1, backgroundColor: colors.black, width: 15 }} />
      <View style={[generalStyles.contentCenter, { width: 20, height: 20, borderRadius: 20, backgroundColor: active == 'two' ? colors.parpal : colors.white }]}>
        <TextWrapper
          fontType={'semiBold'}
          style={{
            fontSize: 12,
            color: active == 'two' ? colors.primary : colors.black,
          }}>
          2
        </TextWrapper>
      </View>
      <View style={{ height: 1, backgroundColor: colors.black, width: 15 }} />
      <View style={[generalStyles.contentCenter, { width: 20, height: 20, borderRadius: 20, backgroundColor: active == 'three' ? colors.parpal : colors.white }]}>
        <TextWrapper
          fontType={'semiBold'}
          style={{
            fontSize: 12,
            color: active == 'three' ? colors.primary : colors.black,
          }}>
          3
        </TextWrapper>
      </View>
      <View style={{ height: 1, backgroundColor: colors.black, width: 15 }} />
      <View style={[generalStyles.contentCenter, { width: 20, height: 20, borderRadius: 20, backgroundColor: active == 'four' ? colors.parpal : colors.white }]}>
        <TextWrapper
          fontType={'semiBold'}
          style={{
            fontSize: 12,
            color: active == 'four' ? colors.primary : colors.black,
          }}>
          4
        </TextWrapper>
      </View>
      <View style={{ height: 1, backgroundColor: colors.black, width: 15 }} />
      <View style={[generalStyles.contentCenter, { width: 20, height: 20, borderRadius: 20, backgroundColor: active == 'five' ? colors.parpal : colors.white }]}>
        <TextWrapper
          fontType={'semiBold'}
          style={{
            fontSize: 12,
            color: active == 'five' ? colors.primary : colors.black,
          }}>
          5
        </TextWrapper>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  start: {
    height: 56,
    elevation: 3,
    backgroundColor: '#88087B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
