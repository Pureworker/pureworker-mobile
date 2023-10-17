import {View, Text, TextInput, Platform} from 'react-native';
import React, {useState} from 'react';
import TextWrapper from './TextWrapper';
import {WIDTH_WINDOW} from '../constants/generalStyles';
import colors from '../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {addcompleteProfile} from '../store/reducer/mainSlice';

export default function ServiceIntroComp({item, index}: any) {
  const servicesDescription = useSelector(
    (state: any) => state.user.completeProfileData?.serviceIntro,
  );

  console.log('item-here', item);
  const [value, setvalue] = useState(servicesDescription[index]?.description);
  console.log('SD', servicesDescription);
  const dispatch = useDispatch();
  const handleDescriptionChange = (item: any, value: any) => {
    // const newArray = servicesDescription?.map((service: {service: any}) => {
    //   if (service.service === item?.service) {
    //     return {
    //       ...service,
    //       description: value,
    //     };
    //   }
    //   //   setServicesDescription(newArray);
    //   dispatch(addcompleteProfile({serviceIntro: newArray}));
    //   return service;
    const updatedInputValues: any = [...servicesDescription];
    updatedInputValues[index] = {
      ...updatedInputValues[index],
      description: value,
    };
    console.warn('here',updatedInputValues);
    dispatch(addcompleteProfile({serviceIntro: updatedInputValues}));
    // setServicesDescription(updatedInputValues);
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: WIDTH_WINDOW - 40,
        justifyContent: 'space-between',
        marginBottom: 13,
      }}>
      <View
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
          {item?.service}
        </TextWrapper>
      </View>
      <TextInput
        style={{
          width: '60%',
          paddingHorizontal: 10,
          backgroundColor: colors.lightBlack,
          borderRadius: 5,
          color: '#fff',
          height: Platform.OS === 'ios' ? 50 : 50,
        }}
        placeholderTextColor={colors.grey}
        placeholder="Enter service description"
        value={value} // Assign value from state
        onChangeText={value => {
          // handleInputChange(index, value)
          // setServicesDescription(item);
          setvalue(value);
          handleDescriptionChange(item, value);
          // dispatch(addcompleteProfile({serviceIntro: servicesDescription}));
        }}
      />
    </View>
  );
}
