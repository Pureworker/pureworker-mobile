import {View, Text, TextInput, Platform} from 'react-native';
import React, {useState} from 'react';
import TextWrapper from './TextWrapper';
import {WIDTH_WINDOW, generalStyles} from '../constants/generalStyles';
import colors from '../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {addcompleteProfile} from '../store/reducer/mainSlice';

export default function ServicePriceComp({item, index}: any) {
  const servicesDescription = useSelector(
    (state: any) => state.user.completeProfileData?.priceRange,
  );
  const [min_p, setmin_p] = useState(item?.priceMin || '');
  const [max_p, setmax_p] = useState(item?.priceMax || '');
  console.log('PDD', servicesDescription);
  const dispatch = useDispatch();
  const handleDescriptionChange = (item: any, value: any) => {
    const updatedInputValues: any = [...servicesDescription];
    updatedInputValues[index] = {
      ...updatedInputValues[index],
      description: value,
    };
    dispatch(addcompleteProfile({priceRange: updatedInputValues}));
    // setServicesDescription(updatedInputValues);
  };

  const handleServicePriceMinChange = (index: number, priceMin: string) => {
    const updatedInputValues: any = [...servicesDescription];
    updatedInputValues[index] = {...updatedInputValues[index], priceMin};
    dispatch(addcompleteProfile({priceRange: updatedInputValues}));
    // setServicePrice(updatedInputValues);
  };
  const handleServicePriceMaxChange = (index: number, priceMax: string) => {
    const updatedInputValues: any = [...servicesDescription];
    updatedInputValues[index] = {...updatedInputValues[index], priceMax};
    dispatch(addcompleteProfile({priceRange: updatedInputValues}));
    // setServicePrice(updatedInputValues);
  };
  return (
    <View
      // key={index}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: WIDTH_WINDOW - 40,
        justifyContent: 'space-between',
        marginBottom: 13,
      }}>
      <View
        // key={index}
        style={{
          paddingHorizontal: 10,
          justifyContent: 'center',
          backgroundColor: colors.lightBlack,
          height: 50,
          width: 120,
          borderRadius: 5,
        }}>
        <TextWrapper
          numberOfLines={1}
          fontType={'semiBold'}
          style={{
            fontSize: 12,
            color: '#fff',
          }}>
          {item?.serviceName}
        </TextWrapper>
      </View>

      <View style={[generalStyles.rowCenter]}>
        <TextInput
          style={{
            width: 80,
            paddingHorizontal: 10,
            backgroundColor: colors.lightBlack,
            borderRadius: 5,
            color: '#fff',
            height: Platform.OS === 'ios' ? 50 : 50,
          }}
          placeholderTextColor={colors.grey}
          placeholder="N"
          keyboardType="number-pad"
          key={index}
          value={min_p} // Assign value from state
          onChangeText={value => {
            handleServicePriceMinChange(index, value);
            setmin_p(value);
          }}
        />
        <TextWrapper
          fontType={'semiBold'}
          style={{
            fontSize: 12,
            color: colors.black,
            marginHorizontal: 10,
          }}>
          to
        </TextWrapper>
        <TextInput
          style={{
            width: 80,
            paddingHorizontal: 10,
            backgroundColor: colors.lightBlack,
            borderRadius: 5,
            color: '#fff',
            height: Platform.OS === 'ios' ? 50 : 50,
          }}
          placeholderTextColor={colors.grey}
          placeholder="N"
          keyboardType="number-pad"
          key={index}
          value={max_p} // Assign value from state
          onChangeText={value => {
            handleServicePriceMaxChange(index, value);
            setmax_p(value);
          }}
        />
      </View>
    </View>
  );
}
