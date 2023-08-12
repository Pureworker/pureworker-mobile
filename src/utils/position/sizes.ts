import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');
export const SIZES = {
  width,
  height,
};

export const perHeight = (param: number) => {
  const ratio = Number(param) / 667;
  const value = ratio * SIZES.height;
  return value;
};

export const perWidth = (param: number) => {
  const ratio = Number(param) / 375;
  const value = ratio * SIZES.width;
  return value;
};
